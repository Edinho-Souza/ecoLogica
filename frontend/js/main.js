/**
 * @file main.js
 * Script principal do site.
 * 1. Carrega os parciais HTML (header, footer, etc).
 * 2. Inicializa todos os componentes interativos (modal, banner, menu, etc.).
 * 3. Gerencia o Login Real com o Backend.
 */

document.addEventListener("DOMContentLoaded", function () {

    // ===================================================================
    // CARREGAMENTO DE CONFIGURAÇÕES GLOBAIS
    // ===================================================================
    const DEFAULT_SETTINGS = {
        settingTelegramLink: "https://t.me/+Fsirxfskk-MyOTRh",
        settingFacebookLink: "#",
        settingInstagramLink: "#",
        settingContactEmail: "contato@ecologica.com",
        settingContactPhone: "(00) 1234-5678"
    };
    let currentSettings = {};

    const loadGlobalSettings = () => {
        const storedSettings = localStorage.getItem('ecoLogica_Settings');
        if (storedSettings) {
            try {
                currentSettings = JSON.parse(storedSettings);
                currentSettings = { ...DEFAULT_SETTINGS, ...currentSettings };
            } catch (e) {
                console.error("Erro ao carregar configurações globais:", e);
                currentSettings = { ...DEFAULT_SETTINGS };
            }
        } else {
            currentSettings = { ...DEFAULT_SETTINGS };
        }
    };

    // Carrega as configurações GLOBAIS primeiro
    loadGlobalSettings();


    // ===================================================================
    // FUNÇÕES DE UTILIDADE
    // ===================================================================

    /**
     * Atualiza o texto e o estado dos botões de login (desktop e mobile).
     */
    const updateUserAuthDisplay = () => {
        const userAuthSpan = document.getElementById('userAuthSpan');
        const headerAuthButton = userAuthSpan ? userAuthSpan.closest('button') : null;
        const offcanvasAuthButton = document.getElementById('offcanvasAuthButton');

        // Verifica token em vez de apenas flag booleana
        const token = localStorage.getItem('user_token');
        
        // Tenta pegar o nome do usuário do token ou do localStorage antigo
        let username = localStorage.getItem('username'); 
        
        // Se tem token mas não tem username salvo, tenta decodificar (opcional)
        if (token && !username) {
            const decoded = parseJwt(token);
            username = decoded.sub || decoded.nome || "Usuário";
        }

        if (token) {
            // --- ESTADO LOGADO ---
            if (userAuthSpan && headerAuthButton) {
                userAuthSpan.textContent = `Olá, ${username || 'Usuário'}`;
                headerAuthButton.setAttribute('data-logged-in', 'true');
            }
            if (offcanvasAuthButton) {
                offcanvasAuthButton.textContent = `Olá, ${username || 'Usuário'}`;
                offcanvasAuthButton.setAttribute('data-logged-in', 'true');
            }
        } else {
            // --- ESTADO NÃO LOGADO ---
            if (userAuthSpan && headerAuthButton) {
                userAuthSpan.textContent = 'Entre ou cadastre-se';
                headerAuthButton.removeAttribute('data-logged-in');
            }
            if (offcanvasAuthButton) {
                offcanvasAuthButton.textContent = 'Entrar ou Cadastrar';
                offcanvasAuthButton.removeAttribute('data-logged-in');
            }
        }
    };

    /**
     * Carrega um arquivo HTML parcial.
     */
    const carregarHTML = (elementId, filePath) => {
        const elemento = document.getElementById(elementId);
        if (!elemento) return Promise.resolve();

        return fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`[ERRO 404] Arquivo não encontrado: ${filePath}`);
                return response.text();
            })
            .then(html => {
                elemento.innerHTML = html;

                // Lógica específica pós-carregamento de parciais
                if (elementId === 'placeholder-rodape') {
                    const emailSpan = document.getElementById('footer-contact-email');
                    const phoneSpan = document.getElementById('footer-contact-phone');
                    if (emailSpan) emailSpan.textContent = currentSettings.settingContactEmail;
                    if (phoneSpan) phoneSpan.textContent = currentSettings.settingContactPhone;
                }
                if (elementId === 'placeholder-redesocial') {
                    const telegramLink = document.querySelector('#placeholder-redesocial a[aria-label="Telegram"]');
                    const facebookLink = document.querySelector('#placeholder-redesocial a[aria-label="Facebook"]');
                    const instagramLink = document.querySelector('#placeholder-redesocial a[aria-label="Instagram"]');
                    if (telegramLink) telegramLink.href = currentSettings.settingTelegramLink;
                    if (facebookLink) facebookLink.href = currentSettings.settingFacebookLink;
                    if (instagramLink) instagramLink.href = currentSettings.settingInstagramLink;
                }
            })
            .catch(error => {
                console.error(`carregarHTML: Erro ao carregar ${filePath}:`, error);
                return Promise.resolve();
            });
    };

    // ===================================================================
    // INICIALIZADOR PRINCIPAL
    // ===================================================================

    const inicializarComponentes = () => {
        console.log("Inicializando componentes interativos...");

        // 1. Banner Carrossel
        const bannerCarouselEl = document.getElementById('bannerCarousel');
        if (bannerCarouselEl) {
            new bootstrap.Carousel(bannerCarouselEl, { interval: 5000, ride: 'carousel' });
        }

        // 2. Barra de Pesquisa
        const searchBtn = document.getElementById('searchBtn');
        const searchBox = document.getElementById('searchBox');
        if (searchBtn && searchBox) {
            searchBtn.addEventListener('click', () => {
                searchBox.style.width = (searchBox.style.width === '200px') ? '0' : '200px';
                if (searchBox.style.width === '200px') searchBox.querySelector('input').focus();
            });
        }

        // 3. Modal de Autenticação (Abertura/Fechamento)
        const authModal = document.getElementById('authModal');
        const closeModalBtn = document.querySelector('.close-modal');
        const headerAuthButton = document.querySelector('.btn-custom.btn-auth');
        const offcanvasAuthButton = document.getElementById('offcanvasAuthButton');

        if (authModal && closeModalBtn) {
            
            // Função auxiliar para redirecionar se já logado
            const handleAuthClick = (e) => {
                const token = localStorage.getItem('user_token');
                if (token) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Verifica token para saber se é admin ou user para redirecionar corretamente
                    const decoded = parseJwt(token);
                    const role = (decoded.role || decoded.tipoUsuario || "").toLowerCase();
                    if (role === 'admin' || role === 'administrador') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    authModal.style.display = 'flex';
                }
            };

            if (headerAuthButton) headerAuthButton.addEventListener('click', handleAuthClick);
            
            if (offcanvasAuthButton) {
                offcanvasAuthButton.addEventListener('click', (e) => {
                    const offcanvasElement = document.getElementById('offcanvasMenu');
                    const offcanvasInstance = offcanvasElement ? bootstrap.Offcanvas.getInstance(offcanvasElement) : null;
                    if (offcanvasInstance) offcanvasInstance.hide();
                    handleAuthClick(e);
                });
            }

            closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });
            window.addEventListener('click', (e) => { if (e.target === authModal) authModal.style.display = 'none'; });

            // Abas do Modal (Login vs Cadastro)
            const tabButtons = authModal.querySelectorAll('.tab-btn');
            const forms = authModal.querySelectorAll('.modal-form');
            
            if (tabButtons.length > 0) {
                tabButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        tabButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        forms.forEach(f => f.classList.remove('active'));
                        const targetForm = document.getElementById(btn.dataset.tab + 'Form');
                        if (targetForm) targetForm.classList.add('active');
                    });
                });
            }
        }

        // ===================================================================
        // 4. LÓGICA DE LOGIN (CONECTADA AO BACKEND)
        // ===================================================================
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            // Removemos listeners antigos clonando o elemento (opcional, mas seguro)
            // loginForm.replaceWith(loginForm.cloneNode(true)); 
            // const newLoginForm = document.getElementById('loginForm');

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // IDs conforme seu partial modal.html (ajuste se necessário)
                const emailInput = document.getElementById('email'); 
                const senhaInput = document.getElementById('password') || document.getElementById('senha'); 

                if (!emailInput || !senhaInput) {
                    console.error("Campos de email ou senha não encontrados.");
                    return;
                }

                try {
                    console.log("Enviando login para API...");
                    const resposta = await apiFetch('/login', 'POST', {
                        email: emailInput.value,
                        senha: senhaInput.value
                    });

                    if (resposta && (resposta.token || resposta.accessToken)) {
                        const token = resposta.token || resposta.accessToken;
                        localStorage.setItem('user_token', token);
                        
                        // Salva nome se vier na resposta, senão decodifica depois
                        if (resposta.nome) localStorage.setItem('username', resposta.nome);

                        // LÓGICA DE ROLE (Admin vs User)
                        let role = (resposta.tipoUsuario || resposta.role || "").toLowerCase();
                        
                        // Se não veio no corpo, tenta no Token
                        if (!role) {
                            const decoded = parseJwt(token);
                            role = (decoded.role || decoded.tipoUsuario || "").toLowerCase();
                            // Se decodificou nome do token, salva também
                            if (decoded.nome || decoded.sub) localStorage.setItem('username', decoded.nome || decoded.sub);
                        }

                        console.log("Login sucesso. Role:", role);

                        if (role === 'admin' || role === 'administrador') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    } else {
                        alert("Login falhou. Verifique suas credenciais.");
                    }
                } catch (error) {
                    console.error("Erro no login:", error);
                    alert("Erro ao conectar com o servidor.");
                }
            });
        }
        // ===================================================================


        // 5. Botão Voltar ao Topo
        const backToTopButton = document.getElementById("back-to-top");
        if (backToTopButton) {
            window.onscroll = () => {
                const shouldBeVisible = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
                backToTopButton.style.display = shouldBeVisible ? "block" : "none";
            };
            backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        }

        // 6. Menu Offcanvas
        const offcanvasElement = document.getElementById('offcanvasMenu');
        if (offcanvasElement) {
            new bootstrap.Offcanvas(offcanvasElement);
        }

        // 7. Rodapé Colapsável
        document.querySelectorAll('.footer-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const list = toggle.nextElementSibling;
                if (list) list.classList.toggle('active');
            });
        });

        // 8. Carrossel de Parceiros
        initPartnerCarousel();

        // 9. Atualiza UI de usuário logado
        updateUserAuthDisplay();

        // 10. Carrega Banners e Anúncios Extras
        loadSiteAnnouncement();
        loadSiteAdBanner();

        // 11. Mapa (se houver)
        if (typeof inicializarMapaLeaflet === 'function') {
            inicializarMapaLeaflet();
        }

    }; // Fim inicializarComponentes

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
        carregarHTML("placeholder-modal", "partials/modal.html"), // Onde está o #loginForm
        carregarHTML("placeholder-botao-topo", "partials/botaoVoltarTopo.html"),
        carregarHTML("placeholder-menu", "partials/menuOffcanvas.html"),
        carregarHTML("placeholder-redesocial", "partials/redesocial.html")
    ];

    Promise.all(todasAsPartes).then(() => {
        inicializarComponentes();
    });

});

