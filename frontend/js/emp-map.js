document.addEventListener('DOMContentLoaded', async () => {
    const mapElement = document.getElementById('collectionMap');
    const listContainer = document.getElementById('collection-requests-list');
    const placeholder = document.getElementById('requests-placeholder');
    if (!mapElement || !listContainer) return;

    const session = requireLogin();
    if (!session) return;

    let map;

    const initCollectionMap = () => {
        if (typeof L === 'undefined') {
            mapElement.innerHTML = '<p class="text-danger text-center p-3">Mapa indisponivel.</p>';
            return;
        }

        map = L.map('collectionMap').setView([-26.9110, -49.0662], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    };

    const statusBadge = (status) => {
        if (status === 'concluida') return 'bg-success';
        if (status === 'andamento') return 'bg-warning text-dark';
        return 'bg-secondary';
    };

    const renderRequests = (requests) => {
        if (placeholder) placeholder.style.display = 'none';
        listContainer.innerHTML = '';

        if (!requests.length) {
            listContainer.innerHTML = '<p class="text-center text-muted mt-3">Nenhuma solicitacao de coleta no momento.</p>';
            return;
        }

        requests.forEach(request => {
            const item = document.createElement('div');
            item.className = 'request-item';
            item.innerHTML = `
                <div class="request-item-header">
                    <strong>${request.nomeUsuario || 'Usuario'}</strong>
                    <span class="badge ${statusBadge(request.status)}">${request.status || 'pendente'}</span>
                </div>
                <div class="request-item-body">
                    <p class="mb-2">${request.descricao || 'Sem descricao'}</p>
                    <small class="text-muted">${request.dataSolicitacao ? new Date(request.dataSolicitacao).toLocaleString('pt-BR') : ''}</small>
                </div>
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-sm btn-outline-primary flex-fill" data-status="andamento" data-request-id="${request.id}">Em andamento</button>
                    <button class="btn btn-sm btn-success flex-fill" data-status="concluida" data-request-id="${request.id}">Concluir</button>
                </div>
            `;

            item.querySelectorAll('button[data-status]').forEach(button => {
                button.addEventListener('click', async () => {
                    button.disabled = true;
                    try {
                        await apiFetch(`/solicitacoes/${button.dataset.requestId}/status`, 'PATCH', {
                            status: button.dataset.status
                        });
                        await loadRequests();
                    } catch (error) {
                        alert(error.message);
                        button.disabled = false;
                    }
                });
            });

            listContainer.appendChild(item);
        });
    };

    async function loadRequests() {
        try {
            const requests = await apiFetch(`/solicitacoes/recicladora/${session.id}`);
            renderRequests(requests);
        } catch (error) {
            listContainer.innerHTML = `<p class="text-danger text-center mt-3">${error.message}</p>`;
        }
    }

    initCollectionMap();
    await loadRequests();
});
