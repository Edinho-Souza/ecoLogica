document.addEventListener('DOMContentLoaded', () => {
    // Pega o container onde as notícias serão inseridas e a mensagem de loading
    const feedContainer = document.getElementById('rss-feed-container');
    const loadingMessage = document.getElementById('loading-message');

    // ==========================================================
    //   CONFIGURAÇÃO DOS FEEDS RSS (CURADOS)
    // ==========================================================
    // Lista de URLs dos feeds RSS que você quer exibir
    // IMPORTANTE: Use o serviço rss2json para converter para JSON e evitar CORS
    // Fontes selecionadas: G1 Natureza, CicloVivo e ((o))eco
    const rssFeeds = [
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fg1.globo.com%2Fnatureza%2Frss.xml',           // G1 Natureza
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fciclovivo.com.br%2Ffeed%2F',                // CicloVivo (Sustentabilidade)
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Foeco.org.br%2Ffeed%2F'                     // ((o))eco (Jornalismo Ambiental)
        // Você pode adicionar mais feeds aqui se encontrar outras boas fontes
    ];

    // ==========================================================
    //   FUNÇÃO PARA BUSCAR E EXIBIR AS NOTÍCIAS
    // ==========================================================
    const fetchAndDisplayFeeds = async () => {
        if (!feedContainer || !loadingMessage) {
            console.error("Elemento container ou mensagem de loading não encontrado em noticias.html!");
            return;
        }

        let allItems = []; // Array para guardar todos os itens de todos os feeds

        try {
            // Mostra a mensagem de carregamento
            loadingMessage.style.display = 'block';

            // Busca os dados de todos os feeds em paralelo
            const responses = await Promise.all(rssFeeds.map(url => fetch(url)));
            const feedData = await Promise.all(responses.map(res => {
                if (!res.ok) {
                    console.error(`Erro ao buscar feed: ${res.url}, Status: ${res.status}`);
                    return { items: [] }; // Retorna vazio se houver erro
                }
                return res.json();
            }));

            // Junta os itens de todos os feeds em um único array
            feedData.forEach(feed => {
                // Verifica se o status da resposta do rss2json foi 'ok'
                if (feed.status === 'ok' && feed.items) {
                    allItems = allItems.concat(feed.items);
                } else {
                    console.warn(`Feed ${feed.feed?.url || 'desconhecido'} retornou status: ${feed.status}. Itens não adicionados.`);
                }
            });

            // Ordena todos os itens pela data de publicação (do mais novo para o mais antigo)
            // Tratamento para datas inválidas
            allItems.sort((a, b) => {
                const dateA = new Date(a.pubDate);
                const dateB = new Date(b.pubDate);
                // Coloca itens com data inválida no final
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;
                return dateB - dateA;
             });

            // Limpa a mensagem de "Carregando..."
            loadingMessage.style.display = 'none';

            // Limita o número de notícias a serem exibidas (opcional)
            const numberOfItemsToShow = 15; // Aumentei um pouco para ter mais conteúdo
            const itemsToShow = allItems.slice(0, numberOfItemsToShow);


            // Cria o HTML para cada item de notícia e insere no container
            if (itemsToShow.length > 0) {
                feedContainer.innerHTML = ''; // Limpa o container antes de adicionar novos itens
                itemsToShow.forEach((item, index) => {
                    const article = document.createElement('article');
                    article.classList.add('rss-item');

                    // Título com link
                    const title = document.createElement('h2');
                    title.classList.add('rss-item-title');
                    const titleLink = document.createElement('a');
                    titleLink.href = item.link;
                    titleLink.target = '_blank'; // Abrir em nova aba
                    titleLink.rel = 'noopener noreferrer'; // Boa prática de segurança
                    titleLink.textContent = item.title || 'Título indisponível';
                    title.appendChild(titleLink);

                    // Data de publicação (formatada) e Autor/Fonte (se disponível)
                    const meta = document.createElement('p');
                    meta.classList.add('rss-item-meta');
                    let metaText = 'Data indisponível';
                    try {
                        const pubDate = new Date(item.pubDate);
                        if (!isNaN(pubDate)) {
                            metaText = `Publicado em: ${pubDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
                        }
                    } catch (e) { /* Ignora erro de data inválida */ }

                    // Tenta adicionar o autor ou o nome do feed como fonte
                    const author = item.author || item.creator || feedData.find(f => f.items?.includes(item))?.feed?.title;
                    if(author) {
                        metaText += ` | Fonte: ${author}`;
                    }
                    meta.textContent = metaText;

                    // Descrição (limpa e limitada)
                    const description = document.createElement('p');
                    description.classList.add('rss-item-description');
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.description || item.content || '';
                    let descriptionText = tempDiv.textContent || tempDiv.innerText || '';
                    if (descriptionText.length > 250) { // Aumentei um pouco o limite
                       descriptionText = descriptionText.substring(0, 250) + '...';
                    }
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
                    if (descriptionText.trim()) {
                      article.appendChild(description);
                    }
                    article.appendChild(readMore);

                    // Adiciona o artigo ao container
                    feedContainer.appendChild(article);

                    // Adiciona a linha divisória depois de cada artigo (exceto o último)
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
            console.error("Erro ao processar feeds RSS:", error);
            loadingMessage.style.display = 'none';
            feedContainer.innerHTML = '<p>Ocorreu um erro ao carregar as notícias. Verifique o console para mais detalhes.</p>';
        }
    };

    // Chama a função para buscar e exibir os feeds quando a página carregar
    // Apenas executa se estivermos na página de notícias (verificando a existência do container)
    if (feedContainer) {
        fetchAndDisplayFeeds();
    }
});