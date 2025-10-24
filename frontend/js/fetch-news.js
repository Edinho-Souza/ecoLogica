/**
 * @file fetch-news.js
 * Busca, processa e exibe feeds RSS na página de notícias.
 * Utiliza rss2json.com como proxy para evitar problemas de CORS.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos DOM Principais ---
    const feedContainer = document.getElementById('rss-feed-container');
    const loadingMessage = document.getElementById('loading-message');

    // --- Configuração ---
    const RSS_FEEDS_URLS = [
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fg1.globo.com%2Fnatureza%2Frss.xml',       // G1 Natureza
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fciclovivo.com.br%2Ffeed%2F',            // CicloVivo (Sustentabilidade)
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Foeco.org.br%2Ffeed%2F'                 // ((o))eco (Jornalismo Ambiental)
        // Adicione mais URLs de feeds aqui
    ];
    const NUMBER_OF_ITEMS_TO_SHOW = 15; // Quantidade de notícias a exibir
    const DESCRIPTION_MAX_LENGTH = 250;  // Limite de caracteres para a descrição

    // ===================================================================
    // FUNÇÕES AUXILIARES (Helpers)
    // ===================================================================

    /**
     * Limpa o texto de descrição (remove tags HTML e limita o tamanho).
     * @param {string} descriptionHtml - O texto HTML vindo do feed.
     * @returns {string} - O texto limpo e truncado.
     */
    const sanitizeDescription = (descriptionHtml) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = descriptionHtml || '';
        let descriptionText = tempDiv.textContent || tempDiv.innerText || '';
        
        if (descriptionText.length > DESCRIPTION_MAX_LENGTH) {
            descriptionText = descriptionText.substring(0, DESCRIPTION_MAX_LENGTH) + '...';
        }
        return descriptionText;
    };

    /**
     * Formata a data e a fonte para exibição.
     * @param {string} pubDate - A string de data do item.
     * @param {string} [author=''] - O autor ou fonte do item.
     * @returns {string} - A string de metadados formatada (ex: "Publicado em: 24/10/2025 | Fonte: G1")
     */
    const formatMetaData = (pubDate, author = '') => {
        let metaText = 'Data indisponível';
        try {
            const date = new Date(pubDate);
            if (!isNaN(date)) {
                metaText = `Publicado em: ${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            }
        } catch (e) {
            console.warn("Não foi possível formatar a data:", pubDate, e);
        }

        if (author) {
            metaText += ` | Fonte: ${author}`;
        }
        return metaText;
    };

    /**
     * Cria e retorna um elemento <article> completo para um item de notícia.
     * @param {object} item - O objeto do item de notícia (título, link, pubDate, etc.)
     * @param {string} [sourceTitle=''] - O título da fonte do feed.
     * @returns {HTMLElement} - O elemento <article> pronto para ser inserido no DOM.
     */
    const createRssItemElement = (item, sourceTitle = '') => {
        const article = document.createElement('article');
        article.classList.add('rss-item');

        // Título com link
        const title = document.createElement('h2');
        title.classList.add('rss-item-title');
        const titleLink = document.createElement('a');
        titleLink.href = item.link;
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.textContent = item.title || 'Título indisponível';
        title.appendChild(titleLink);

        // Metadados (Data e Fonte)
        const author = item.author || item.creator || sourceTitle;
        const meta = document.createElement('p');
        meta.classList.add('rss-item-meta');
        meta.textContent = formatMetaData(item.pubDate, author);

        // Descrição
        const descriptionText = sanitizeDescription(item.description || item.content);
        const description = document.createElement('p');
        description.classList.add('rss-item-description');
        description.textContent = descriptionText;

        // Link "Leia mais"
        const readMore = document.createElement('a');
        readMore.classList.add('rss-item-readmore');
        readMore.href = item.link;
        readMore.target = '_blank';
        readMore.rel = 'noopener noreferrer';
        readMore.textContent = 'Leia mais →';

        // Monta o artigo
        article.appendChild(title);
        article.appendChild(meta);
        if (descriptionText.trim()) { // Só adiciona descrição se ela existir
            article.appendChild(description);
        }
        article.appendChild(readMore);

        return article;
    };

    // ===================================================================
    // FUNÇÃO PRINCIPAL (Fetch e Renderização)
    // ===================================================================

    /**
     * Busca todos os feeds RSS, processa os dados e os exibe no container.
     */
    const fetchAndDisplayFeeds = async () => {
        let allItems = []; // Array para guardar todos os itens de todos os feeds
        loadingMessage.style.display = 'block'; // Mostra "Carregando..."

        try {
            // 1. Buscar todos os feeds em paralelo
            const responses = await Promise.all(RSS_FEEDS_URLS.map(url => fetch(url)));
            const feedData = await Promise.all(responses.map(res => {
                if (!res.ok) {
                    console.error(`Erro ao buscar feed: ${res.url}, Status: ${res.status}`);
                    return { status: 'error', items: [] }; // Retorna objeto de erro
                }
                return res.json();
            }));

            // 2. Processar e juntar os itens
            feedData.forEach(feed => {
                if (feed.status === 'ok' && feed.items) {
                    // Adiciona o título da fonte a cada item para referência
                    feed.items.forEach(item => item.sourceTitle = feed.feed?.title || ''); 
                    allItems = allItems.concat(feed.items);
                } else {
                    console.warn(`Feed ${feed.feed?.url || 'desconhecido'} retornou status: ${feed.status}. Itens não adicionados.`);
                }
            });

            // 3. Ordenar todos os itens por data
            allItems.sort((a, b) => {
                const dateA = new Date(a.pubDate);
                const dateB = new Date(b.pubDate);
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;
                return dateB - dateA; // Mais novo primeiro
            });

            // 4. Esconder loading e limpar container
            loadingMessage.style.display = 'none';
            feedContainer.innerHTML = ''; // Limpa o container

            // 5. Pegar o número limitado de itens para exibir
            const itemsToShow = allItems.slice(0, NUMBER_OF_ITEMS_TO_SHOW);

            // 6. Renderizar os itens no DOM
            if (itemsToShow.length > 0) {
                itemsToShow.forEach((item, index) => {
                    // Cria o elemento <article>
                    const articleElement = createRssItemElement(item, item.sourceTitle);
                    feedContainer.appendChild(articleElement);

                    // Adiciona a linha divisória (exceto após o último item)
                    if (index < itemsToShow.length - 1) {
                        const divider = document.createElement('hr');
                        divider.classList.add('rss-item-divider');
                        feedContainer.appendChild(divider);
                    }
                });
            } else {
                feedContainer.innerHTML = '<p>Não foi possível carregar as notícias no momento. Verifique as fontes RSS ou tente novamente mais tarde.</p>';
            }

        } catch (error) {
            // Tratamento de erro geral (ex: falha de rede)
            console.error("Erro ao processar feeds RSS:", error);
            loadingMessage.style.display = 'none';
            feedContainer.innerHTML = '<p>Ocorreu um erro ao carregar as notícias. Verifique o console para mais detalhes.</p>';
        }
    };

    // ===================================================================
    // INICIALIZAÇÃO
    // ===================================================================

    // Só executa se estivermos na página de notícias
    if (feedContainer) {
        fetchAndDisplayFeeds();
    }
});