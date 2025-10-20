// Função que contém toda a lógica do mapa Leaflet
function inicializarMapaLeaflet() {

    // Verifica se o container do mapa existe na página e se o Leaflet (L) está carregado
    const mapaContainer = document.getElementById('mapa');
    if (!mapaContainer) {
        console.log("Elemento #mapa não encontrado nesta página. Mapa não será inicializado.");
        return; // Sai da função se não houver container
    }
    if (typeof L === 'undefined') {
        console.error("Biblioteca Leaflet (L) não está carregada. Verifique a ordem dos scripts no HTML.");
        return; // Sai da função se Leaflet não estiver pronto
    }

    console.log("Inicializando mapa Leaflet..."); // Mensagem para confirmar execução

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
        gaspar: { lat: -26.9317, lng: -48.9558, zoom: 13 },
        indaial: { lat: -26.8975, lng: -49.2319, zoom: 13 },
        pomerode: { lat: -26.7411, lng: -49.1764, zoom: 13 },
        timbo: { lat: -26.8239, lng: -49.2714, zoom: 13 }
    };
    const vistaPadrao = { lat: -26.85, lng: -49.15, zoom: 11 };

    // Usa o mapaContainer que verificamos no início
    const map = L.map(mapaContainer).setView([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);

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

    // Só adiciona o listener se o elemento do seletor de cidade existir
    if (cidadeSelect) {
        cidadeSelect.addEventListener('change', function () {
            const cidadeSelecionada = this.value;

            // Move o mapa para a cidade
            if (cidadeSelecionada && cidadesCoordenadas[cidadeSelecionada]) { // Verifica se a cidade existe nos dados
                const coords = cidadesCoordenadas[cidadeSelecionada];
                map.flyTo([coords.lat, coords.lng], coords.zoom);
            } else {
                map.flyTo([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);
            }

            // Adiciona os pinos correspondentes à cidade selecionada
            adicionarPinos(cidadeSelecionada);
        });
    } else {
        console.warn("Elemento #cidade-select não encontrado. Filtro de cidade não ativado.");
    }


    // Adiciona todos os pinos ao mapa na primeira vez que a página carrega
    adicionarPinos("");

} // Fim da função inicializarMapaLeaflet

document.addEventListener("DOMContentLoaded", inicializarMapaLeaflet);
