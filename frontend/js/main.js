/**
 * @file main.js
 * Script principal do site.
 * 1. Carrega os parciais HTML (header, footer, etc).
 * 2. Inicializa todos os componentes interativos (modal, banner, menu, etc.).
 * 3. Gerencia o estado de login (simulado) do usuário.
 * 4. Chama scripts específicos da página (como mapa), se existirem.
 */

document.addEventListener("DOMContentLoaded", function () {

    // ===================================================================
    // FUNÇÕES DE UTILIDADE
    // ===================================================================

    /**
     * Atualiza o texto e o estado dos botões de login (desktop e mobile).
     * Lê do localStorage se o usuário está logado.
     */
    const updateUserAuthDisplay = () => {
        // console.log("updateUserAuthDisplay: Função iniciada."); // Debug

        // Seleciona os elementos relevantes
        const userAuthSpan = document.getElementById('userAuthSpan');       // Span no botão do header desktop
        const headerAuthButton = userAuthSpan ? userAuthSpan.closest('button') : null; // Botão do header desktop
        const offcanvasAuthButton = document.getElementById('offcanvasAuthButton'); // Botão no offcanvas mobile

        // Verifica o localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        // console.log(`updateUserAuthDisplay: localStorage lido - isLoggedIn='${isLoggedIn}', username='${username}'`); // Debug

        if (isLoggedIn === 'true' && username) {
            // --- ESTADO LOGADO ---
            // console.log("updateUserAuthDisplay: CONDIÇÃO IF (logado) - VERDADEIRA."); // Debug

            // Atualiza botão do header (desktop)
            if (userAuthSpan && headerAuthButton) {
                userAuthSpan.textContent = `Olá, ${username}`;
                headerAuthButton.setAttribute('data-logged-in', 'true');
            }

            // Atualiza botão do offcanvas (mobile)
            if (offcanvasAuthButton) {
                offcanvasAuthButton.textContent = `Olá, ${username}`;
                offcanvasAuthButton.setAttribute('data-logged-in', 'true');
            }

        } else {
            // --- ESTADO NÃO LOGADO ---
            // console.log("updateUserAuthDisplay: CONDIÇÃO ELSE (não logado) - VERDADEIRA."); // Debug

            // Restaura botão do header (desktop)
            if (userAuthSpan && headerAuthButton) {
                userAuthSpan.textContent = 'Entre ou cadastre-se';
                headerAuthButton.removeAttribute('data-logged-in');
            }

            // Restaura botão do offcanvas (mobile)
            if (offcanvasAuthButton) {
                offcanvasAuthButton.textContent = 'Entrar ou Cadastrar';
                offcanvasAuthButton.removeAttribute('data-logged-in');
            }
        }
        // console.log("updateUserAuthDisplay: Função concluída."); // Debug
    };

    /**
     * Carrega um arquivo HTML parcial e o injeta em um elemento da página.
     * @param {string} elementId - O ID do elemento placeholder (ex: "placeholder-header").
     * @param {string} filePath - O caminho para o arquivo .html (ex: "partials/header.html").
     */
    const carregarHTML = (elementId, filePath) => {
        // Tenta encontrar o elemento placeholder na página atual
        const elemento = document.getElementById(elementId);

        // **MODIFICAÇÃO AQUI:** Se o elemento NÃO for encontrado,
        // simplesmente retorna uma promessa resolvida e não faz mais nada.
        if (!elemento) {
            // console.log(`carregarHTML: Placeholder '${elementId}' não encontrado nesta página. Pulando ${filePath}.`); // Log opcional para debug
            return Promise.resolve(); // <-- Retorna sucesso silenciosamente
        }

        // Se o elemento FOI encontrado, continua carregando o HTML
        return fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`[ERRO 404] Arquivo não encontrado: ${filePath}`);
                return response.text();
            })
            .then(html => {
                elemento.innerHTML = html;
                // Log de verificação (mantido para garantir que o ID do span seja encontrado)
                if (elementId === 'placeholder-header') {
                    console.log('carregarHTML: CONTEÚDO DO HEADER INJETADO em #placeholder-header.');
                    console.log('carregarHTML: Verificando #userAuthSpan LOGO APÓS injeção:', document.getElementById('userAuthSpan'));
                }
            })
            .catch(error => {
                // Erros de fetch (404, rede) ainda serão mostrados
                console.error(`carregarHTML: Erro ao carregar ${filePath} para #${elementId}:`, error);
                // Mesmo em caso de erro de fetch, resolvemos para não parar Promise.all
                return Promise.resolve(); // <-- Resolve mesmo em erro de fetch para não travar
            });
    };

    // ===================================================================
    // INICIALIZADOR PRINCIPAL
    // ===================================================================

    /**
     * Função principal. Ativa TODOS os componentes interativos da página
     * APÓS o carregamento dos parciais HTML.
     */
    const inicializarComponentes = () => {
        console.log("Página montada! Ativando TODOS os componentes...");

        // --- Ativa o Carrossel (Banner) ---
        const bannerCarouselEl = document.getElementById('bannerCarousel');
        if (bannerCarouselEl) {
            new bootstrap.Carousel(bannerCarouselEl, {
                interval: 5000,
                ride: 'carousel'
            });
        }

        // --- Ativa a Barra de Pesquisa ---
        const searchBtn = document.getElementById('searchBtn');
        const searchBox = document.getElementById('searchBox');
        if (searchBtn && searchBox) {
            searchBtn.addEventListener('click', () => {
                searchBox.style.width = (searchBox.style.width === '200px') ? '0' : '200px';
                if (searchBox.style.width === '200px') searchBox.querySelector('input').focus();
            });
        }

        // --- Ativa o Modal (Lógica Unificada de Clique) ---
        const authModal = document.getElementById('authModal');
        const closeModalBtn = document.querySelector('.close-modal');
        const headerAuthButton = document.querySelector('.btn-custom.btn-auth'); // Botão header desktop
        const offcanvasAuthButton = document.getElementById('offcanvasAuthButton'); // Botão offcanvas mobile

        if (authModal && closeModalBtn) {

            // Listener para o BOTÃO DO HEADER (Desktop)
            if (headerAuthButton) {
                headerAuthButton.addEventListener('click', (event) => {
                    if (headerAuthButton.getAttribute('data-logged-in') === 'true') {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("[DEBUG] Header Logado: Redirecionando...");
                        window.location.href = 'usuario.html';
                    } else {
                        console.log("[DEBUG] Header Não Logado: Abrindo modal...");
                        authModal.style.display = 'flex';
                    }
                });
            } else {
                console.warn("Botão de autenticação do header (.btn-custom.btn-auth) não encontrado.");
            }

            // Listener para o BOTÃO DO OFFCANVAS (Mobile)
            if (offcanvasAuthButton) {
                offcanvasAuthButton.addEventListener('click', (event) => {
                    const offcanvasElement = document.getElementById('offcanvasMenu');
                    const offcanvasInstance = offcanvasElement ? bootstrap.Offcanvas.getInstance(offcanvasElement) : null;

                    if (offcanvasAuthButton.getAttribute('data-logged-in') === 'true') {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("[DEBUG] Offcanvas Logado: Fechando e preparando para redirecionar...");

                        if (offcanvasInstance) {
                            offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
                                console.log("[DEBUG] Offcanvas Logado: Evento hidden disparado. Redirecionando.");
                                window.location.href = 'usuario.html';
                            }, { once: true });
                            offcanvasInstance.hide();
                        } else {
                            console.warn("[DEBUG] Offcanvas Logado: Instância não encontrada. Redirecionando direto.");
                            window.location.href = 'usuario.html';
                        }
                    } else {
                        console.log("[DEBUG] Offcanvas Não Logado: Fechando e abrindo modal...");
                        if (offcanvasInstance) {
                            offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
                                console.log("[DEBUG] Offcanvas Não Logado: Evento hidden disparado. Abrindo modal.");
                                authModal.style.display = 'flex';
                            }, { once: true });
                            offcanvasInstance.hide();
                        } else {
                            console.warn("[DEBUG] Offcanvas Não Logado: Instância não encontrada. Abrindo modal direto.");
                            authModal.style.display = 'flex';
                        }
                    }
                });
            } else {
                console.warn("Botão de autenticação do offcanvas (#offcanvasAuthButton) não encontrado.");
            }

            // --- Lógica Interna do Modal (Fechar, Abas, Recuperar Senha) ---
            closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });
            window.addEventListener('click', (e) => { if (e.target === authModal) authModal.style.display = 'none'; });

            const tabButtons = authModal.querySelectorAll('.tab-btn');
            const forms = authModal.querySelectorAll('.modal-form');
            const tabsContainer = authModal.querySelector('.auth-tabs');
            const recoverForm = authModal.querySelector('#recoverForm');
            const recoverLink = authModal.querySelector('.recover-link');
            const backToLoginLink = authModal.querySelector('.back-to-login-link');

            if (tabButtons.length > 0 && forms.length > 0) {
                tabButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        tabButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        forms.forEach(f => f.classList.remove('active'));
                        const targetForm = document.getElementById(btn.dataset.tab + 'Form');
                        if (targetForm) {
                            targetForm.classList.add('active');
                        } else {
                            console.error(`Formulário alvo #${btn.dataset.tab + 'Form'} não encontrado.`);
                        }
                        if (recoverForm) recoverForm.classList.remove('active');
                        if (tabsContainer) tabsContainer.style.display = 'flex';
                    });
                });
            }

            if (recoverLink && forms.length > 0 && tabsContainer && recoverForm) {
                recoverLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    forms.forEach(f => f.classList.remove('active'));
                    tabsContainer.style.display = 'none';
                    recoverForm.classList.add('active');
                });
            }

            if (backToLoginLink && forms.length > 0 && tabsContainer && recoverForm) {
                backToLoginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    recoverForm.classList.remove('active');
                    tabsContainer.style.display = 'flex';
                    const loginForm = document.getElementById('loginForm');
                    const loginTab = authModal.querySelector('.tab-btn[data-tab="login"]');
                    const registerTab = authModal.querySelector('.tab-btn[data-tab="register"]');
                    if (loginForm) loginForm.classList.add('active');
                    if (loginTab) loginTab.classList.add('active');
                    if (registerTab) registerTab.classList.remove('active');
                });
            }
            // --- Fim da Lógica Interna do Modal ---

        } else {
            if (!authModal) console.warn("Modal de autenticação (#authModal) não encontrado.");
            if (!closeModalBtn) console.warn("Botão de fechar modal (.close-modal) não encontrado.");
            console.warn("Lógica principal do modal desativada.");
        }
        // --- FIM DO BLOCO DO MODAL ---

        // --- Ativa o Botão "Voltar ao Topo" ---
        const backToTopButton = document.getElementById("back-to-top");
        if (backToTopButton) {
            window.onscroll = () => {
                const shouldBeVisible = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
                backToTopButton.style.display = shouldBeVisible ? "block" : "none";
            };
            backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        }

        // --- Ativa o Menu Offcanvas do Bootstrap (Mobile) ---
        const offcanvasElement = document.getElementById('offcanvasMenu');
        if (offcanvasElement) {
            new bootstrap.Offcanvas(offcanvasElement);
        }

        // --- LÓGICA DO RODAPÉ COLAPSÁVEL ---
        const footerToggles = document.querySelectorAll('.footer-toggle');
        footerToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const linksList = toggle.nextElementSibling;
                if (linksList && linksList.classList.contains('footer-links-list')) {
                    linksList.classList.toggle('active');
                }
            });
        });

        // --- LÓGICA DO CARROSSEL DE PARCEIROS ---
        const wrapper = document.querySelector('.logo-slider-wrapper');
        if (wrapper) {
            const track = wrapper.querySelector('.logo-track');
            const prevBtn = wrapper.querySelector('#logo-prev-btn');
            const nextBtn = wrapper.querySelector('#logo-next-btn');
            let originalItems = Array.from(track.children);

            if (originalItems.length > 0) {
                const itemWidth = 200;
                const itemsToClone = Math.ceil(wrapper.offsetWidth / itemWidth);

                for (let i = 0; i < itemsToClone; i++) {
                    const index = (originalItems.length - 1 - i + originalItems.length) % originalItems.length;
                    track.insertBefore(originalItems[index].cloneNode(true), track.firstChild);
                }
                for (let i = 0; i < itemsToClone; i++) {
                    track.appendChild(originalItems[i].cloneNode(true));
                }

                track.style.width = `${Array.from(track.children).length * itemWidth}px`;
                let currentIndex = itemsToClone;
                let isTransitioning = false;

                const setPosition = (instant = false) => {
                    track.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
                    track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
                };
                setPosition(true);

                const move = (direction) => {
                    if (isTransitioning) return;
                    isTransitioning = true;
                    direction === 'next' ? currentIndex++ : currentIndex--;
                    setPosition();
                };
                nextBtn.addEventListener('click', () => move('next'));
                prevBtn.addEventListener('click', () => move('prev'));

                track.addEventListener('transitionend', () => {
                    if (currentIndex >= originalItems.length + itemsToClone) {
                        currentIndex = itemsToClone;
                        setPosition(true);
                    }
                    if (currentIndex < itemsToClone) {
                        currentIndex = originalItems.length + itemsToClone - 1;
                        setPosition(true);
                    }
                    isTransitioning = false;
                });
            }
        } // Fim Carrossel Parceiros

        // --- ATUALIZA O DISPLAY DE LOGIN/USUÁRIO ---
        // (Chamada após a inicialização de todos os componentes principais)
        updateUserAuthDisplay();

        // --- TENTA INICIALIZAR O MAPA LEAFLET ---
        // (Verifica se a função existe, pois mapa.js é carregado condicionalmente)
        if (typeof inicializarMapaLeaflet === 'function') {
            inicializarMapaLeaflet();
        }

    }; // --- Fim da função inicializarComponentes ---

    // ===================================================================
    // EXECUÇÃO (ORDEM DE MONTAGEM)
    // ===================================================================

    const todasAsPartes = [
        carregarHTML("placeholder-header", "partials/header.html"),
        carregarHTML("placeholder-banner", "partials/banner.html"),
        carregarHTML("placeholder-campanhas", "partials/campanhasAtivas.html"),
        carregarHTML("placeholder-ranking", "partials/ranking.html"),
        carregarHTML("placeholder-newsletter", "partials/newsletter.html"),
        carregarHTML("placeholder-rodape", "partials/rodape.html"),
        carregarHTML("placeholder-imagem-rodape", "partials/imagemRodape.html"),
        carregarHTML("placeholder-modal", "partials/modal.html"),
        carregarHTML("placeholder-botao-topo", "partials/botaoVoltarTopo.html"),
        carregarHTML("placeholder-menu", "partials/menuOffcanvas.html"),
        carregarHTML("placeholder-redesocial", "partials/redesocial.html"),
        // Adicione aqui placeholders de páginas que têm mapa, ex:
        // carregarHTML("placeholder-mapa-principal", "partials/mapa.html")
    ];

    // Espera TODAS as partes serem carregadas e SÓ ENTÃO inicializa tudo
    Promise.all(todasAsPartes).then(() => {
        inicializarComponentes();
    });

});