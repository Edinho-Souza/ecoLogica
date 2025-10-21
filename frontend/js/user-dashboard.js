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
        console.log("Função initChart chamada (criando gráfico LINHA com dados fake)");
        const ctx = document.getElementById('disposalHistoryChart');

        if (ctx && typeof Chart !== 'undefined') {

            // Define a fonte padrão
            Chart.defaults.font.family = "'Open Sans', sans-serif";
            Chart.defaults.color = '#555'; // Cor um pouco mais escura para eixos/texto

            // Dados Fake (mesmos de antes)
            const labels = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'];
            const totalData = [6.0, 6.6, 6.8, 9.0, 8.0, 10.6];

            // Cria um gradiente para a área abaixo da linha
            const gradientFill = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250); // Ajuste a altura (250) se necessário
            gradientFill.addColorStop(0, 'rgba(72, 143, 88, 0.6)');   // Verde do site (#488f58) com opacidade no topo
            gradientFill.addColorStop(1, 'rgba(72, 143, 88, 0.05)'); // Quase transparente na base

            // Configuração do Gráfico de Linha
            new Chart(ctx, {
                type: 'line', // <<< MUDANÇA PRINCIPAL: Tipo linha
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Reciclado (Kg)',
                            data: totalData,
                            fill: true, // <<< Preenche a área abaixo da linha
                            backgroundColor: gradientFill, // <<< Usa o gradiente criado
                            borderColor: '#2c5836', // <<< Usa seu verde escuro para a linha
                            borderWidth: 2.5, // Linha um pouco mais grossa
                            pointBackgroundColor: '#2c5836', // Cor dos pontos na linha
                            pointBorderColor: '#fff', // Borda branca nos pontos
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#2c5836',
                            pointRadius: 4, // Tamanho dos pontos
                            pointHoverRadius: 6, // Tamanho dos pontos no hover
                            tension: 0.3 // <<< Deixa a linha levemente curvada (0 = reta)
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Evolução Mensal do Total Reciclado (Kg)', // Título mais adequado
                            color: '#4f4f4f',
                            font: { size: 16, weight: 'bold' },
                            padding: { bottom: 20 }
                        },
                        legend: {
                            display: false // Continua sem legenda
                        },
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
                            title: {
                                display: true,
                                text: 'Mês',
                                font: { weight: '600' }
                            },
                            grid: {
                                display: false // Sem grade vertical
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
                                color: '#e9e9e9', // Grade horizontal bem clara
                                drawBorder: false, // Sem linha do eixo Y
                            },
                            ticks: {
                                // Adiciona um pouco de espaço extra no topo
                                grace: '10%' // Ex: 10% acima do valor máximo
                            }
                        }
                    },
                     // Melhora a interação com o tooltip
                    interaction: {
                        intersect: false, // Mostra tooltip mesmo sem estar exatamente sobre o ponto
                        mode: 'index', // Mostra tooltips para todos os datasets no mesmo índice X (útil se voltar a ter mais linhas)
                    },
                }
            });
        } else {
            // (Código de erro permanece o mesmo)
             if (!ctx) console.error("Elemento canvas #disposalHistoryChart não encontrado!");
             else console.error("Chart.js não parece estar carregado.");
             const graphContainer = document.querySelector('.history-graph-container');
             if(graphContainer) graphContainer.innerHTML = '<p class="text-danger text-center">Erro ao carregar gráfico.</p>';
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

    // --- Chamadas Iniciais ---
    loadUserData(); // Carrega os dados do usuário (simulado)
    initChart();    // Inicializa o gráfico (com dados fake)

});