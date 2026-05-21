document.addEventListener('DOMContentLoaded', async () => {
    const session = requireLogin();
    if (!session) return;

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    const initChart = () => {
        const ctx = document.getElementById('disposalHistoryChart');
        if (!ctx || typeof Chart === 'undefined') return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Solicitacoes atendidas',
                    data: [0, 0, 0, 0, 0, 0],
                    fill: true,
                    backgroundColor: 'rgba(44, 88, 54, 0.12)',
                    borderColor: '#2c5836',
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    };

    const loadCompanyData = async () => {
        const user = await apiFetch('/usuarios/me');
        let company = {};
        try {
            company = await apiFetch(`/empresas-recicladoras/${user.id}`, 'GET', null, { skipAuth: true });
        } catch {
            company = {};
        }

        setText('company-name', company.nomeEmpresa || user.nome);
        setText('company-email', company.email || user.email);
        setText('company-address', company.endereco || '[Endereco nao cadastrado]');
        setText('company-cnpj', company.cnpj || '[CNPJ nao cadastrado]');

        localStorage.setItem('username', user.nome);
        localStorage.setItem('user_email', user.email);
    };

    const setupMaterialsModal = () => {
        const modal = document.getElementById('materialsModal');
        const form = document.getElementById('registerMaterialForm');
        const saveButton = document.getElementById('saveMaterialsButton');
        const feedback = document.getElementById('materials-feedback');
        if (!modal || !form || !saveButton) return;

        const storageKey = `ecoLogica_materials_${session.id}`;
        const checkboxes = [...form.querySelectorAll('input[name="materialColetado"]')];

        modal.addEventListener('show.bs.modal', () => {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = saved.includes(checkbox.value);
            });
            if (feedback) feedback.textContent = '';
        });

        saveButton.addEventListener('click', () => {
            const selected = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
            localStorage.setItem(storageKey, JSON.stringify(selected));
            if (feedback) {
                feedback.textContent = 'Materiais atualizados.';
                feedback.className = 'mt-3 text-center text-success';
            }
        });
    };

    const setupProfileModal = () => {
        const modal = document.getElementById('editProfileModal');
        const saveButton = document.getElementById('saveProfileChangesButton');
        if (!modal || !saveButton) return;

        modal.addEventListener('show.bs.modal', () => {
            document.getElementById('edit-current-password').value = '';
            document.getElementById('edit-new-password').value = '';
            document.getElementById('edit-confirm-password').value = '';
            document.getElementById('edit-profile-feedback').textContent = '';
        });

        saveButton.addEventListener('click', async () => {
            const newPassword = document.getElementById('edit-new-password').value;
            const confirmPassword = document.getElementById('edit-confirm-password').value;
            const feedback = document.getElementById('edit-profile-feedback');

            if (!newPassword) {
                feedback.textContent = 'Informe uma nova senha para atualizar.';
                feedback.className = 'mt-3 text-center text-danger';
                return;
            }

            if (newPassword !== confirmPassword) {
                feedback.textContent = 'As novas senhas nao coincidem.';
                feedback.className = 'mt-3 text-center text-danger';
                return;
            }

            try {
                await apiFetch('/usuarios/me', 'PUT', { senha: newPassword });
                feedback.textContent = 'Senha atualizada.';
                feedback.className = 'mt-3 text-center text-success';
            } catch (error) {
                feedback.textContent = error.message;
                feedback.className = 'mt-3 text-center text-danger';
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

    setupMaterialsModal();
    setupProfileModal();
    initChart();
    await loadCompanyData();
});
