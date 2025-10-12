document.addEventListener("DOMContentLoaded", function () {

  // 1. Ferramenta para buscar os pedaços da página
  const carregarHTML = (elementId, filePath) => {
    return fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error(`[ERRO 404] Arquivo não encontrado: ${filePath}`);
        return response.text();
      })
      .then(html => {
        const elemento = document.getElementById(elementId);
        if (elemento) elemento.innerHTML = html;
      })
      .catch(error => console.error(error));
  };

  // 2. Função que "ativa" TODOS os componentes depois que a página está montada
  const inicializarComponentes = () => {
    console.log("Página montada! Ativando componentes...");

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
    const openModalBtns = document.querySelectorAll('.btn-custom.btn-auth, .btn-custom.btn-auth-offcanvas');
    const closeModalBtn = document.querySelector('.close-modal');
    if (authModal && openModalBtns.length > 0 && closeModalBtn) {
      const tabButtons = document.querySelectorAll('.tab-btn');
      const forms = document.querySelectorAll('.modal-form');
      openModalBtns.forEach(btn => btn.addEventListener('click', () => { authModal.style.display = 'flex'; }));
      closeModalBtn.addEventListener('click', () => { authModal.style.display = 'none'; });
      window.addEventListener('click', (e) => { if (e.target === authModal) authModal.style.display = 'none'; });
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          forms.forEach(f => f.classList.remove('active'));
          document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
        });
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
      // Esta linha "apresenta" o menu que acabamos de carregar
      // ao JavaScript do Bootstrap, ativando suas funcionalidades.
      new bootstrap.Offcanvas(offcanvasElement);
    }
  };

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
    carregarHTML("placeholder-menu", "partials/menuOffcanvas.html")
  ];

  // Espera TODAS as partes serem carregadas
  Promise.all(todasAsPartes).then(() => {
    // Quando a "casa" estiver construída, chamamos a "equipe de montagem"
    inicializarComponentes();
  });
});

// --- LÓGICA DO CARROSSEL DE PARCEIROS ITEM-POR-ITEM E INFINITO ---
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.logo-slider-wrapper');
  if (!wrapper) return;

  const track = wrapper.querySelector('.logo-track');
  const prevBtn = wrapper.querySelector('#logo-prev-btn');
  const nextBtn = wrapper.querySelector('#logo-next-btn');
  let originalItems = Array.from(track.children);

  if (originalItems.length === 0) return; // Não faz nada se não houver logos

  const itemWidth = 200; // Largura de cada logo (deve ser a mesma do CSS)
  const itemsToClone = Math.ceil(wrapper.offsetWidth / itemWidth); // Clona a quantidade de itens visíveis

  // 1. Clonar itens para criar o efeito infinito
  // Clona os últimos itens e coloca no começo
  for (let i = 0; i < itemsToClone; i++) {
    const index = (originalItems.length - 1 - i + originalItems.length) % originalItems.length;
    const clone = originalItems[index].cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  }
  // Clona os primeiros itens e coloca no final
  for (let i = 0; i < itemsToClone; i++) {
    const clone = originalItems[i].cloneNode(true);
    track.appendChild(clone);
  }

  // 2. Atualizar a lista de itens e definir a posição inicial
  let allItems = Array.from(track.children);
  track.style.width = `${allItems.length * itemWidth}px`;

  let currentIndex = itemsToClone; // Começa nos primeiros itens "reais"
  let isTransitioning = false;

  function setPosition(instant = false) {
    if (instant) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.5s ease-in-out';
    }
    const offset = -currentIndex * itemWidth;
    track.style.transform = `translateX(${offset}px)`;
  }

  // Posição inicial (invisível para o usuário)
  setPosition(true);

  // 3. Funções dos botões
  function move(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    direction === 'next' ? currentIndex++ : currentIndex--;
    setPosition();
  }

  nextBtn.addEventListener('click', () => move('next'));
  prevBtn.addEventListener('click', () => move('prev'));

  // 4. A Mágica do Loop
  track.addEventListener('transitionend', () => {
    // Se chegamos nos clones do final, salta de volta para o começo
    if (currentIndex >= originalItems.length + itemsToClone) {
      currentIndex = itemsToClone;
      setPosition(true);
    }
    // Se chegamos nos clones do começo, salta de volta para o final
    if (currentIndex < itemsToClone) {
      currentIndex = originalItems.length + itemsToClone - 1;
      setPosition(true);
    }
    isTransitioning = false;
  });
});