/**
 * @file emp-map.js
 * Gerencia o mapa de solicitações de coleta e a lista de coletas
 * no painel da empresa recicladora.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- VERIFICA SE ESTAMOS NA PÁGINA CORRETA ---
    const mapElement = document.getElementById('collectionMap');
    if (!mapElement) {
        // Não estamos na página do dashboard da empresa ou o elemento do mapa não existe.
        return; 
    }

    console.log("emp-map.js: Mapa de Coletas iniciado.");

    // --- 1. DADOS SIMULADOS (com coordenadas) ---
    // (Coordenadas fictícias ao redor de Blumenau/SC)
    const simRequests = [
        {
            id: 1,
            userName: "Ana Silva",
            date: "27/10/2025",
            materials: "Plástico, Papel",
            details: "Aprox. 2 sacolas",
            address: "Rua das Flores, 123, Bairro Jardim",
            lat: -26.9183,
            lng: -49.0691
        },
        {
            id: 2,
            userName: "Bruno Costa",
            date: "26/10/2025",
            materials: "Vidro, Metal",
            details: "Aprox. 1 caixa",
            address: "Av. Central, 789, Centro",
            lat: -26.9110,
            lng: -49.0662
        },
        {
            id: 3,
            userName: "Carla Mendes",
            date: "26/10/2025",
            materials: "Óleo de Cozinha",
            details: "5 garrafas PET",
            address: "Rua das Palmeiras, 456, Itoupava",
            lat: -26.8520,
            lng: -49.1015
        },
        {
            id: 4,
            userName: "Daniel Moreira",
            date: "25/10/2025",
            materials: "Eletrônicos",
            details: "1 monitor antigo, 2 celulares",
            address: "Travessa dos Pinheiros, 10, Velha",
            lat: -26.9244,
            lng: -49.0918
        }
    ];

    let map;
    const markers = {}; // Objeto para guardar os marcadores por ID

    /**
     * --- 2. INICIALIZA O MAPA LEAFLET ---
     */
    const initCollectionMap = () => {
        try {
            // Inicializa o mapa, centrado em Blumenau
            map = L.map('collectionMap').setView([-26.9110, -49.0662], 13);

            // Adiciona o "fundo" do mapa (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Adiciona os marcadores
            simRequests.forEach(request => {
                const marker = L.marker([request.lat, request.lng]).addTo(map);
                
                // Conteúdo do popup
                marker.bindPopup(`
                    <strong>${request.userName}</strong><br>
                    ${request.address}<br>
                    <strong>Materiais:</strong> ${request.materials}
                `);
                
                // Guarda o marcador para referência futura
                markers[request.id] = marker;
            });

        } catch (error) {
            console.error("Erro ao inicializar o mapa Leaflet:", error);
            mapElement.innerHTML = '<p class="text-danger text-center">Erro ao carregar o mapa. Verifique a conexão e a biblioteca Leaflet.</p>';
        }
    };

    /**
     * --- 3. PREENCHE A LISTA DE SOLICITAÇÕES ---
     * (E adiciona os listeners para interagir com o mapa)
     */
    const populateRequestList = () => {
        const listContainer = document.getElementById('collection-requests-list');
        const placeholder = document.getElementById('requests-placeholder');
        
        if (!listContainer || !placeholder) {
            console.warn("Elementos da lista de solicitações não encontrados.");
            return;
        }

        // Limpa o placeholder
        placeholder.style.display = 'none';
        listContainer.innerHTML = ''; 

        if (simRequests.length === 0) {
            placeholder.textContent = "Nenhuma solicitação de coleta no momento.";
            placeholder.style.display = 'block';
            return;
        }

        // Preenche a lista com os dados
        simRequests.forEach(request => {
            const requestCardHTML = `
                <div class="request-item">
                    <div class="request-item-header">
                        <strong>${request.userName}</strong>
                        <span class="request-item-date">${request.date}</span>
                    </div>
                    <div class="request-item-body">
                        <p class="mb-1">
                            <strong>Materiais:</strong> ${request.materials} <em>(${request.details})</em>
                        </p>
                        <p class="mb-2">
                            <strong>Endereço:</strong> ${request.address}
                        </p>
                    </div>
                    <button class="btn btn-sm btn-success w-100" data-request-id="${request.id}">
                        <i class="fas fa-map-marker-alt me-1"></i> Ver no Mapa
                    </button>
                </div>
            `;
            listContainer.innerHTML += requestCardHTML;
        });
        
        // --- 4. ADICIONA OS LISTENERS DE CLIQUE ---
        listContainer.querySelectorAll('.btn-success').forEach(button => {
            button.addEventListener('click', (event) => {
                const requestId = event.currentTarget.getAttribute('data-request-id');
                
                console.log(`Clicou em Ver no Mapa para a solicitação ID: ${requestId}`);
                
                const targetMarker = markers[requestId];
                
                if (map && targetMarker) {
                    // Centraliza o mapa no marcador
                    map.flyTo(targetMarker.getLatLng(), 15); // Zoom mais próximo (nível 15)
                    
                    // Abre o popup do marcador
                    targetMarker.openPopup();
                } else {
                    alert(`Erro: Marcador para a solicitação ${requestId} não encontrado.`);
                }
            });
        });
    };

    // --- 5. EXECUÇÃO ---
    initCollectionMap();
    populateRequestList();

});