/**
 * @file mapa.js
 * Contém toda a lógica para inicializar e controlar o mapa Leaflet
 * dos pontos de coleta.
 */

// 1. A LÓGICA DO MAPA É ENVOLVIDA EM UMA ÚNICA FUNÇÃO
function inicializarMapaLeaflet() {

    // 2. VERIFICAÇÕES INICIAIS (para não dar erro em páginas sem mapa)
    // Verifica se o container do mapa existe na página
    const mapaContainer = document.getElementById('mapa');
    if (!mapaContainer) {
        console.log("Elemento #mapa não encontrado nesta página. Mapa não será inicializado.");
        return; // Sai da função se não houver container
    }
    // Verifica se a biblioteca Leaflet (L) foi carregada
    if (typeof L === 'undefined') {
        console.error("Biblioteca Leaflet (L) não está carregada. Verifique a ordem dos scripts no HTML.");
        return; // Sai da função se Leaflet não estiver pronto
    }

    console.log("Inicializando mapa Leaflet...");

    // ===================================================================
    // 1. DADOS FICTÍCIOS (MOCK DATA) - (Seu código original, intacto)
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

    const cores = {
        eletronicos: '#007bff',
        plastico_metal: '#dc3545',
        papel_vidro: '#28a745',
        oleo: '#ffc107',
        geral: '#6c757d'
    };

    // ===================================================================
    // 2. CONFIGURAÇÃO DO MAPA - (Seu código original, intacto)
    // ===================================================================
    const cidadesCoordenadas = {
        blumenau: { lat: -26.9194, lng: -49.0661, zoom: 13 },
        gaspar: { lat: -26.9317, lng: -48.9558, zoom: 13 },
        indaial: { lat: -26.8975, lng: -49.2319, zoom: 13 },
        pomerode: { lat: -26.7411, lng: -49.1764, zoom: 13 },
        timbo: { lat: -26.8239, lng: -49.2714, zoom: 13 }
    };
    const vistaPadrao = { lat: -26.85, lng: -49.15, zoom: 11 };

    const map = L.map(mapaContainer).setView([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // ===================================================================
    // 3. LÓGICA DOS PINOS (MARCADORES) - (Seu código original, intacto)
    // ===================================================================
    let marcadores = L.layerGroup().addTo(map);

    function criarIcone(cor) {
        const svgPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
        return L.divIcon({
            className: 'custom-map-pin',
            html: `<svg class="map-pin-svg" style="fill: ${cor}; stroke: #fff;" viewBox="0 0 24 24">
                        <path d="${svgPath}"></path>
                    </svg>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -30]
        });
    }

    function adicionarPinos(cidadeFiltro) {
        marcadores.clearLayers();
        const pontosFiltrados = pontosDeColeta.filter(ponto => {
            return !cidadeFiltro || ponto.cidade === cidadeFiltro;
        });
        pontosFiltrados.forEach(ponto => {
            const cor = cores[ponto.tipo];
            const icone = criarIcone(cor);
            const marcador = L.marker([ponto.lat, ponto.lng], { icon: icone });
            marcador.bindPopup(`
                <b>${ponto.nome}</b><br>
                Tipo: ${ponto.tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            `);
            marcadores.addLayer(marcador);
        });
    }

    // ===================================================================
    // 4. INTERATIVIDADE DO FILTRO - (Seu código original, intacto)
    // ===================================================================
    const cidadeSelect = document.getElementById('cidade-select');

    if (cidadeSelect) {
        cidadeSelect.addEventListener('change', function () {
            const cidadeSelecionada = this.value;
            if (cidadeSelecionada && cidadesCoordenadas[cidadeSelecionada]) {
                const coords = cidadesCoordenadas[cidadeSelecionada];
                map.flyTo([coords.lat, coords.lng], coords.zoom);
            } else {
                map.flyTo([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);
            }
            adicionarPinos(cidadeSelecionada);
        });
    } else {
        console.warn("Elemento #cidade-select não encontrado. Filtro de cidade não ativado.");
    }

    // Adiciona todos os pinos ao mapa na primeira vez que a página carrega
    adicionarPinos("");

} // <-- 3. FIM DA FUNÇÃO 'inicializarMapaLeaflet'