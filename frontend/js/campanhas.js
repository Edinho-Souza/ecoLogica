document.addEventListener('DOMContentLoaded', () => {
    const campaignListContainer = document.getElementById('campaign-list-container');
    const campaignsLoadingMsg = document.getElementById('campaigns-loading');
    if (!campaignListContainer) return;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));

    const createCampaignCardHTML = (campaign) => {
        const formattedStart = formatDate(campaign.dataInicio || campaign.startDate);
        const formattedEnd = formatDate(campaign.dataFim || campaign.endDate);
        const dateText = formattedStart && formattedEnd ? `De ${formattedStart} a ${formattedEnd}` : 'Datas nao informadas';
        const title = campaign.titulo || campaign.title;
        const description = campaign.descricao || campaign.description || '';
        const imageSrc = campaign.imagemUrl || campaign.image || 'img/banner/banner-2.png';
        const points = Number(campaign.pontosExtras || 0);

        return `
            <div class="col-md-6 col-lg-4 d-flex">
                <div class="campaign-card-page">
                    <img src="${escapeHtml(imageSrc)}" alt="Imagem da ${escapeHtml(title)}" class="campaign-card-img">
                    <div class="campaign-card-body">
                        <h3 class="campaign-card-title">${escapeHtml(title)}</h3>
                        <p class="campaign-card-dates">${escapeHtml(dateText)}</p>
                        ${points ? `<span class="badge bg-success mb-2">${points} pontos extras</span>` : ''}
                        <p class="campaign-card-description">${escapeHtml(description)}</p>
                        <button class="btn btn-sm btn-success w-100" data-campaign-id="${campaign.id}">Ver Detalhes</button>
                    </div>
                </div>
            </div>
        `;
    };

    const displayCampaigns = async () => {
        if (campaignsLoadingMsg) campaignsLoadingMsg.style.display = 'block';
        try {
            const campaigns = await apiFetch('/campanhas/ativas', 'GET', null, { skipAuth: true });
            campaignListContainer.innerHTML = '';

            if (!campaigns.length) {
                campaignListContainer.innerHTML = '<p class="text-muted text-center col-12">Nenhuma campanha ativa no momento.</p>';
                return;
            }

            campaignListContainer.innerHTML = campaigns.map(createCampaignCardHTML).join('');
            campaignListContainer.querySelectorAll('button[data-campaign-id]').forEach(button => {
                button.addEventListener('click', () => {
                    const card = button.closest('.campaign-card-page');
                    const description = card.querySelector('.campaign-card-description');
                    description.classList.toggle('expanded');
                });
            });
        } catch (error) {
            campaignListContainer.innerHTML = `<p class="text-danger text-center col-12">${error.message}</p>`;
        } finally {
            if (campaignsLoadingMsg) campaignsLoadingMsg.style.display = 'none';
        }
    };

    displayCampaigns();
});
