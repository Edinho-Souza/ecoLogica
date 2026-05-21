document.addEventListener('DOMContentLoaded', async () => {
    const dashboardRoot = document.querySelector('.user-dashboard');
    if (!dashboardRoot) return;

    const session = requireLogin();
    if (!session) return;

    const state = {
        user: null,
        points: 0,
        selectedReward: null
    };

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));

    const formatDistance = (meters) => {
        if (meters < 1000) return `${Math.round(meters)} m`;
        return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
    };

    const distanceInMeters = (origin, target) => {
        const toRad = value => (value * Math.PI) / 180;
        const earthRadius = 6371000;
        const dLat = toRad(target.lat - origin.lat);
        const dLng = toRad(target.lng - origin.lng);
        const lat1 = toRad(origin.lat);
        const lat2 = toRad(target.lat);
        const a = Math.sin(dLat / 2) ** 2
            + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const updateAvatarImages = (src) => {
        const avatarSrc = src || 'img/avatar/avatar-user.png';
        document.querySelectorAll('.profile-v2-avatar, #edit-profile-avatar-img').forEach(image => {
            if (image) image.src = avatarSrc;
        });
    };

    const getRewardImg = (name) => {
        const normalized = (name || '').toLowerCase();
        if (normalized.includes('ecobag')) return 'img/recompensas/ecobag.png';
        if (normalized.includes('garrafa')) return 'img/recompensas/garrafa.png';
        if (normalized.includes('semente')) return 'img/recompensas/caixa-sementes.png';
        if (normalized.includes('cupom')) return 'img/recompensas/cupom-desconto.png';
        return 'img/geral-site/logo-aba-navegador.png';
    };

    const initChart = (historico = []) => {
        const ctx = document.getElementById('disposalHistoryChart');
        if (!ctx || typeof Chart === 'undefined') return;

        const grouped = historico.reduce((acc, item) => {
            const date = item.data ? new Date(item.data) : new Date();
            const label = date.toLocaleDateString('pt-BR', { month: 'short' });
            acc[label] = (acc[label] || 0) + Math.max(item.pontos || 0, 0);
            return acc;
        }, {});

        const labels = Object.keys(grouped).slice(-6);
        const values = labels.map(label => grouped[label]);
        const fallbackLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.length ? labels : fallbackLabels,
                datasets: [{
                    label: 'Pontos gerados',
                    data: values.length ? values : [0, 0, 0, 0, 0, 0],
                    fill: true,
                    backgroundColor: 'rgba(72, 143, 88, 0.15)',
                    borderColor: '#2c5836',
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
            }
        });
    };

    const loadUser = async () => {
        state.user = await apiFetch('/usuarios/me');
        const pontos = await apiFetch(`/pontuacao/usuario/${state.user.id}`);
        state.points = pontos.pontosTotal || 0;

        setText('user-name', state.user.nome);
        setText('user-email', state.user.email);
        setText('user-address', localStorage.getItem('user_address') || '[Endereco nao cadastrado]');
        setText('user-points-value', state.points);
        setText('modal-user-points', state.points);
        updateAvatarImages(state.user.fotoPerfil || localStorage.getItem(`user_avatar_${state.user.id}`));

        localStorage.setItem('user_id', state.user.id);
        localStorage.setItem('username', state.user.nome);
        localStorage.setItem('user_email', state.user.email);

        try {
            const historico = await apiFetch(`/historico/usuario/${state.user.id}`);
            initChart(historico);
        } catch {
            initChart([]);
        }
    };

    const renderRewards = async () => {
        const container = document.getElementById('redeem-list-container');
        const confirmButton = document.getElementById('confirmRedeemButton');
        const feedback = document.getElementById('redeem-feedback');
        if (!container) return;

        state.selectedReward = null;
        if (confirmButton) confirmButton.disabled = true;
        if (feedback) feedback.textContent = '';

        try {
            const rewards = await apiFetch('/beneficios');
            container.innerHTML = '';

            if (!rewards.length) {
                container.innerHTML = '<div class="text-muted text-center p-3">Nenhum beneficio disponivel.</div>';
                return;
            }

            rewards.forEach(reward => {
                const canAfford = state.points >= reward.pontosNecessarios;
                const imageSrc = reward.imagemUrl || getRewardImg(reward.titulo);
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'list-group-item list-group-item-action d-flex align-items-center p-2';
                item.innerHTML = `
                    <a href="#" class="redeem-item-image-link me-3 flex-shrink-0"
                       data-bs-toggle="modal"
                       data-bs-target="#imageLightboxModal"
                       data-image-src="${imageSrc}"
                       data-image-title="${reward.titulo}"
                       style="width:50px; height:50px; display:block;">
                        <img src="${imageSrc}" style="width:100%; height:100%; object-fit:contain;" alt="${reward.titulo}">
                    </a>
                    <div class="flex-grow-1 text-start overflow-hidden">
                        <div class="fw-bold text-truncate">${reward.titulo}</div>
                        <small class="text-muted">${reward.descricao || 'Beneficio ecoLogica'}</small>
                    </div>
                    <span class="badge rounded-pill ${canAfford ? 'bg-success' : 'bg-secondary'} ms-2">${reward.pontosNecessarios} pts</span>
                `;

                item.addEventListener('click', (event) => {
                    if (event.target.closest('.redeem-item-image-link')) return;
                    container.querySelectorAll('button.list-group-item').forEach(button => button.classList.remove('active'));

                    if (!canAfford) {
                        if (feedback) feedback.textContent = 'Pontos insuficientes.';
                        if (confirmButton) confirmButton.disabled = true;
                        state.selectedReward = null;
                        return;
                    }

                    item.classList.add('active');
                    state.selectedReward = reward;
                    if (feedback) feedback.textContent = '';
                    if (confirmButton) confirmButton.disabled = false;
                });

                container.appendChild(item);
            });
        } catch (error) {
            container.innerHTML = `<div class="text-danger text-center p-3 small">${error.message}</div>`;
        }
    };

    const setupRedeemModal = () => {
        const redeemModal = document.getElementById('redeemModal');
        const confirmButton = document.getElementById('confirmRedeemButton');
        const feedback = document.getElementById('redeem-feedback');

        if (redeemModal) {
            redeemModal.addEventListener('show.bs.modal', renderRewards);
            redeemModal.addEventListener('click', (event) => {
                const imageLink = event.target.closest('.redeem-item-image-link');
                if (!imageLink) return;
                const lightboxImg = document.getElementById('lightboxImage');
                const lightboxLabel = document.getElementById('imageLightboxModalLabel');
                if (lightboxImg) lightboxImg.src = imageLink.dataset.imageSrc;
                if (lightboxLabel) lightboxLabel.textContent = imageLink.dataset.imageTitle;
            });
        }

        if (confirmButton) {
            confirmButton.addEventListener('click', async () => {
                if (!state.selectedReward) return;
                confirmButton.disabled = true;
                try {
                    const updated = await apiFetch('/pontuacao/resgatar', 'POST', {
                        idUsuario: state.user.id,
                        idBeneficio: state.selectedReward.id
                    });
                    state.points = updated.pontos || 0;
                    setText('user-points-value', state.points);
                    setText('modal-user-points', state.points);
                    if (feedback) feedback.textContent = 'Beneficio resgatado com sucesso.';
                } catch (error) {
                    if (feedback) feedback.textContent = error.message;
                }
            });
        }
    };

    const setupMaterialRequest = () => {
        const form = document.getElementById('registerMaterialForm');
        const backButton = document.getElementById('back-to-material-form');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const material = document.getElementById('materialType').value;
            const quantity = document.getElementById('materialQuantity').value.trim();
            const list = document.getElementById('company-results-list');
            const subtitle = document.getElementById('results-subtitle');

            document.getElementById('material-form-step').style.display = 'none';
            document.getElementById('material-results-step').style.display = 'block';
            if (subtitle) subtitle.textContent = `Para coletar ${material}...`;
            if (list) list.innerHTML = '<p class="text-center text-muted">Buscando empresas...</p>';

            try {
                const companies = await apiFetch('/empresas-recicladoras', 'GET', null, { skipAuth: true });
                if (!companies.length) {
                    list.innerHTML = '<p class="text-center text-muted">Nenhuma recicladora cadastrada.</p>';
                    return;
                }

                list.innerHTML = '';
                companies.forEach(company => {
                    const item = document.createElement('div');
                    item.className = 'border p-2 rounded bg-light mb-2';
                    item.innerHTML = `
                        <strong>${company.nomeEmpresa || company.nome || 'Recicladora'}</strong><br>
                        <small>${company.endereco || 'Endereco nao informado'}</small>
                        <button class="btn btn-sm btn-success float-end" data-company-id="${company.id}">Solicitar</button>
                    `;
                    item.querySelector('button').addEventListener('click', async (clickEvent) => {
                        const button = clickEvent.currentTarget;
                        button.disabled = true;
                        button.textContent = 'Enviando...';
                        try {
                            await apiFetch('/solicitacoes', 'POST', {
                                idUsuario: state.user.id,
                                idRecicladora: Number(button.dataset.companyId),
                                descricao: `Material: ${material}. Quantidade: ${quantity || 'nao informada'}.`
                            });
                            button.textContent = 'Solicitado';
                        } catch (error) {
                            button.disabled = false;
                            button.textContent = 'Solicitar';
                            alert(error.message);
                        }
                    });
                    list.appendChild(item);
                });
            } catch (error) {
                list.innerHTML = `<p class="text-danger text-center">${error.message}</p>`;
            }
        });

        if (backButton) {
            backButton.addEventListener('click', () => {
                document.getElementById('material-results-step').style.display = 'none';
                document.getElementById('material-form-step').style.display = 'block';
            });
        }
    };

    const setupProfileModal = () => {
        const modal = document.getElementById('editProfileModal');
        const saveButton = document.getElementById('saveProfileChangesButton');
        const avatarInput = document.getElementById('avatarUpload');
        const avatarPreview = document.getElementById('edit-profile-avatar-img');
        if (!modal || !saveButton) return;
        let pendingAvatar = '';

        modal.addEventListener('show.bs.modal', () => {
            document.getElementById('edit-user-name').value = state.user.nome || '';
            document.getElementById('edit-user-email').value = state.user.email || '';
            document.getElementById('edit-user-address').value = localStorage.getItem('user_address') || '';
            document.getElementById('edit-current-password').value = '';
            document.getElementById('edit-new-password').value = '';
            document.getElementById('edit-confirm-password').value = '';
            document.getElementById('edit-profile-feedback').textContent = '';
            pendingAvatar = state.user.fotoPerfil || localStorage.getItem(`user_avatar_${state.user.id}`) || '';
            if (avatarPreview) avatarPreview.src = pendingAvatar || 'img/avatar/avatar-user.png';
        });

        if (avatarInput && !avatarInput.dataset.listenerAdded) {
            avatarInput.addEventListener('change', async () => {
                const file = avatarInput.files?.[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                    alert('Selecione uma imagem de ate 2MB.');
                    avatarInput.value = '';
                    return;
                }
                pendingAvatar = await readFileAsDataUrl(file);
                if (avatarPreview) avatarPreview.src = pendingAvatar;
            });
            avatarInput.dataset.listenerAdded = 'true';
        }

        saveButton.addEventListener('click', async () => {
            const newPassword = document.getElementById('edit-new-password').value;
            const confirmPassword = document.getElementById('edit-confirm-password').value;
            const feedback = document.getElementById('edit-profile-feedback');

            if (newPassword && newPassword !== confirmPassword) {
                feedback.textContent = 'As novas senhas nao coincidem.';
                feedback.className = 'mt-3 text-center text-danger';
                return;
            }

            try {
                const payload = {
                    nome: document.getElementById('edit-user-name').value.trim(),
                    email: document.getElementById('edit-user-email').value.trim()
                };
                if (newPassword) payload.senha = newPassword;
                if (pendingAvatar) payload.fotoPerfil = pendingAvatar;

                state.user = await apiFetch('/usuarios/me', 'PUT', payload);
                localStorage.setItem('user_address', document.getElementById('edit-user-address').value.trim());
                if (pendingAvatar) localStorage.setItem(`user_avatar_${state.user.id}`, pendingAvatar);
                await loadUser();
                feedback.textContent = 'Perfil atualizado.';
                feedback.className = 'mt-3 text-center text-success';
            } catch (error) {
                feedback.textContent = error.message;
                feedback.className = 'mt-3 text-center text-danger';
            }
        });
    };

    const resolveAddressToCoordinates = async (query) => {
        let lookup = query.trim();
        const cep = lookup.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    lookup = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`;
                }
            } catch {
                // Continua com o texto original se o servico de CEP estiver indisponivel.
            }
        }

        const params = new URLSearchParams({
            format: 'json',
            limit: '1',
            countrycodes: 'br',
            q: lookup
        });
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
        const results = await response.json();
        if (!Array.isArray(results) || !results.length) {
            throw new Error('Nao foi possivel localizar esse endereco ou CEP.');
        }
        return {
            lat: Number(results[0].lat),
            lng: Number(results[0].lon),
            label: results[0].display_name
        };
    };

    const setupCollectionPointSearch = () => {
        const form = document.getElementById('collectionPointSearchForm');
        if (!form) return;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const query = document.getElementById('userAddress').value.trim();
            const results = document.getElementById('collection-point-results');
            if (!query) {
                results.innerHTML = '<p class="text-danger small">Informe um endereco ou CEP.</p>';
                return;
            }

            results.innerHTML = '<p class="text-muted small">Buscando ponto de coleta mais proximo...</p>';
            try {
                const origin = await resolveAddressToCoordinates(query);
                const points = await apiFetch('/locais-coleta', 'GET', null, { skipAuth: true });
                const ranked = points
                    .filter(point => point.latitude && point.longitude)
                    .map(point => ({
                        ...point,
                        distance: distanceInMeters(origin, { lat: Number(point.latitude), lng: Number(point.longitude) })
                    }))
                    .sort((a, b) => a.distance - b.distance);

                if (!ranked.length) {
                    results.innerHTML = '<p class="text-muted small">Nenhum ponto de coleta com localizacao cadastrada.</p>';
                    return;
                }

                const nearest = ranked[0];
                results.innerHTML = `
                    <div class="border rounded p-3 bg-light">
                        <div class="fw-bold">${escapeHtml(nearest.nome)}</div>
                        <div class="small text-muted">${escapeHtml(nearest.endereco || nearest.cidade || '')}</div>
                        <div class="mt-2"><span class="badge bg-success">${formatDistance(nearest.distance)}</span> de distancia do endereco informado.</div>
                        <div class="small mt-2">${escapeHtml(nearest.tiposMateriaisAceitos?.join(', ') || 'Materiais nao informados')}</div>
                        <a class="btn btn-sm btn-outline-secondary mt-3" href="pontosColeta.html">Abrir mapa completo</a>
                    </div>
                `;
            } catch (error) {
                results.innerHTML = `<p class="text-danger small">${escapeHtml(error.message)}</p>`;
            }
        });
    };

    document.querySelectorAll('.guideline-header').forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            header.closest('.guideline-card').classList.toggle('active');
            body.style.maxHeight = body.style.maxHeight ? null : '200px';
        });
    });

    setupRedeemModal();
    setupMaterialRequest();
    setupProfileModal();
    setupCollectionPointSearch();
    await loadUser();
});
