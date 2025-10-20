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

// --- Ativa o Modal ---
  const authModal = document.getElementById('authModal');
  const openModalBtns = document.querySelectorAll('.btn-custom.btn-auth, .btn-custom.btn-auth-offcanvas'); // Selects both header and offcanvas buttons
  const closeModalBtn = document.querySelector('.close-modal');

  if (authModal && openModalBtns.length > 0 && closeModalBtn) {
    const tabButtons = authModal.querySelectorAll('.tab-btn');
    const forms = authModal.querySelectorAll('.modal-form');
    const tabsContainer = authModal.querySelector('.auth-tabs');
    const recoverForm = authModal.querySelector('#recoverForm');
    const recoverLink = authModal.querySelector('.recover-link');
    const backToLoginLink = authModal.querySelector('.back-to-login-link');

    // --- MODIFICAÇÃO AQUI ---
    // Em vez de adicionar o mesmo listener a todos, verificamos cada botão
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (event) => { // Adicionamos 'event'
        // Verifica se é o botão do header (o que contém o span) E se está logado
        if (btn.querySelector('#userAuthSpan') && btn.getAttribute('data-logged-in') === 'true') {
          event.preventDefault();    // Impede ação padrão
          event.stopPropagation(); // Impede outros listeners
          window.location.href = 'usuario.html'; // Redireciona
        } else {
          // Para qualquer outro botão OU o botão do header (se não logado), abre o modal
          authModal.style.display = 'flex';
        }
      });
    });
    // --- FIM DA MODIFICAÇÃO ---

    // --- LÓGICA ADICIONAL PARA REDIRECIONAMENTO QUANDO LOGADO ---
    // Pega referências aos botões específicos
    const headerAuthButtonForRedirect = document.querySelector('.btn-custom.btn-auth');
    const offcanvasAuthButtonForRedirect = document.getElementById('offcanvasAuthButton');

    // Listener APENAS para o botão do header (desktop)
    if (headerAuthButtonForRedirect) {
        headerAuthButtonForRedirect.addEventListener('click', function(event) {
            // Verifica o estado de login SOMENTE se o botão estiver marcado como logado
            if (this.getAttribute('data-logged-in') === 'true') {
                console.log("[DEBUG] Header Logado (Redirect Check): Prevenindo modal e redirecionando.");
                event.preventDefault();    // Impede a ação padrão (que seria abrir o modal pelo listener original)
                event.stopPropagation(); // Impede outros listeners
                window.location.href = 'usuario.html'; // Redireciona
            }
        });
    }

    // Listener APENAS para o botão do offcanvas (mobile)
    if (offcanvasAuthButtonForRedirect) {
        offcanvasAuthButtonForRedirect.addEventListener('click', function(event) {
            // Verifica o estado de login SOMENTE se o botão estiver marcado como logado
            if (this.getAttribute('data-logged-in') === 'true') {
                 console.log("[DEBUG] Offcanvas Logado (Redirect Check): Prevenindo modal, fechando e redirecionando.");
                 event.preventDefault();
                 event.stopPropagation(); // Impede o listener original de abrir o modal

                 const offcanvasElement = document.getElementById('offcanvasMenu');
                 const offcanvasInstance = offcanvasElement ? bootstrap.Offcanvas.getInstance(offcanvasElement) : null;

                 if (offcanvasInstance) {
                     // Adiciona listener para redirecionar APÓS o offcanvas fechar
                     offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
                         console.log("[DEBUG] Offcanvas Logado: Evento hidden disparado. Redirecionando.");
                         window.location.href = 'usuario.html';
                     }, { once: true });
                     offcanvasInstance.hide(); // Fecha o offcanvas
                 } else {
                     console.warn("[DEBUG] Offcanvas Logado: Instância não encontrada. Redirecionando direto.");
                     window.location.href = 'usuario.html'; // Fallback
                 }
            }
             // Se não estiver logado, este listener não faz nada,
             // permitindo que o listener original (do bloco //--- Ativa o Modal ---) abra o modal.
        });
    }
    // --- FIM DA LÓGICA ADICIONAL ---

    // O resto do seu código original permanece EXATAMENTE igual:
    closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === authModal) authModal.style.display = 'none'; });
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        forms.forEach(f => f.classList.remove('active'));
        document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
        recoverForm.classList.remove('active');
        tabsContainer.style.display = 'flex';
      });
    });
    recoverLink.addEventListener('click', (e) => {
      e.preventDefault();
      forms.forEach(f => f.classList.remove('active'));
      tabsContainer.style.display = 'none';
      recoverForm.classList.add('active');
    });
    backToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      recoverForm.classList.remove('active');
      tabsContainer.style.display = 'flex';
      document.getElementById('loginForm').classList.add('active');
      authModal.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
      authModal.querySelector('.tab-btn[data-tab="register"]').classList.remove('active');
    });
  }

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

