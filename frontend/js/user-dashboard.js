/**
 * @file user-dashboard.js
 * Versão Final Corrigida - Com Lightbox de Imagem nas Recompensas
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log(">>> User Dashboard Iniciado");

    // ===================================================================
    // 1. GRÁFICO E DADOS INICIAIS
    // ===================================================================
    const initChart = () => {
        const ctx = document.getElementById('disposalHistoryChart');
        if (ctx && typeof Chart !== 'undefined') {
            const screenW = window.innerWidth;
            let labels = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'];
            let data = [6.0, 6.6, 6.8, 9.0, 8.0, 10.6];
            if (screenW < 768) { labels = labels.slice(-4); data = data.slice(-4); }

            const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, 'rgba(72, 143, 88, 0.6)');
            gradient.addColorStop(1, 'rgba(72, 143, 88, 0.05)');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Reciclado (Kg)',
                        data: data,
                        fill: true,
                        backgroundColor: gradient,
                        borderColor: '#2c5836',
                        borderWidth: 2.5,
                        tension: 0.3,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    aspectRatio: screenW < 768 ? 1.5 : 2.5,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
                }
            });
        }
    };
    initChart();

// ===================================================================
    // 2. DADOS DO USUÁRIO (ATUALIZADO COM MEMBRO DESDE)
    // ===================================================================
    const loadUserData = () => {
        // Tenta carregar usuário real do localStorage (sincronia com Admin)
        const storedUsers = JSON.parse(localStorage.getItem('ecoLogica_Users')) || [];
        
        // Procura o usuário logado (Simulando ID 1 - Sofia Terra)
        let user = storedUsers.find(u => u.id === 1) || {
            name: "Sofia Terra",
            email: "terradasofia@ecologica.com",
            points: 500,
            address: "Rua Jardins, 789, Nações, Indaial-SC",
            memberSince: "17/11/2025" // Data padrão simulada
        };

        // Garante que o campo exista (caso venha do Admin sem essa info)
        if (!user.memberSince) user.memberSince = "15/03/2024";

        const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
        
        setText('user-name', user.name);
        setText('user-email', user.email);
        setText('user-member-since', user.memberSince); // <--- Preenche a data
        setText('user-address', user.address || "Rua das Flores, 123");
        setText('user-points-value', user.points);
        setText('modal-user-points', user.points);
    };
    loadUserData();

    // ===================================================================
    // 2. MODAL DE RESGATE (COM LIGHTBOX)
    // ===================================================================
    
    // Helper de Imagem
    const getRewardImg = (name) => {
        if(!name) return 'img/geral-site/logo-aba-navegador.png';
        const n = name.toLowerCase();
        if(n.includes('ecobag')) return 'img/recompensas/ecobag.png';
        if(n.includes('garrafa')) return 'img/recompensas/garrafa.png';
        if(n.includes('semente')) return 'img/recompensas/caixa-sementes.png';
        if(n.includes('cupom')) return 'img/recompensas/cupom-desconto.png';
        return 'img/geral-site/logo-aba-navegador.png';
    };

    const redeemModalEl = document.getElementById('redeemModal');

    if (redeemModalEl) {
        const confirmBtn = document.getElementById('confirmRedeemButton');
        const feedback = document.getElementById('redeem-feedback');
        let selectedItem = null;

        // --- FUNÇÃO DE RENDERIZAR (COM LINK PARA LIGHTBOX) ---
        const renderList = () => {
            const container = document.getElementById('redeem-list-container');
            if (!container) return;

            try {
                container.innerHTML = '';
                const stored = localStorage.getItem('ecoLogica_Rewards');
                let rewards = stored ? JSON.parse(stored) : [{ id: 999, name: "Item Padrão", cost: 10, stock: 10 }];

                if (!Array.isArray(rewards) || rewards.length === 0) {
                    container.innerHTML = '<div class="text-muted text-center p-3">Nenhuma recompensa disponível.</div>';
                    return;
                }

                const ptsEl = document.getElementById('user-points-value');
                const currentPoints = ptsEl ? parseInt(ptsEl.textContent) : 0;

                rewards.forEach(r => {
                    const stock = parseInt(r.stock) || 0;
                    const noStock = stock <= 0;
                    const canAfford = currentPoints >= r.cost;
                    const imgSrc = getRewardImg(r.name);

                    const btn = document.createElement('button');
                    btn.className = `list-group-item list-group-item-action d-flex align-items-center p-2 ${noStock ? 'disabled bg-light' : ''}`;
                    
                    // AQUI ESTÁ A MUDANÇA: A imagem agora é um link <a> que abre o modal
                    btn.innerHTML = `
                        <a href="#" class="redeem-item-image-link me-3 flex-shrink-0" 
                           data-bs-toggle="modal" 
                           data-bs-target="#imageLightboxModal"
                           data-image-src="${imgSrc}"
                           data-image-title="${r.name}"
                           style="width:50px; height:50px; display:block;">
                            <img src="${imgSrc}" style="width:100%; height:100%; object-fit:contain;" alt="${r.name}">
                        </a>
                        <div class="flex-grow-1 text-start overflow-hidden">
                            <div class="fw-bold text-truncate">${r.name}</div>
                            <small class="text-muted">${noStock ? 'Esgotado' : 'Estoque: ' + stock}</small>
                        </div>
                        <span class="badge rounded-pill ${canAfford ? 'bg-success' : 'bg-secondary'} ms-2">${r.cost} pts</span>
                    `;

                    btn.addEventListener('click', (e) => {
                        // SE CLICOU NA IMAGEM, NÃO SELECIONA O ITEM (Deixa o lightbox abrir)
                        if (e.target.closest('.redeem-item-image-link')) return;

                        if(noStock) return;
                        container.querySelectorAll('button.list-group-item').forEach(b => b.classList.remove('active'));
                        
                        if (!canAfford) {
                            if(feedback) {
                                feedback.textContent = `Faltam pontos.`;
                                feedback.className = 'mt-2 text-center text-danger small';
                            }
                            if(confirmBtn) confirmBtn.disabled = true;
                            selectedItem = null;
                        } else {
                            btn.classList.add('active');
                            if(feedback) feedback.textContent = "";
                            if(confirmBtn) confirmBtn.disabled = false;
                            selectedItem = r;
                        }
                    });

                    container.appendChild(btn);
                });

            } catch (err) {
                console.error("Erro render:", err);
                container.innerHTML = '<div class="text-danger text-center p-3 small">Erro ao carregar.</div>';
            }
        };

        redeemModalEl.addEventListener('show.bs.modal', () => {
            selectedItem = null;
            if(confirmBtn) confirmBtn.disabled = true;
            if(feedback) feedback.textContent = "";
            renderList();
        });

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (!selectedItem) return;
                confirmBtn.disabled = true;
                // Lógica simplificada de débito (visualmente)
                let ptsEl = document.getElementById('user-points-value');
                let currentPts = parseInt(ptsEl.textContent) || 0;
                currentPts -= selectedItem.cost;
                ptsEl.textContent = currentPts;
                document.getElementById('modal-user-points').textContent = currentPts;
                
                if(feedback) {
                    feedback.textContent = "Resgatado!";
                    feedback.className = "mt-2 text-center text-success fw-bold";
                }
                setTimeout(() => bootstrap.Modal.getInstance(redeemModalEl).hide(), 1000);
            });
        }

        // --- LÓGICA DO LIGHTBOX ---
        // houve um clique no modal de resgate
        redeemModalEl.addEventListener('click', function (event) {
            // verifica se o clique foi em um link de imagem
            const imageLink = event.target.closest('.redeem-item-image-link');
            if (imageLink) {
                // Pega os dados da imagem clicada
                const imageUrl = imageLink.getAttribute('data-image-src');
                const imageTitle = imageLink.getAttribute('data-image-title');
                
                // Preenche o modal de lightbox
                const lightboxImg = document.getElementById('lightboxImage');
                const lightboxLabel = document.getElementById('imageLightboxModalLabel');
                if(lightboxImg) lightboxImg.src = imageUrl;
                if(lightboxLabel) lightboxLabel.textContent = imageTitle;
            }
        });

        // Limpa o lightbox quando fecha E REABRE O MENU ANTERIOR
        const lightboxModalEl = document.getElementById('imageLightboxModal');
        if(lightboxModalEl) {
            lightboxModalEl.addEventListener('hidden.bs.modal', function () {
                 // 1. Limpa a imagem para não piscar a antiga na próxima vez
                 const lightboxImg = document.getElementById('lightboxImage');
                 if(lightboxImg) lightboxImg.src = '';

                 // 2. Reabre o modal de lista de recompensas
                 // Verifica se a instância existe e manda mostrar novamente
                 const redeemModalInstance = bootstrap.Modal.getInstance(redeemModalEl);
                 if (redeemModalInstance) {
                     redeemModalInstance.show();
                 }
            });
        }
    }

    // ===================================================================
    // 3. OUTRAS FUNÇÕES (Cadastro Material, etc)
    // ===================================================================
    try {
        const matForm = document.getElementById('registerMaterialForm');
        if(matForm) {
            matForm.addEventListener('submit', (e) => {
                e.preventDefault();
                document.getElementById('material-form-step').style.display = 'none';
                const resDiv = document.getElementById('material-results-step');
                resDiv.style.display = 'block';
                const list = document.getElementById('company-results-list');
                if(list) {
                    list.innerHTML = '<p class="text-center text-muted">Buscando...</p>';
                    setTimeout(() => {
                        list.innerHTML = `
                            <div class="border p-2 rounded bg-light mb-2">
                                <strong>Recicladora Exemplo</strong><br><small>Coleta em 2 dias</small>
                                <button class="btn btn-sm btn-success float-end">Solicitar</button>
                            </div>`;
                    }, 800);
                }
            });
            document.getElementById('back-to-material-form')?.addEventListener('click', () => {
                document.getElementById('material-results-step').style.display = 'none';
                document.getElementById('material-form-step').style.display = 'block';
            });
        }

        document.querySelectorAll('.guideline-header').forEach(h => {
            h.addEventListener('click', () => {
                const body = h.nextElementSibling;
                h.closest('.guideline-card').classList.toggle('active');
                body.style.maxHeight = body.style.maxHeight ? null : '200px';
            });
        });
    } catch(e) { console.error("Erro extras:", e); }
});