// ===================================================================
// FUNÇÕES AUXILIARES GLOBAIS
// ===================================================================

// Decodifica JWT para ler role/tipoUsuario caso o backend não mande no corpo
function parseJwt (token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
}

// Lógica do Carrossel de Parceiros (Isolada para organização)
function initPartnerCarousel() {
    const wrapper = document.querySelector('.logo-slider-wrapper');
    if (!wrapper) return;
    
    const track = wrapper.querySelector('.logo-track');
    const prevBtn = wrapper.querySelector('#logo-prev-btn');
    const nextBtn = wrapper.querySelector('#logo-next-btn');
    let originalItems = Array.from(track.children);

    if (originalItems.length > 0) {
        const itemWidth = 200;
        const itemsToClone = Math.ceil(wrapper.offsetWidth / itemWidth);

        for (let i = 0; i < itemsToClone; i++) {
            track.insertBefore(originalItems[(originalItems.length - 1 - i + originalItems.length) % originalItems.length].cloneNode(true), track.firstChild);
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

        const move = (dir) => {
            if (isTransitioning) return;
            isTransitioning = true;
            dir === 'next' ? currentIndex++ : currentIndex--;
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
}

// Funções de Anúncios e Banners
const loadSiteAnnouncement = () => {
    const container = document.getElementById('site-announcement-container');
    const announcementData = localStorage.getItem('ecoLogica_CurrentAnnouncement');
    if (!container || !announcementData) return;

    const data = JSON.parse(announcementData);
    if (!data.active) return;

    let alertClass = 'alert-info';
    let icon = 'fa-info-circle';
    if (data.type === 'warning') { alertClass = 'alert-warning'; icon = 'fa-exclamation-triangle'; }
    if (data.type === 'success') { alertClass = 'alert-success'; icon = 'fa-check-circle'; }

    container.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show mb-0 text-center rounded-0 border-0" role="alert">
            <div class="container">
                <i class="fas ${icon} me-2"></i>
                <strong>${data.text}</strong>
                <small class="ms-2 text-muted">(${data.date})</small>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    `;
};

const loadSiteAdBanner = () => {
    const container = document.getElementById('site-ad-banner-container');
    const storedBanners = localStorage.getItem('ecoLogica_AdBanners_List'); 
    if (!container || !storedBanners) return;

    const banners = JSON.parse(storedBanners);
    if (banners.length === 0) return;

    if (banners.length === 1) {
        const b = banners[0];
        container.innerHTML = `
            <a href="${b.link}" target="_blank" style="display: block; width: 100%;">
                <img src="${b.image}" alt="${b.alt}" class="img-fluid rounded" style="width: 100%; max-height: 150px; object-fit: cover;">
            </a>`;
    } else {
        let slidesHtml = '';
        banners.forEach((b, index) => {
            slidesHtml += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}" data-bs-interval="10000">
                    <a href="${b.link}" target="_blank">
                        <img src="${b.image}" class="d-block w-100 rounded" alt="${b.alt}" style="max-height: 100px; object-fit: cover;">
                    </a>
                </div>`;
        });
        container.innerHTML = `
            <div id="promoCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel-inner">${slidesHtml}</div>
                <button class="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev" style="width: 5%;"><span class="visually-hidden">Ant</span></button>
                <button class="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next" style="width: 5%;"><span class="visually-hidden">Prox</span></button>
            </div>`;
        new bootstrap.Carousel(document.getElementById('promoCarousel'), { interval: 10000, ride: 'carousel' });
    }
    container.style.display = 'block';
};