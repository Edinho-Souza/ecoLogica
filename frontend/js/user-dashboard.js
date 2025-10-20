document.addEventListener('DOMContentLoaded', () => {

    console.log("Dashboard do usuário carregado.");

    // --- Placeholder para carregar dados do usuário ---
    const loadUserData = () => {
        // Simulação de busca de dados
        console.log("Função loadUserData chamada (simulando busca de dados)");
        document.getElementById('user-name').textContent = "Usuário Teste";
        document.getElementById('user-email').textContent = "teste@ecologica.com";
        const userPoints = Math.floor(Math.random() * 500) + 50; // Pontos aleatórios entre 50 e 549
        document.getElementById('user-points-value').textContent = userPoints;
        const modalPointsSpan = document.getElementById('modal-user-points');
        if (modalPointsSpan) modalPointsSpan.textContent = userPoints;
    };

    // --- Lógica para inicializar o gráfico (com dados FAKE) ---
    const initChart = () => {
        console.log("Função initChart chamada (criando gráfico com dados fake)");
        const ctx = document.getElementById('disposalHistoryChart');

        // Verifica se o elemento canvas existe e se Chart.js está carregado
        if (ctx && typeof Chart !== 'undefined') {
            
            // DADOS FAKE: Simulam o descarte (em Kg) nos últimos 6 meses
            const labels = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro']; // Meses fictícios
            const plasticData = [1.5, 2.1, 1.8, 2.5, 2.0, 3.1]; // Kg de plástico
            const paperData = [3.0, 2.5, 3.5, 4.0, 3.8, 4.5];   // Kg de papel
            const metalData = [0.5, 0.8, 0.6, 1.0, 0.9, 1.2];   // Kg de metal
            const glassData = [1.0, 1.2, 0.9, 1.5, 1.3, 1.8];   // Kg de vidro

            // Configuração do Gráfico de Barras Empilhadas
            new Chart(ctx, {
                type: 'bar', // Tipo de gráfico
                data: {
                    labels: labels, // Rótulos do eixo X (meses)
                    datasets: [
                        {
                            label: 'Plástico (Kg)',
                            data: plasticData,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)', // Azul
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Papel/Papelão (Kg)',
                            data: paperData,
                            backgroundColor: 'rgba(255, 206, 86, 0.7)', // Amarelo
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Metal (Kg)',
                            data: metalData,
                            backgroundColor: 'rgba(75, 192, 192, 0.7)', // Verde-água
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Vidro (Kg)',
                            data: glassData,
                            backgroundColor: 'rgba(153, 102, 255, 0.7)', // Roxo
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true, // Faz o gráfico se adaptar ao tamanho do container
                    maintainAspectRatio: false, // Permite controlar a altura independentemente da largura
                    plugins: {
                        title: {
                            display: true,
                            text: 'Quantidade de Material Descartado (Kg) por Mês'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        x: {
                            stacked: true, // Empilha as barras do mesmo mês
                            title: {
                                display: true,
                                text: 'Mês'
                            }
                        },
                        y: {
                            stacked: true, // Empilha as barras do mesmo mês
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Quantidade (Kg)'
                            }
                        }
                    }
                }
            });
        } else if (!ctx) {
            console.error("Elemento canvas #disposalHistoryChart não encontrado!");
        } else {
             console.error("Chart.js não parece estar carregado. Verifique o link no HTML.");
             // Você pode colocar uma mensagem alternativa no lugar do gráfico
             const graphContainer = document.querySelector('.history-graph-container');
             if(graphContainer) {
                 graphContainer.innerHTML = '<p class="text-danger text-center">Erro ao carregar a biblioteca de gráficos.</p>';
             }
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