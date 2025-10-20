document.addEventListener("DOMContentLoaded", function () {


// --- FUNÇÃO PARA ATUALIZAR O DISPLAY DOS BOTÕES DE LOGIN/USUÁRIO ---
  const updateUserAuthDisplay = () => {
      console.log("updateUserAuthDisplay: Função iniciada."); // LOG 1

      // Seleciona os elementos relevantes
      const userAuthSpan = document.getElementById('userAuthSpan');       // Span no botão do header desktop
      const headerAuthButton = userAuthSpan ? userAuthSpan.closest('button') : null; // Botão do header desktop
      const offcanvasAuthButton = document.getElementById('offcanvasAuthButton'); // Botão no offcanvas mobile

      // Verifica o localStorage
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const username = localStorage.getItem('username');
      console.log(`updateUserAuthDisplay: localStorage lido - isLoggedIn='${isLoggedIn}', username='${username}'`); // LOG 3

      if (isLoggedIn === 'true' && username) {
          // --- ESTADO LOGADO ---
          console.log("updateUserAuthDisplay: CONDIÇÃO IF (logado) - VERDADEIRA."); // LOG 4a

          // Atualiza botão do header (desktop)
          if (userAuthSpan && headerAuthButton) {
              userAuthSpan.textContent = `Olá, ${username}`;
              headerAuthButton.setAttribute('data-logged-in', 'true');
              console.log("updateUserAuthDisplay: Texto do header alterado."); // LOG 4b
          } else {
              console.warn("updateUserAuthDisplay: Elementos do header não encontrados.");
          }

          // Atualiza botão do offcanvas (mobile)
          if (offcanvasAuthButton) {
              offcanvasAuthButton.textContent = `Olá, ${username}`; // Muda o texto direto no botão
              offcanvasAuthButton.setAttribute('data-logged-in', 'true');
              console.log("updateUserAuthDisplay: Texto do offcanvas alterado."); // LOG 4c
          } else {
               console.warn("updateUserAuthDisplay: Botão #offcanvasAuthButton não encontrado.");
          }

      } else {
          // --- ESTADO NÃO LOGADO ---
          console.log("updateUserAuthDisplay: CONDIÇÃO ELSE (não logado) - VERDADEIRA."); // LOG 5a

          // Restaura botão do header (desktop)
          if (userAuthSpan && headerAuthButton) {
              userAuthSpan.textContent = 'Entre ou cadastre-se';
              headerAuthButton.removeAttribute('data-logged-in');
              console.log("updateUserAuthDisplay: Texto do header restaurado."); // LOG 5b
          }

          // Restaura botão do offcanvas (mobile)
          if (offcanvasAuthButton) {
              offcanvasAuthButton.textContent = 'Entrar ou Cadastrar'; // Restaura texto original
              offcanvasAuthButton.removeAttribute('data-logged-in');
              console.log("updateUserAuthDisplay: Texto do offcanvas restaurado."); // LOG 5c
          }
      }
      console.log("updateUserAuthDisplay: Função concluída."); // LOG 6
  };

 const carregarHTML = (elementId, filePath) => {
    return fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`[ERRO 404] Arquivo não encontrado: ${filePath}`);
        return response.text();
      })
      .then(html => {
        const elemento = document.getElementById(elementId);
        if (elemento) {
          elemento.innerHTML = html;
          // ADICIONE ESTE LOG ESPECÍFICO PARA O HEADER
          if (elementId === 'placeholder-header') {
            console.log('carregarHTML: CONTEÚDO DO HEADER INJETADO em #placeholder-header.');
            // Vamos verificar se o span existe IMEDIATAMENTE após a injeção
            console.log('carregarHTML: Verificando #userAuthSpan LOGO APÓS injeção:', document.getElementById('userAuthSpan'));
          }
        } else {
           console.error(`carregarHTML: Elemento com ID '${elementId}' não encontrado no HTML principal.`);
        }
      })
      .catch(error => {
          console.error(`carregarHTML: Erro ao carregar ${filePath}:`, error);
          // Retorna a promessa rejeitada para que Promise.all possa falhar se necessário
          return Promise.reject(error);
      });
  };



  // 2. Função que "ativa" TODOS os componentes depois que a página está montada
  const inicializarComponentes = () => {
    console.log("Página montada! Ativando TODOS os componentes...");

    // --- Ativa o Carrossel (Banner) ---
    const bannerCarouselEl = document.getElementById('bannerCarousel');
    if (bannerCarouselEl) {
      new bootstrap.Carousel(bannerCarouselEl, {
        interval: 5000, // Tempo em milissegundos (5 segundos)
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

// --- Ativa o Modal (LÓGICA UNIFICADA E CORRIGIDA DEFINITIVAMENTE) ---
    const authModal = document.getElementById('authModal');
    // Selecionamos os botões pelos IDs/Classes específicos
    const closeModalBtn = document.querySelector('.close-modal');
    const headerAuthButton = document.querySelector('.btn-custom.btn-auth'); // Botão header desktop
    const offcanvasAuthButton = document.getElementById('offcanvasAuthButton'); // Botão offcanvas mobile (usando ID)

    // Verifica se os elementos essenciais do modal existem
    if (authModal && closeModalBtn) {

        // Listener específico para o BOTÃO DO HEADER (Desktop)
        if (headerAuthButton) {
            headerAuthButton.addEventListener('click', (event) => {
                // Verifica o estado de login NO MOMENTO DO CLIQUE
                if (headerAuthButton.getAttribute('data-logged-in') === 'true') {
                    event.preventDefault(); // Impede ação padrão
                    // event.stopPropagation(); // Não estritamente necessário aqui, mas pode deixar por segurança
                    console.log("[DEBUG] Header Logado: Redirecionando...");
                    window.location.href = 'usuario.html'; // Logado -> Vai p/ usuário
                } else {
                    // Se não logado, ABRE O MODAL
                    console.log("[DEBUG] Header Não Logado: Abrindo modal...");
                    authModal.style.display = 'flex';
                }
            });
        } else {
             console.warn("Botão de autenticação do header (.btn-custom.btn-auth) não encontrado.");
        }

        // Listener específico para o BOTÃO DO OFFCANVAS (Mobile)
        if (offcanvasAuthButton) {
            offcanvasAuthButton.addEventListener('click', (event) => {
                const offcanvasElement = document.getElementById('offcanvasMenu');
                const offcanvasInstance = offcanvasElement ? bootstrap.Offcanvas.getInstance(offcanvasElement) : null;

                // Verifica o estado de login NO MOMENTO DO CLIQUE
                if (offcanvasAuthButton.getAttribute('data-logged-in') === 'true') {
                    event.preventDefault();
                    // event.stopPropagation(); // Não estritamente necessário aqui

                    console.log("[DEBUG] Offcanvas Logado: Fechando e preparando para redirecionar...");

                    if (offcanvasInstance) {
                        // Ouvir evento para redirecionar APÓS fechar
                        offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
                            console.log("[DEBUG] Offcanvas Logado: Evento hidden disparado. Redirecionando.");
                            window.location.href = 'usuario.html';
                        }, { once: true });
                        offcanvasInstance.hide();
                    } else {
                        console.warn("[DEBUG] Offcanvas Logado: Instância não encontrada. Redirecionando direto.");
                        window.location.href = 'usuario.html'; // Fallback
                    }
                } else {
                    // Se não logado, fecha o offcanvas (se aberto) e abre o modal
                     console.log("[DEBUG] Offcanvas Não Logado: Fechando e abrindo modal...");
                     if (offcanvasInstance) {
                        // Ouvir evento para abrir modal APÓS fechar
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

        // --- LÓGICA ORIGINAL DO SEU MODAL (FECHAR, ABAS, RECUPERAR SENHA) ---
        // Esta parte foi preservada exatamente como no seu código original

        // Fechar modal (Botão X e clique fora)
        closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });
        window.addEventListener('click', (e) => { if (e.target === authModal) authModal.style.display = 'none'; });

        // Lógica das Abas
        const tabButtons = authModal.querySelectorAll('.tab-btn');
        const forms = authModal.querySelectorAll('.modal-form');
        const tabsContainer = authModal.querySelector('.auth-tabs'); // Garante que tabsContainer está definido
        const recoverForm = authModal.querySelector('#recoverForm'); // Garante que recoverForm está definido

        if (tabButtons.length > 0 && forms.length > 0) { // Verifica se existem botões e forms
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
                // Garante que o formulário de recuperação seja escondido ao trocar de aba
                if (recoverForm) recoverForm.classList.remove('active');
                // Garante que o container das abas seja exibido
                if (tabsContainer) tabsContainer.style.display = 'flex';
              });
            });
        }

        // Lógica de Recuperar Senha
        const recoverLink = authModal.querySelector('.recover-link');
        if (recoverLink && forms.length > 0 && tabsContainer && recoverForm) {
            recoverLink.addEventListener('click', (e) => {
              e.preventDefault();
              forms.forEach(f => f.classList.remove('active'));
              tabsContainer.style.display = 'none';
              recoverForm.classList.add('active');
            });
        }

        // Lógica de Voltar para Login
        const backToLoginLink = authModal.querySelector('.back-to-login-link');
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
        // --- FIM DA LÓGICA ORIGINAL DO SEU MODAL ---

    } else {
         // Mensagem caso o modal ou o botão de fechar não sejam encontrados
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
    }
    updateUserAuthDisplay();


/////////////////////////////

    
  }; // Fim da função inicializarComponentes

  // 3. Ordem de montagem
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
  ];


  // Espera TODAS as partes serem carregadas e SÓ ENTÃO inicializa tudo
  Promise.all(todasAsPartes).then(() => {
    inicializarComponentes();
  });
});

