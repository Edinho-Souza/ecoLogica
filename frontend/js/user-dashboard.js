document.addEventListener('DOMContentLoaded', () => {

    console.log("Dashboard do usuário carregado.");

    // --- Placeholder para carregar dados do usuário ---
    const loadUserData = () => {
        // Simulação de busca de dados
        console.log("Função loadUserData chamada (simulando busca de dados)");
        document.getElementById('user-name').textContent = "Sofia Terra";
        document.getElementById('user-email').textContent = "terradasofia@ecologica.com";
        const userPoints = Math.floor(Math.random() * 500) + 50; // Pontos aleatórios entre 50 e 549
        document.getElementById('user-points-value').textContent = userPoints;
        const modalPointsSpan = document.getElementById('modal-user-points');
        if (modalPointsSpan) modalPointsSpan.textContent = userPoints;

    };

    // --- Lógica para inicializar o gráfico (ESTILO LINHA COM ÁREA) ---
    const initChart = () => {
        console.log("Função initChart chamada...");
        const ctx = document.getElementById('disposalHistoryChart');

        if (ctx && typeof Chart !== 'undefined') {
            // ... (Definições de fonte, labels, totalData, gradientFill) ...
            Chart.defaults.font.family = "'Open Sans', sans-serif";
            Chart.defaults.color = '#555';
            const allLabels = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'];
            const allTotalData = [6.0, 6.6, 6.8, 9.0, 8.0, 10.6];
            let displayLabels = allLabels;
            let displayData = allTotalData;
            const screenWidth = window.innerWidth;
            const leftPadding = screenWidth >= 992 ? -5 : 0;

            // --- AJUSTE PARA MOBILE (Dados e Aspect Ratio) ---
            let chartAspectRatio = 2.5; // Proporção padrão (largura é 2x a altura)
            if (screenWidth < 768) {
                displayLabels = allLabels.slice(-4);
                displayData = allTotalData.slice(-4);
                chartAspectRatio = 1.5; // <<< GRÁFICO MAIS ALTO NO MOBILE (Experimente 1, 1.2, 1.5)
                console.log("Mobile detectado, mostrando 4 meses e aspectRatio:", chartAspectRatio);
            } else {
                console.log("Desktop detectado, aspectRatio:", chartAspectRatio);
            }
            // --- FIM DO AJUSTE ---

            const gradientFill = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradientFill.addColorStop(0, 'rgba(72, 143, 88, 0.6)');
            gradientFill.addColorStop(1, 'rgba(72, 143, 88, 0.05)');

            // Configuração do Gráfico de Linha
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: displayLabels, // <-- USA OS DADOS FILTRADOS/COMPLETOS
                    datasets: [
                        {
                            label: 'Total Reciclado (Kg)',
                            data: displayData, // <-- E AQUI
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
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Mantém false
                    aspectRatio: chartAspectRatio, // <<< ADICIONA A PROPORÇÃO CALCULADA
                    layout: {
                        padding: {
                            left: leftPadding
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Evolução Mensal do Total Reciclado (Kg)',
                            color: '#4f4f4f',
                            font: { size: 16, weight: 'bold' },
                            padding: { bottom: 20 }
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: { weight: 'bold' },
                            bodyFont: { size: 13 },
                            callbacks: {
                                label: function (context) {
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
                            title: {
                                display: true,
                                text: 'Mês',
                                font: { weight: '600' }
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total (Kg)',
                                font: { weight: '600' }
                            },
                            grid: {
                                color: '#e9e9e9',
                                drawBorder: false,
                            },
                            ticks: {
                                grace: '10%',
                                padding: 0, // Padding dos números do eixo Y reduzido
                                stepSize: 2
                            },
                            offset: false // Tenta colar o eixo Y na borda
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                }
            });
        } else {
            // (Código de erro permanece o mesmo)
            if (!ctx) console.error("Elemento canvas #disposalHistoryChart não encontrado!");
            else console.error("Chart.js não parece estar carregado.");
            const graphContainer = document.querySelector('.history-graph-container');
            if (graphContainer) graphContainer.innerHTML = '<p class="text-danger text-center">Erro ao carregar gráfico.</p>';
        }
    };

    // --- Lógica para Cadastro de Material (sem alterações) ---
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

    // --- Lógica para Busca de Pontos de Coleta (sem alterações) ---
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


    // --- Lógica para o Modal de Resgate de Pontos (sem alterações significativas) ---
    const redeemModalElement = document.getElementById('redeemModal');
    if (redeemModalElement) {
        const redeemModal = new bootstrap.Modal(redeemModalElement);
        const redeemOptions = redeemModalElement.querySelectorAll('.list-group-item[data-points-cost]');
        const confirmButton = document.getElementById('confirmRedeemButton');
        const feedbackDiv = document.getElementById('redeem-feedback');
        let selectedItem = null;
        let userPoints = 0; // Será carregado por loadUserData

        redeemModalElement.addEventListener('show.bs.modal', () => {
            selectedItem = null;
            confirmButton.disabled = true;
            feedbackDiv.textContent = '';
            userPoints = parseInt(document.getElementById('user-points-value').textContent || '0');
            const modalPointsSpan = document.getElementById('modal-user-points');
            if (modalPointsSpan) modalPointsSpan.textContent = userPoints;

            redeemOptions.forEach(option => {
                option.classList.remove('selected', 'disabled');
                const cost = parseInt(option.getAttribute('data-points-cost'));
                if (cost > userPoints) {
                    option.classList.add('disabled');
                }
            });
        });

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

        confirmButton.addEventListener('click', () => {
            if (!selectedItem) return;
            const cost = parseInt(selectedItem.getAttribute('data-points-cost'));
            const itemName = selectedItem.textContent.split('\n')[0].trim();
            console.log(`Tentando resgatar "${itemName}" por ${cost} pontos. Saldo: ${userPoints}`);
            feedbackDiv.textContent = `Processando resgate de "${itemName}"...`;
            confirmButton.disabled = true;

            setTimeout(() => { // Simulação de backend
                if (userPoints >= cost) {
                    userPoints -= cost;
                    document.getElementById('user-points-value').textContent = userPoints;
                    console.log("Resgate bem-sucedido!");
                    feedbackDiv.textContent = `"${itemName}" resgatado com sucesso!`;
                    feedbackDiv.style.color = 'green';
                    redeemModal.hide();
                    // loadUserData(); // Idealmente recarregar dados
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
    const lightboxModalElement = document.getElementById('imageLightboxModal'); // Pega o modal lightbox
    const lightboxImage = document.getElementById('lightboxImage'); // Pega a tag <img> dentro do lightbox
    const lightboxLabel = document.getElementById('imageLightboxModalLabel'); // Pega o título do lightbox

    if (redeemModalElement && lightboxModalElement && lightboxImage && lightboxLabel) {
        // Adiciona um listener no modal de resgate que "escuta" cliques nos links de imagem
        redeemModalElement.addEventListener('click', function (event) {
            // Verifica se o elemento clicado (ou um pai dele) é o link da imagem
            const imageLink = event.target.closest('.redeem-item-image-link');

            if (imageLink) {
                event.preventDefault(); // Impede o link de navegar (embora href seja #)
                const imageUrl = imageLink.getAttribute('data-image-src'); // Pega a URL da imagem grande
                const itemDetailsDiv = imageLink.nextElementSibling; // Pega o div de detalhes ao lado
                const itemTitle = itemDetailsDiv ? itemDetailsDiv.textContent.trim() : 'Detalhe do Item'; // Pega o título

                // Define os atributos do modal lightbox ANTES de ele ser mostrado
                lightboxImage.setAttribute('src', imageUrl);
                lightboxImage.setAttribute('alt', itemTitle); // Adiciona alt text
                lightboxLabel.textContent = itemTitle;

                // Não precisamos abrir o modal via JS aqui, pois o data-bs-toggle já faz isso
                // console.log("Preparando lightbox para: ", imageUrl);
            }
        });

        // Resetar a imagem quando o Lightbox fechar (boa prática)
        lightboxModalElement.addEventListener('hidden.bs.modal', function () {
            lightboxImage.setAttribute('src', ''); // Limpa a imagem
            lightboxImage.setAttribute('alt', 'Imagem do Item');
            lightboxLabel.textContent = 'Detalhe do Item'; // Restaura título
        });
    } else {
        console.warn("Elementos necessários para o lightbox de resgate não foram encontrados.");
    }

    // --- FIM DA LÓGICA DO LIGHTBOX ---



    // --- Chamadas Iniciais ---
    loadUserData(); // Carrega os dados do usuário (simulado)
    initChart();    // Inicializa o gráfico (com dados fake)

});