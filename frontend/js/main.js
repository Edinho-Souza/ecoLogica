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
    const openModalBtns = document.querySelectorAll('.btn-custom.btn-auth, .btn-custom.btn-auth-offcanvas');
    const closeModalBtn = document.querySelector('.close-modal');
    if (authModal && openModalBtns.length > 0 && closeModalBtn) {
      const tabButtons = authModal.querySelectorAll('.tab-btn');
      const forms = authModal.querySelectorAll('.modal-form');
      const tabsContainer = authModal.querySelector('.auth-tabs');
      const recoverForm = authModal.querySelector('#recoverForm');
      const recoverLink = authModal.querySelector('.recover-link');
      const backToLoginLink = authModal.querySelector('.back-to-login-link');
      openModalBtns.forEach(btn => btn.addEventListener('click', () => { authModal.style.display = 'flex'; }));
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
    carregarHTML("placeholder-redesocial", "partials/redesocial.html")
  ];


  // Espera TODAS as partes serem carregadas e SÓ ENTÃO inicializa tudo
  Promise.all(todasAsPartes).then(() => {
    inicializarComponentes();
  });
});

// Mapa

document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // 1. DADOS FICTÍCIOS (MOCK DATA) - A "base de dados" do frontend
    // ===================================================================
    const pontosDeColeta = [
        // Blumenau
        { lat: -26.9184, lng: -49.0621, nome: "EcoPonto Centro", tipo: "geral", cidade: "blumenau" },
        { lat: -26.9250, lng: -49.0795, nome: "Recicla Eletrônicos Velha", tipo: "eletronicos", cidade: "blumenau" },
        { lat: -26.8910, lng: -49.0850, nome: "Coleta de Óleo Itoupava", tipo: "oleo", cidade: "blumenau" },
        // Timbó
        { lat: -26.8205, lng: -49.2750, nome: "Ponto Verde Timbó", tipo: "papel_vidro", cidade: "timbo" },
        { lat: -26.8280, lng: -49.2650, nome: "Descarte de Plástico Nações", tipo: "plastico_metal", cidade: "timbo" },
        // Indaial
        { lat: -26.8995, lng: -49.2301, nome: "Central de Reciclagem Indaial", tipo: "geral", cidade: "indaial" },
        { lat: -26.9030, lng: -49.2390, nome: "Coleta Seletiva Tapajós", tipo: "papel_vidro", cidade: "indaial" },
        // Pomerode
        { lat: -26.7411, lng: -49.1764, nome: "Pomerode Limpa", tipo: "plastico_metal", cidade: "pomerode" },
        // Gaspar
        { lat: -26.9317, lng: -48.9558, nome: "Recicla Gaspar Centro", tipo: "eletronicos", cidade: "gaspar" }
    ];

    // Mapeia o 'tipo' do ponto de coleta para a cor da legenda
    const cores = {
        eletronicos: '#007bff',
        plastico_metal: '#dc3545',
        papel_vidro: '#28a745',
        oleo: '#ffc107',
        geral: '#6c757d'
    };

    // ===================================================================
    // 2. CONFIGURAÇÃO DO MAPA
    // ===================================================================
    const cidadesCoordenadas = {
        blumenau: { lat: -26.9194, lng: -49.0661, zoom: 13 },
        gaspar:   { lat: -26.9317, lng: -48.9558, zoom: 13 },
        indaial:  { lat: -26.8975, lng: -49.2319, zoom: 13 },
        pomerode: { lat: -26.7411, lng: -49.1764, zoom: 13 },
        timbo:    { lat: -26.8239, lng: -49.2714, zoom: 13 }
    };
    const vistaPadrao = { lat: -26.85, lng: -49.15, zoom: 11 };

    const map = L.map('mapa').setView([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

// ===================================================================
// 3. LÓGICA DOS PINOS (MARCADORES)
// ===================================================================
let marcadores = L.layerGroup().addTo(map);

// Função para criar um ícone de pino SVG com uma cor específica
function criarIcone(cor) {
    const svgPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"; // Caminho de um pino de localização do Material Design

    return L.divIcon({
        className: 'custom-map-pin', // Nova classe para estilização
        html: `<svg class="map-pin-svg" style="fill: ${cor}; stroke: #fff;" viewBox="0 0 24 24">
                   <path d="${svgPath}"></path>
               </svg>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -30] 
    });
}

// Função que limpa os pinos antigos e adiciona os novos com base no filtro
function adicionarPinos(cidadeFiltro) {
    marcadores.clearLayers();

    const pontosFiltrados = pontosDeColeta.filter(ponto => {
        return !cidadeFiltro || ponto.cidade === cidadeFiltro;
    });

    pontosFiltrados.forEach(ponto => {
        const cor = cores[ponto.tipo];
        const icone = criarIcone(cor); // Chama a nova função criarIcone
        const marcador = L.marker([ponto.lat, ponto.lng], { icon: icone });
        
        // Adiciona um popup mais detalhado ao clicar no pino
        marcador.bindPopup(`
            <b>${ponto.nome}</b><br>
            Tipo: ${ponto.tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        `);
        marcadores.addLayer(marcador);
    });
}

    // ===================================================================
    // 4. INTERATIVIDADE DO FILTRO
    // ===================================================================
    const cidadeSelect = document.getElementById('cidade-select');

    cidadeSelect.addEventListener('change', function() {
        const cidadeSelecionada = this.value;

        // Move o mapa para a cidade
        if (cidadeSelecionada) {
            const coords = cidadesCoordenadas[cidadeSelecionada];
            map.flyTo([coords.lat, coords.lng], coords.zoom);
        } else {
            map.flyTo([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);
        }

        // Adiciona os pinos correspondentes à cidade selecionada
        adicionarPinos(cidadeSelecionada);
    });
    
    // Adiciona todos os pinos ao mapa na primeira vez que a página carrega
    adicionarPinos("");

});