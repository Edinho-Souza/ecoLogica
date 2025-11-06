/**
 * @file mapa.js
 * Contém toda a lógica para inicializar e controlar o mapa Leaflet
 * dos pontos de coleta.
 */

// 1. A LÓGICA DO MAPA É ENVOLVIDA EM UMA ÚNICA FUNÇÃO
function inicializarMapaLeaflet() {

    // 2. VERIFICAÇÕES INICIAIS (para não dar erro em páginas sem mapa)
    const mapaContainer = document.getElementById('mapa');
    if (!mapaContainer) {
        console.log("Elemento #mapa não encontrado nesta página. Mapa não será inicializado.");
        return;
    }
    if (typeof L === 'undefined') {
        console.error("Biblioteca Leaflet (L) não está carregada. Verifique a ordem dos scripts no HTML.");
        return;
    }

    console.log("Inicializando mapa Leaflet...");

    // ===================================================================
    // 1. DADOS FICTÍCIOS (MOCK DATA) - ATUALIZADO PARA TIPOS INDIVIDUAIS
    // ===================================================================
    const pontosDeColeta = [
        // Blumenau
        { lat: -26.9250, lng: -49.0795, nome: "Recicla Eletrônicos Velha", tipo: "eletronicos", cidade: "blumenau" },
        { lat: -26.8910, lng: -49.0850, nome: "Coleta de Óleo Itoupava", tipo: "oleo", cidade: "blumenau" },
        { lat: -26.9050, lng: -49.0700, nome: "Ponto de Vidro", tipo: "vidro", cidade: "blumenau" },
        { lat: -26.9120, lng: -49.0550, nome: "Ponto de Metal", tipo: "metal", cidade: "blumenau" },
        { lat: -26.8980, lng: -49.0680, nome: "Ponto de Plástico", tipo: "plastico", cidade: "blumenau" },
        { lat: -26.9280, lng: -49.0720, nome: "Ponto de Papel/Papelão", tipo: "papel", cidade: "blumenau" },
        // Timbó
        { lat: -26.8205, lng: -49.2750, nome: "Ponto Verde Timbó", tipo: "papel", cidade: "timbo" },
        { lat: -26.8280, lng: -49.2650, nome: "Descarte de Plástico Nações", tipo: "plastico", cidade: "timbo" },
        // Indaial
        { lat: -26.9030, lng: -49.2390, nome: "Coleta Seletiva Tapajós", tipo: "vidro", cidade: "indaial" },
        // Pomerode
        { lat: -26.7411, lng: -49.1764, nome: "Pomerode Limpa", tipo: "metal", cidade: "pomerode" },
        // Gaspar
        { lat: -26.9317, lng: -48.9558, nome: "Recicla Gaspar Centro", tipo: "eletronicos", cidade: "gaspar" }
    ];

    const cores = {
        eletronicos: '#007bff',
        plastico: '#dc3545',
        metal: '#dc3545',
        papel: '#28a745',
        vidro: '#28a745',
        oleo: '#ffc107',
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

    const map = L.map(mapaContainer).setView([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // ===================================================================
    // 3. LÓGICA DOS PINOS (MARCADORES)
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

    // CORRIGIDO: Agora recebe 'materialFiltro' como argumento
    function adicionarPinos(cidadeFiltro, materialFiltro) {
        marcadores.clearLayers();

        const pontosFiltrados = pontosDeColeta.filter(ponto => {
            const filtraPorCidade = !cidadeFiltro || cidadeFiltro === "todos" || ponto.cidade === cidadeFiltro;
            const filtraPorMaterial = !materialFiltro || materialFiltro === "todos" || ponto.tipo === materialFiltro;

            // Retorna TRUE apenas se AMBOS os filtros forem atendidos
            return filtraPorCidade && filtraPorMaterial;
        });

        pontosFiltrados.forEach(ponto => {
            const cor = cores[ponto.tipo];
            const icone = criarIcone(cor);
            const marcador = L.marker([ponto.lat, ponto.lng], { icon: icone });

            // CORRIGIDO: Lógica de formatação para os nomes de tipo
            const tipoFormatado =
                ponto.tipo === 'oleo' ? 'Óleo de Cozinha Usado' :
                    ponto.tipo === 'papel' ? 'Papel/Papelão' :
                        ponto.tipo.charAt(0).toUpperCase() + ponto.tipo.slice(1);

            marcador.bindPopup(`
                <b>${ponto.nome}</b><br>
                Tipo: ${tipoFormatado}
            `);
            marcadores.addLayer(marcador);
        });
    }

    // ===================================================================
    // 4. INTERATIVIDADE DOS FILTROS (UNIFICADA)
    // ===================================================================

    // CORRIGIDO: Declaração das variáveis de seleção no escopo
    const cidadeSelect = document.getElementById('cidade-select');
    const materialSelect = document.getElementById('material-select');


    const aplicarFiltros = () => {
        // Pega o valor atual de AMBAS as dropdowns
        const cidadeSelecionada = cidadeSelect.value;
        const materialSelecionado = materialSelect.value;

        console.log(`Aplicando filtros: Cidade=${cidadeSelecionada}, Material=${materialSelecionado}`);

        // 1. CENTRALIZAÇÃO NO MAPA (Lógica de Cidade)
        if (cidadeSelecionada && cidadeSelecionada !== "todos" && cidadesCoordenadas[cidadeSelecionada]) {
            const coords = cidadesCoordenadas[cidadeSelecionada];
            map.flyTo([coords.lat, coords.lng], coords.zoom);
        } else {
            map.flyTo([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);
        }

        // 2. ADIÇÃO DOS PINOS (Com ambos os filtros)
        adicionarPinos(cidadeSelecionada, materialSelecionado);
    };


    if (cidadeSelect) {
        cidadeSelect.addEventListener('change', aplicarFiltros);
    } else {
        console.warn("Elemento #cidade-select não encontrado. Filtro de cidade não ativado.");
    }

    if (materialSelect) {
        materialSelect.addEventListener('change', aplicarFiltros);
    } else {
        console.warn("Elemento #material-select não encontrado. Filtro de material não ativado.");
    }

    // Adiciona todos os pinos ao mapa na primeira vez que a página carrega
    // Usa os valores iniciais (que devem ser "todos")
    adicionarPinos(cidadeSelect.value, materialSelect.value);

} // Fim da função 'inicializarMapaLeaflet'