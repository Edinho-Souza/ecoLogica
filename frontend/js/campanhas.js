/**
 * @file campanhas.js
 * Gerencia a exibição e criação (simulada) de campanhas na página de campanhas.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores ---
    const campaignListContainer = document.getElementById('campaign-list-container');
    const campaignsLoadingMsg = document.getElementById('campaigns-loading');

    // ==========================================================
    // *** ALTERAÇÃO AQUI: CARREGAR DADOS DO LOCALSTORAGE ***
    // ==========================================================
    let storedCampaigns = localStorage.getItem('ecoLogica_Campaigns');
    
    const simulatedCampaignData = storedCampaigns ? JSON.parse(storedCampaigns) : [
        // Se o localStorage estiver vazio (primeiro acesso), use um padrão
        {
            id: 1,
            title: "Recicla Pomerode (Padrão)",
            description: "Mutirão de eletrônicos Dia 22/09 na Praça Central. Pontos extras: +200 pontos para quem levar pilhas e baterias.",
            image: "https://picsum.photos/400/250?random=10",
            startDate: "2025-09-01",
            endDate: "2025-09-22",
            points: 200
        },
        // Adicione mais padrões se necessário
    ];
    // ==========================================================


    /**
     * Formata uma string de data (YYYY-MM-DD) para DD/MM/YYYY.
     * @param {string} dateString
     * @returns {string} Data formatada ou string vazia.
     */
    const formatDate = (dateString) => { /* ... (função inalterada) ... */
        if (!dateString) return '';
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        } catch (e) {
            console.error("Erro ao formatar data:", dateString, e);
            return dateString; // Retorna original em caso de erro
        }
    };

    /**
     * Cria o HTML para um card de campanha.
     * @param {object} campaign - Objeto da campanha.
     * @returns {string} String HTML do card.
     */
    const createCampaignCardHTML = (campaign) => { /* ... (função inalterada) ... */
        const formattedStart = formatDate(campaign.startDate);
        const formattedEnd = formatDate(campaign.endDate);
        const dateText = (formattedStart && formattedEnd) ? `De ${formattedStart} a ${formattedEnd}` : 'Datas não informadas';

        return `
            <div class="col-md-6 col-lg-4 d-flex"> <div class="campaign-card-page">
                    <img src="${campaign.image}" alt="Imagem da ${campaign.title}" class="campaign-card-img">
                    <div class="campaign-card-body">
                        <h3 class="campaign-card-title">${campaign.title}</h3>
                        <p class="campaign-card-dates">${dateText}</p>
                        <p class="campaign-card-description">${campaign.description}</p>
                        <a href="#" class="btn btn-sm btn-success w-100" data-campaign-id="${campaign.id}">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        `;
    };

    /**
     * Carrega e exibe as campanhas na página.
     */
    const displayCampaigns = () => {
        if (!campaignListContainer || !campaignsLoadingMsg) return;

        // Simula pequena demora (como se viesse do backend)
        setTimeout(() => {
            campaignsLoadingMsg.style.display = 'none'; // Esconde "Carregando..."
            campaignListContainer.innerHTML = ''; // Limpa container

            // *** ALTERAÇÃO: Usa simulatedCampaignData (que agora vem do localStorage) ***
            if (simulatedCampaignData.length > 0) {
                simulatedCampaignData.forEach(campaign => {
                    campaignListContainer.innerHTML += createCampaignCardHTML(campaign);
                });
            } else {
                campaignListContainer.innerHTML = '<p class="text-muted text-center col-12">Nenhuma campanha ativa no momento.</p>';
            }

            // Adiciona listener para os botões "Ver Detalhes" (exemplo)
            campaignListContainer.querySelectorAll('.btn-success').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const campaignId = e.target.getAttribute('data-campaign-id');
                    alert(`Clicou em Ver Detalhes da Campanha ID: ${campaignId} (Implementar navegação ou modal)`);
                });
            });

        }, 500); // Meio segundo de simulação
    };

    // --- Inicialização ---
    if (campaignListContainer) {
        displayCampaigns(); // Carrega as campanhas existentes
    }

});