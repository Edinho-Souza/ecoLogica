/**
 * @file recicladora-dashboard.js
 * Gerencia todas as interatividades da página "Minha Conta" da EMPRESA RECICLADORA.
 */

document.addEventListener('DOMContentLoaded', () => {

    console.log("Dashboard da EMPRESA carregado.");

    // ===================================================================
    // FUNÇÕES DE INICIALIZAÇÃO
    // ===================================================================

    /**
     * Carrega dados fictícios (simulados) da empresa e preenche a página.
     * @description Simula uma busca de backend e atualiza o DOM com nome, email, endereço, CNPJ e pontos.
     */
    const loadUserData = () => {
        console.log("Função loadUserData (Empresa) chamada (simulando busca de dados)");

        // Simulação de dados da Empresa
        const simData = {
            name: "Recicladora Vale Limpo Ltda.",
            email: "contato@valelimpo.com",
            address: "Rua Industrial, 1000, Itoupava",
            cnpj: "12.345.678/0001-99",
            // Simula um total de pontos gerados por usuários (um número maior)
            points: Math.floor(Math.random() * 7000) + 1500, // Ex: 1500 a 8500
            avatar: "img/avatar-empresa-placeholder.png"
        };

        // Preenche o perfil principal com IDs da EMPRESA
        if (document.getElementById('company-name')) document.getElementById('company-name').textContent = simData.name;
        if (document.getElementById('company-email')) document.getElementById('company-email').textContent = simData.email;

        const userAddressEl = document.getElementById('company-address');
        if (userAddressEl) {
            userAddressEl.textContent = simData.address || '[Endereço não cadastrado]';
        } else {
            console.warn("Elemento #company-address não encontrado no HTML do perfil.");
        }

        const companyCnpjEl = document.getElementById('company-cnpj');
        if (companyCnpjEl) {
            companyCnpjEl.textContent = simData.cnpj || '[CNPJ não cadastrado]';
        } else {
            console.warn("Elemento #company-cnpj não encontrado no HTML do perfil.");
        }

        const avatarDisplay = document.getElementById('company-avatar-display');
        if (avatarDisplay) avatarDisplay.src = simData.avatar;

        // Preenche os pontos (MANTIDO, pois a seção existe no HTML)
        const pointsValueEl = document.getElementById('user-points-value');
        if (pointsValueEl) pointsValueEl.textContent = simData.points;
    };

    /**
     * Inicializa o gráfico (Exemplo: Gráfico de Materiais Recebidos pela Empresa)
     */
    const initChart = () => {
        console.log("Função initChart da Empresa chamada...");
        const ctx = document.getElementById('disposalHistoryChart'); // Mesmo ID de canvas

        if (ctx && typeof Chart !== 'undefined') {

            Chart.defaults.font.family = "'Open Sans', sans-serif";
            Chart.defaults.color = '#555';

            const allLabels = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'];
            const allTotalData = [120, 135, 128, 145, 140, 152]; // Dados de Toneladas
            let displayLabels = allLabels;
            let displayData = allTotalData;
            const screenWidth = window.innerWidth;
            const leftPadding = screenWidth >= 992 ? -5 : 0;
            let chartAspectRatio = 2.5;
            if (screenWidth < 768) {
                displayLabels = allLabels.slice(-4);
                displayData = allTotalData.slice(-4);
                chartAspectRatio = 1.5;
            }

            const gradientFill = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradientFill.addColorStop(0, 'rgba(44, 88, 54, 0.6)'); // Verde Escuro
            gradientFill.addColorStop(1, 'rgba(44, 88, 54, 0.05)');

            // Criação do Gráfico
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: displayLabels,
                    datasets: [{
                        label: 'Total Coletado (Toneladas)',
                        data: displayData,
                        fill: true,
                        backgroundColor: gradientFill,
                        borderColor: '#2c5836',
                        borderWidth: 2.5,
                        pointBackgroundColor: '#2c5836',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#2c5836',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    aspectRatio: chartAspectRatio,
                    layout: { padding: { left: leftPadding } },
                    plugins: {
                        title: { display: true, text: 'Volume Total Coletado (Ton) por Mês', color: '#4f4f4f', font: { size: 16, weight: 'bold' }, padding: { bottom: 20 } },
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: { weight: 'bold' },
                            bodyFont: { size: 13 },
                            callbacks: {
                                label: function (context) {
                                    return ` Total: ${context.parsed.y.toFixed(1)} Toneladas`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: { display: true, text: 'Mês', font: { weight: '600' } },
                            grid: { display: false }
                        },
                        y: {
                            beginAtZero: false,
                            title: { display: true, text: 'Total (Ton)', font: { weight: '600', size: 11 } },
                            grid: { color: '#e9e9e9', drawBorder: false },
                            ticks: { grace: '10%' },
                            offset: false
                        }
                    },
                    interaction: { intersect: false, mode: 'index' },
                }
            });
        } else {
            if (!ctx) console.error("Elemento canvas #disposalHistoryChart não encontrado!");
            else console.error("Chart.js não parece estar carregado.");
            const graphContainer = document.querySelector('.history-graph-container');
            if (graphContainer) graphContainer.innerHTML = '<p class="text-danger text-center">Erro ao carregar gráfico.</p>';
        }
    };

    // ===================================================================
    // LISTENERS DE EVENTOS (Formulários, Modais, Cards)
    // =l=================================================================

    // --- Lógica para Cadastro de Material (MODIFICADA PARA MODAL) ---
    const materialsModalEl = document.getElementById('materialsModal');
    const registerMaterialForm = document.getElementById('registerMaterialForm');

    if (materialsModalEl && registerMaterialForm) {
        const saveButton = document.getElementById('saveMaterialsButton');
        const feedbackDiv = document.getElementById('materials-feedback');
        const allCheckboxes = registerMaterialForm.querySelectorAll('input[name="materialColetado"]');

        // 1. (Simulação) Carrega os dados "salvos" quando o modal abre
        materialsModalEl.addEventListener('show.bs.modal', () => {
            console.log("Abrindo modal de materiais. (Simulando carregamento de dados salvos)");

            // Simulação de dados que já estariam salvos (ex: a empresa já coleta plástico e metal)
            const savedMaterials = ['plastico', 'metal']; // <-- SIMULAÇÃO

            allCheckboxes.forEach(checkbox => {
                if (savedMaterials.includes(checkbox.value)) {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            });

            // Limpa feedback
            feedbackDiv.textContent = '';
            feedbackDiv.className = 'mt-3 text-center';
            saveButton.disabled = false;
        });

        // 2. Lógica de clique para o botão "Salvar Materiais"
        saveButton.addEventListener('click', () => {
            // Encontra todos os checkboxes marcados
            const checkedMaterialsCheckboxes = registerMaterialForm.querySelectorAll('input[name="materialColetado"]:checked');

            // Cria um array com os valores (ex: ['plastico', 'papel'])
            const collectedMaterials = Array.from(checkedMaterialsCheckboxes).map(checkbox => checkbox.value);

            // Simulação de Salvamento
            console.log(`Lista de materiais coletados salva:`, collectedMaterials);
            feedbackDiv.textContent = 'Salvando...';
            feedbackDiv.className = 'mt-3 text-center text-info';
            saveButton.disabled = true;

            setTimeout(() => {
                feedbackDiv.textContent = 'Lista de materiais atualizada com sucesso!';
                feedbackDiv.className = 'mt-3 text-center text-success';
                saveButton.disabled = false;

                // Fecha o modal após o sucesso
                setTimeout(() => {
                    bootstrap.Modal.getInstance(materialsModalEl).hide();
                }, 1500);

            }, 1500);
        });
    }

    // --- Lógica para os Cards de Orientações (RESTAURADA) ---
    const guidelineHeaders = document.querySelectorAll('.guideline-header');
    guidelineHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.guideline-card');
            const body = header.nextElementSibling;
            if (!card || !body) return;
            guidelineHeaders.forEach(otherHeader => {
                const otherCard = otherHeader.closest('.guideline-card');
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });
            card.classList.toggle('active');
            if (card.classList.contains('active')) {
                body.style.maxHeight = '200px';
            } else {
                body.style.maxHeight = null;
            }
        });
        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                header.click();
            }
        });
    });

    // --- LÓGICA DO MODAL DE EDITAR PERFIL (ATUALIZADA PARA LOGO E SENHA) ---
    const editProfileModalEl = document.getElementById('editProfileModal');

    if (editProfileModalEl) {
        const saveProfileButton = document.getElementById('saveProfileChangesButton');
        const feedbackDiv = document.getElementById('edit-profile-feedback');
        const avatarUploadInput = document.getElementById('avatarUpload');
        const avatarPreviewImg = document.getElementById('edit-profile-avatar-img');

        // 1. Preenche o modal com dados atuais (apenas avatar) ao abrir
        editProfileModalEl.addEventListener('show.bs.modal', () => {
            // VERIFICA SE O AVATAR EXISTE ANTES DE TENTAR LER
            const avatarDisplay = document.getElementById('company-avatar-display');
            if (avatarDisplay && avatarPreviewImg) {
                avatarPreviewImg.src = avatarDisplay.src;
            }

            // Limpa campos sensíveis e feedback
            document.getElementById('edit-current-password').value = '';
            document.getElementById('edit-new-password').value = '';
            document.getElementById('edit-confirm-password').value = '';
            feedbackDiv.textContent = '';
            feedbackDiv.className = 'mt-3 text-center';
            saveProfileButton.disabled = false;
        });

        // 2. Lógica para preview da foto de perfil (RESTAURADA)
        if (avatarUploadInput && avatarPreviewImg) {
            avatarUploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => { avatarPreviewImg.src = e.target.result; }
                    reader.readAsDataURL(file);
                }
            });
        }

        // 3. Lógica de salvar (simulada - apenas logo e senha)
        if (saveProfileButton) {
            saveProfileButton.addEventListener('click', () => {
                // Lê apenas os dados que existem no modal
                const newAvatarSrc = avatarPreviewImg ? avatarPreviewImg.src : '';
                const newPassword = document.getElementById('edit-new-password').value;
                const confirmPassword = document.getElementById('edit-confirm-password').value;

                // Validação de Senha
                if (newPassword || confirmPassword) {
                    if (newPassword !== confirmPassword) {
                        feedbackDiv.textContent = 'Erro: As novas senhas não coincidem.';
                        feedbackDiv.className = 'mt-3 text-center text-danger';
                        return;
                    }
                    if (newPassword.length < 6) {
                        feedbackDiv.textContent = 'Erro: A nova senha deve ter pelo menos 6 caracteres.';
                        feedbackDiv.className = 'mt-3 text-center text-danger';
                        return;
                    }
                }

                // Simulação de Salvamento
                feedbackDiv.textContent = 'Salvando...';
                feedbackDiv.className = 'mt-3 text-center text-info';
                saveProfileButton.disabled = true;

                setTimeout(() => {
                    // Atualiza a página principal (apenas a logo)
                    const avatarDisplay = document.getElementById('company-avatar-display');
                    if (avatarDisplay && newAvatarSrc) {
                        avatarDisplay.src = newAvatarSrc;
                    }

                    feedbackDiv.textContent = 'Perfil atualizado com sucesso!';
                    feedbackDiv.className = 'mt-3 text-center text-success';
                    saveProfileButton.disabled = false;

                    setTimeout(() => {
                        bootstrap.Modal.getInstance(editProfileModalEl).hide();
                    }, 1500);

                }, 1500);
            });
        }
    }

    // ===================================================================
    // CHAMADAS INICIAIS
    // ===================================================================
    loadUserData(); // Modificado para carregar dados da empresa
    initChart();    // Modificado para mostrar gráfico da empresa

    // (A CHAMADA para loadCollectionRequests() FOI REMOVIDA DAQUI)

});