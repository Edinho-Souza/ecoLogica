async function inicializarMapaLeaflet() {
    const mapaContainer = document.getElementById('mapa');
    if (!mapaContainer || typeof L === 'undefined') return;

    const cidadesCoordenadas = {
        blumenau: { lat: -26.9194, lng: -49.0661, zoom: 13 },
        gaspar: { lat: -26.9317, lng: -48.9558, zoom: 13 },
        indaial: { lat: -26.8975, lng: -49.2319, zoom: 13 },
        pomerode: { lat: -26.7411, lng: -49.1764, zoom: 13 },
        timbo: { lat: -26.8239, lng: -49.2714, zoom: 13 }
    };
    const vistaPadrao = { lat: -26.85, lng: -49.15, zoom: 11 };
    const cores = {
        eletronicos: '#007bff',
        plastico: '#dc3545',
        metal: '#dc3545',
        papel: '#28a745',
        vidro: '#28a745',
        oleo: '#ffc107',
        todos: '#2c5836'
    };

    const fallback = [
        { latitude: -26.9250, longitude: -49.0795, nome: 'Recicla Eletronicos Velha', cidade: 'blumenau', tiposMateriaisAceitos: ['eletronicos'] },
        { latitude: -26.8910, longitude: -49.0850, nome: 'Coleta de Oleo Itoupava', cidade: 'blumenau', tiposMateriaisAceitos: ['oleo'] },
        { latitude: -26.9050, longitude: -49.0700, nome: 'Ponto de Vidro', cidade: 'blumenau', tiposMateriaisAceitos: ['vidro'] }
    ];

    const map = L.map(mapaContainer).setView([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);
    const cidadeSelect = document.getElementById('cidade-select');
    const materialSelect = document.getElementById('material-select');
    let pontos = [];

    const normalize = (value) => (value || '').toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const criarIcone = (cor) => L.divIcon({
        className: 'custom-map-pin',
        html: `<svg class="map-pin-svg" style="fill: ${cor}; stroke: #fff;" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -30]
    });

    const carregarPontos = async () => {
        try {
            const dados = await apiFetch('/locais-coleta', 'GET', null, { skipAuth: true });
            pontos = dados
                .filter(ponto => ponto.latitude && ponto.longitude)
                .map(ponto => ({
                    ...ponto,
                    cidade: normalize(ponto.cidade),
                    tiposMateriaisAceitos: (ponto.tiposMateriaisAceitos || []).map(normalize)
                }));
        } catch {
            pontos = [];
        }

        if (!pontos.length) {
            pontos = fallback;
        }
    };

    const adicionarPinos = () => {
        markers.clearLayers();
        const cidadeFiltro = cidadeSelect?.value || 'todos';
        const materialFiltro = materialSelect?.value || 'todos';

        pontos
            .filter(ponto => {
                const cidadeOk = cidadeFiltro === 'todos' || normalize(ponto.cidade) === cidadeFiltro;
                const tipos = ponto.tiposMateriaisAceitos || [];
                const materialOk = materialFiltro === 'todos' || tipos.includes(materialFiltro);
                return cidadeOk && materialOk;
            })
            .forEach(ponto => {
                const tipo = (ponto.tiposMateriaisAceitos || ['todos'])[0];
                const marker = L.marker([ponto.latitude, ponto.longitude], { icon: criarIcone(cores[tipo] || cores.todos) });
                marker.bindPopup(`
                    <b>${ponto.nome}</b><br>
                    ${ponto.endereco || ''}<br>
                    Materiais: ${(ponto.tiposMateriaisAceitos || []).join(', ') || 'Nao informado'}
                `);
                markers.addLayer(marker);
            });
    };

    const aplicarFiltros = () => {
        const cidadeSelecionada = cidadeSelect?.value || 'todos';
        if (cidadeSelecionada !== 'todos' && cidadesCoordenadas[cidadeSelecionada]) {
            const coords = cidadesCoordenadas[cidadeSelecionada];
            map.flyTo([coords.lat, coords.lng], coords.zoom);
        } else {
            map.flyTo([vistaPadrao.lat, vistaPadrao.lng], vistaPadrao.zoom);
        }
        adicionarPinos();
    };

    cidadeSelect?.addEventListener('change', aplicarFiltros);
    materialSelect?.addEventListener('change', aplicarFiltros);

    await carregarPontos();
    adicionarPinos();
}
