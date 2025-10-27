/**
 * @file user-dashboard.js
 * Gerencia todas as interatividades da página "Minha Conta",
 * incluindo carregamento de dados do usuário, gráfico, modais e formulários.
 */

document.addEventListener('DOMContentLoaded', () => {

    console.log("Dashboard do usuário carregado.");

    // ===================================================================
    // FUNÇÕES DE INICIALIZAÇÃO
    // ===================================================================

    /**
     * Carrega dados fictícios (simulados) do usuário e preenche a página.
     * @description Simula uma busca de backend e atualiza o DOM com nome, email, endereço e pontos.
     */
    const loadUserData = () => {
        console.log("Função loadUserData chamada (simulando busca de dados)");
        
        // Simulação de dados
        const simData = {
            name: "Sofia Terra",
            email: "terradasofia@ecologica.com",
            address: "Rua das Flores, 123, Bairro Verde",
            points: Math.floor(Math.random() * 500) + 50
        };

        // Preenche o perfil principal
        document.getElementById('user-name').textContent = simData.name;
        document.getElementById('user-email').textContent = simData.email;
        
        // Preenche o campo de endereço no perfil
        const userAddressEl = document.getElementById('user-address');
        if (userAddressEl) {
             userAddressEl.textContent = simData.address || '[Endereço não cadastrado]';
        } else {
            console.warn("Elemento #user-address não encontrado no HTML do perfil.");
        }
        
        // Preenche os pontos (na página e no modal)
        document.getElementById('user-points-value').textContent = simData.points;
        const modalPointsSpan = document.getElementById('modal-user-points');
        if (modalPointsSpan) modalPointsSpan.textContent = simData.points;
    };

    /**
     * Inicializa o gráfico de histórico de descarte (Chart.js).
     * @description Cria um gráfico de linha com área preenchida e dados fictícios.
     * Adapta a exibição (dados e layout) para desktop vs. mobile.
     */
    const initChart = () => {
        console.log("Função initChart chamada...");
        const ctx = document.getElementById('disposalHistoryChart');

        // Verifica se o canvas e a biblioteca Chart.js existem
        if (ctx && typeof Chart !== 'undefined') {
            
            // --- Configurações do Gráfico ---
            Chart.defaults.font.family = "'Open Sans', sans-serif";
            Chart.defaults.color = '#555';
            
            const allLabels = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'];
            const allTotalData = [6.0, 6.6, 6.8, 9.0, 8.0, 10.6];
            let displayLabels = allLabels;
            let displayData = allTotalData;
            const screenWidth = window.innerWidth;
            
            // Padding esquerdo condicional (desktop vs. mobile)
            const leftPadding = screenWidth >= 992 ? -5 : 0;
            
            // Proporção condicional (desktop vs. mobile)
            let chartAspectRatio = 2.5; 
            if (screenWidth < 768) {
                displayLabels = allLabels.slice(-4); // Mostra menos meses no mobile
                displayData = allTotalData.slice(-4);
                chartAspectRatio = 1.5; 
                console.log("Mobile detectado, mostrando 4 meses e aspectRatio:", chartAspectRatio);
            } else {
                console.log("Desktop detectado, aspectRatio:", chartAspectRatio);
            }

            // Gradiente de preenchimento da área
            const gradientFill = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradientFill.addColorStop(0, 'rgba(72, 143, 88, 0.6)');
            gradientFill.addColorStop(1, 'rgba(72, 143, 88, 0.05)');

            // --- Criação do Gráfico ---
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: displayLabels,
                    datasets: [{
                        label: 'Total Reciclado (Kg)',
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
                        title: { display: true, text: 'Evolução Mensal do Total Reciclado (Kg)', color: '#4f4f4f', font: { size: 16, weight: 'bold' }, padding: { bottom: 20 } },
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: { weight: 'bold' },
                            bodyFont: { size: 13 },
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed.y !== null) { label += context.parsed.y.toFixed(1) + ' Kg'; }
                                    return label;
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
                            beginAtZero: true,
                            title: { display: true, text: 'Total (Kg)', font: { weight: '600', size: 11 } },
                            grid: { color: '#e9e9e9', drawBorder: false },
                            ticks: { grace: '10%', padding: 0, stepSize: 2 },
                            offset: false
                        }
                    },
                    interaction: { intersect: false, mode: 'index' },
                }
            });
        } else {
             // Tratamento de erro caso o canvas ou Chart.js não sejam encontrados
             if (!ctx) console.error("Elemento canvas #disposalHistoryChart não encontrado!");
             else console.error("Chart.js não parece estar carregado. Verifique o link no HTML.");
             const graphContainer = document.querySelector('.history-graph-container');
             if (graphContainer) graphContainer.innerHTML = '<p class="text-danger text-center">Erro ao carregar gráfico.</p>';
        }
    };

    // ===================================================================
    // LISTENERS DE EVENTOS (Formulários, Modais, Cards)
    // ===================================================================

    // --- Lógica para Cadastro de Material ---
    const registerMaterialForm = document.getElementById('registerMaterialForm');
    if (registerMaterialForm) {
        registerMaterialForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const materialType = document.getElementById('materialType').value;
            const quantity = document.getElementById('materialQuantity').value;
            console.log(`Material registrado: Tipo=${materialType}, Quantidade=${quantity}`);
            alert("Material registrado com sucesso (simulação)!");
            registerMaterialForm.reset();
        });
    }

    // --- Lógica para Busca de Pontos de Coleta ---
    const collectionPointForm = document.getElementById('collectionPointSearchForm');
    const resultsContainer = document.getElementById('collection-point-results');
    if (collectionPointForm && resultsContainer) {
        collectionPointForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const address = document.getElementById('userAddress').value;
            console.log(`Buscando pontos de coleta perto de: ${address}`);
            resultsContainer.innerHTML = `<p>Buscando pontos perto de "${address}"... (implementar busca real)</p>`;
        });
    }

    // --- Lógica para o Modal de Resgate de Pontos ---
    const redeemModalElement = document.getElementById('redeemModal');
    if (redeemModalElement) {
        const redeemModal = new bootstrap.Modal(redeemModalElement);
        const redeemOptions = redeemModalElement.querySelectorAll('.list-group-item[data-points-cost]');
        const confirmButton = document.getElementById('confirmRedeemButton');
        const feedbackDiv = document.getElementById('redeem-feedback');
        let selectedItem = null;
        let userPoints = 0;

        // Atualiza o modal antes de ser exibido
        redeemModalElement.addEventListener('show.bs.modal', () => {
            selectedItem = null;
            confirmButton.disabled = true;
            feedbackDiv.textContent = '';
            
            const pointsValueEl = document.getElementById('user-points-value');
            userPoints = pointsValueEl ? parseInt(pointsValueEl.textContent || '0') : 0;
            
            const modalPointsSpan = document.getElementById('modal-user-points');
            if (modalPointsSpan) modalPointsSpan.textContent = userPoints;

            // Habilita/desabilita opções com base nos pontos do usuário
            redeemOptions.forEach(option => {
                option.classList.remove('selected', 'disabled');
                const cost = parseInt(option.getAttribute('data-points-cost'));
                if (cost > userPoints) {
                    option.classList.add('disabled');
                }
            });
        });

        // Lógica de seleção de item
        redeemOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (option.classList.contains('disabled')) return;
                redeemOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedItem = option;
                confirmButton.disabled = false;
                feedbackDiv.textContent = '';
            });
        });

        // Lógica de confirmação de resgate (simulado)
        confirmButton.addEventListener('click', () => {
            if (!selectedItem) return;
            const cost = parseInt(selectedItem.getAttribute('data-points-cost'));
            const itemName = selectedItem.textContent.split('\n')[0].trim();
            console.log(`Tentando resgatar "${itemName}" por ${cost} pontos. Saldo: ${userPoints}`);
            feedbackDiv.textContent = `Processando resgate de "${itemName}"...`;
            confirmButton.disabled = true;

            // Simulação de chamada de backend
            setTimeout(() => {
                if (userPoints >= cost) {
                    userPoints -= cost;
                    document.getElementById('user-points-value').textContent = userPoints;
                    console.log("Resgate bem-sucedido!");
                    feedbackDiv.textContent = `"${itemName}" resgatado com sucesso!`;
                    feedbackDiv.style.color = 'green';
                    redeemModal.hide();
                    // loadUserData(); // Idealmente, recarregar dados do usuário aqui
                } else {
                    console.error("Pontos insuficientes!");
                    feedbackDiv.textContent = "Você não tem pontos suficientes para este item.";
                    feedbackDiv.style.color = 'red';
                    confirmButton.disabled = false;
                }
            }, 1500);
        });
    }

    // --- Lógica para o Lightbox de Imagem no Modal de Resgate ---
    const lightboxModalElement = document.getElementById('imageLightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxLabel = document.getElementById('imageLightboxModalLabel');

    // Usa o redeemModalElement que já foi pego
    if (redeemModalElement && lightboxModalElement && lightboxImage && lightboxLabel) {
        // Delegação de evento: escuta cliques no modal de resgate
        redeemModalElement.addEventListener('click', function (event) {
            const imageLink = event.target.closest('.redeem-item-image-link');
            if (imageLink) {
                event.preventDefault(); 
                const imageUrl = imageLink.getAttribute('data-image-src');
                const itemDetailsDiv = imageLink.nextElementSibling;
                const itemTitle = itemDetailsDiv ? itemDetailsDiv.textContent.trim() : 'Detalhe do Item';
                
                // Prepara o modal lightbox
                lightboxImage.setAttribute('src', imageUrl);
                lightboxImage.setAttribute('alt', itemTitle);
                lightboxLabel.textContent = itemTitle;
            }
        });

        // Limpa o lightbox quando ele é fechado
        lightboxModalElement.addEventListener('hidden.bs.modal', function () {
            lightboxImage.setAttribute('src', '');
            lightboxImage.setAttribute('alt', 'Imagem do Item');
            lightboxLabel.textContent = 'Detalhe do Item';
        });
    } else {
        console.warn("Elementos necessários para o lightbox de resgate não foram encontrados.");
    }

    // --- Lógica para os Cards de Orientações (Accordion) ---
    const guidelineHeaders = document.querySelectorAll('.guideline-header');
    guidelineHeaders.forEach(header => {
        // Lógica de clique para abrir/fechar
        header.addEventListener('click', () => {
            const card = header.closest('.guideline-card');
            const body = header.nextElementSibling;
            if (!card || !body) return;

            // Fecha outros cards abertos
            guidelineHeaders.forEach(otherHeader => {
                const otherCard = otherHeader.closest('.guideline-card');
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // Abre/fecha o card atual
            card.classList.toggle('active');
            if (card.classList.contains('active')) {
                body.style.maxHeight = '200px'; // Valor fixo para animação (pode ser body.scrollHeight + "px")
            } else {
                body.style.maxHeight = null;
            }
        });

        // Lógica de acessibilidade (teclado)
        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                header.click();
            }
        });
    });
    
    // --- LÓGICA DO MODAL DE EDITAR PERFIL ---
    const editProfileModalEl = document.getElementById('editProfileModal');
    
    if (editProfileModalEl) {
        const saveProfileButton = document.getElementById('saveProfileChangesButton');
        const feedbackDiv = document.getElementById('edit-profile-feedback');
        const avatarUploadInput = document.getElementById('avatarUpload');
        const avatarPreviewImg = document.getElementById('edit-profile-avatar-img');

        // 1. Preenche o modal com dados atuais ao abrir
        editProfileModalEl.addEventListener('show.bs.modal', () => {
            const currentName = document.getElementById('user-name').textContent;
            const currentEmail = document.getElementById('user-email').textContent;
            const currentAddressEl = document.getElementById('user-address');
            const currentAddress = currentAddressEl ? currentAddressEl.textContent : '[Endereço não cadastrado]';
            const currentAvatar = document.querySelector('.profile-v2-avatar').src;

            // Preenche os campos
            document.getElementById('edit-user-name').value = currentName;
            document.getElementById('edit-user-email').value = currentEmail;
            document.getElementById('edit-user-address').value = (currentAddress === '[Endereço não cadastrado]') ? '' : currentAddress;
            avatarPreviewImg.src = currentAvatar;
            
            // Limpa campos sensíveis e feedback
            document.getElementById('edit-current-password').value = '';
            document.getElementById('edit-new-password').value = '';
            document.getElementById('edit-confirm-password').value = '';
            feedbackDiv.textContent = '';
            feedbackDiv.className = 'mt-3 text-center';
            saveProfileButton.disabled = false;
        });

        // 2. Lógica para preview da foto de perfil
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

        // 3. Lógica de salvar (simulada)
        if (saveProfileButton) {
            saveProfileButton.addEventListener('click', () => {
                const newName = document.getElementById('edit-user-name').value;
                const newEmail = document.getElementById('edit-user-email').value;
                const newAddress = document.getElementById('edit-user-address').value;
                const newAvatarSrc = avatarPreviewImg.src;
                const newPassword = document.getElementById('edit-new-password').value;
                const confirmPassword = document.getElementById('edit-confirm-password').value;

                // --- Validação de Senha ---
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

                // --- Simulação de Salvamento ---
                feedbackDiv.textContent = 'Salvando...';
                feedbackDiv.className = 'mt-3 text-center text-info';
                saveProfileButton.disabled = true;

                setTimeout(() => {
                    // Atualiza a página principal
                    document.getElementById('user-name').textContent = newName;
                    document.getElementById('user-email').textContent = newEmail;
                    const userAddressEl = document.getElementById('user-address');
                    if (userAddressEl) {
                        userAddressEl.textContent = newAddress || '[Endereço não cadastrado]';
                    }
                    document.querySelector('.profile-v2-avatar').src = newAvatarSrc;

                    // Atualiza o localStorage (para o header)
                    localStorage.setItem('username', newName.split(' ')[0]);
                    
                    // Feedback de sucesso
                    feedbackDiv.textContent = 'Perfil atualizado com sucesso!';
                    feedbackDiv.className = 'mt-3 text-center text-success';
                    saveProfileButton.disabled = false;
                    
                    // Fecha o modal
                    setTimeout(() => {
                        bootstrap.Modal.getInstance(editProfileModalEl).hide();
                    }, 1500);

                }, 1500); // Simula tempo de rede
            });
        }
    }

    // ===================================================================
    // CHAMADAS INICIAIS
    // ===================================================================
    loadUserData(); // Carrega os dados (simulados) do usuário
    initChart();    // Inicializa o gráfico (simulado)

});