/**
 * @file admin-dashboard.js
 * Gerencia as interatividades específicas da página de administração (admin.html),
 * como modais, gráficos, tabelas e formulários.
 */

document.addEventListener('DOMContentLoaded', () => {

    let miniMapInstance = null;
    let fullMapInstance = null

    console.log("admin-dashboard.js: Script carregado.");

    // ===================================================================
    // DADOS SIMULADOS E VARIÁVEIS DE PAGINAÇÃO (Atualizado com Logs)
    // ===================================================================
    let simulatedUsers = [
        // Adicionando mais usuários para testar a paginação
        { id: 1, name: "Sofia Terra", email: "terradasofia@ecologica.com", points: 150, status: "Ativo" },
        { id: 2, name: "Carlos Rocha", email: "carlos@email.com", points: 1180, status: "Ativo" },
        { id: 3, name: "Beatriz Farias", email: "bia.f@mail.net", points: 1250, status: "Ativo" },
        { id: 4, name: "Mariana Silva", email: "mari.silva@provider.org", points: 1150, status: "Ativo" },
        { id: 5, name: "Rafael Oliveira", email: "rafa.oli@sample.com", points: 1090, status: "Ativo" },
        { id: 6, name: "Juliana Pereira", email: "juli.pereira@domain.net", points: 1050, status: "Ativo" },
        { id: 7, name: "Usuário Inativo Teste", email: "inativo@mail.com", points: 20, status: "Inativo" },
        { id: 8, name: "Fernando Lima", email: "fer.lima@mail.com", points: 980, status: "Ativo" },
        { id: 9, name: "Patricia Souza", email: "paty@example.org", points: 950, status: "Ativo" },
        { id: 10, name: "Ricardo Alves", email: "ricardo.a@provider.net", points: 910, status: "Ativo" },
        { id: 11, name: "Camila Santos", email: "camila.s@domain.com", points: 880, status: "Ativo" },
        { id: 12, name: "Outro Inativo", email: "outro@inativo.com", points: 5, status: "Inativo" },
        { id: 13, name: "Lucas Mendes", email: "lucas.m@email.net", points: 850, status: "Ativo" }
    ];
    let filteredUserList = [...simulatedUsers]; // Lista que será exibida (inicialmente todos)
    let currentPage = 1;
    const itemsPerPage = 5; // Quantos usuários mostrar por página

    let storedCampaigns = localStorage.getItem('ecoLogica_Campaigns');
    let simulatedCampaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [
        // Se o localStorage estiver vazio, use as campanhas padrão
        { id: 1, title: "Recicla Pomerode", startDate: "2025-09-01", endDate: "2025-09-22", description: "Mutirão...", image: "https://picsum.photos/400/250?random=10", points: 200 },
        { id: 2, title: "Plástico Zero", startDate: "2025-10-01", endDate: "2025-10-31", description: "Troque 2kg...", image: "https://picsum.photos/400/250?random=11", points: null },
    ];
    let nextCampaignId = simulatedCampaigns.length > 0 ? Math.max(...simulatedCampaigns.map(c => c.id)) + 1 : 3;

    // *** DADOS SIMULADOS EXTRAS (para o modal de perfil) ***
    const simulatedRecycled = Math.floor(Math.random() * 500) + 100;
    const simulatedLastLogin = '2025-10-20 09:30:00';
    // *** FIM DADOS SIMULADOS EXTRAS ***

    let simulatedLogs = [
        { id: 101, timestamp: "2025-10-26 14:30:00", user: "Sofia Terra", action: "Registro Material", details: "Plástico (Aprox. 2 sacolas)", points: "+50", company: "Recicladora Vale Limpo" },
        { id: 102, timestamp: "2025-10-26 10:15:00", user: "Carlos Rocha", action: "Resgate Recompensa", details: "Ecobag ecoLogica", points: "-50", company: "" },
        { id: 103, timestamp: "2025-10-25 18:00:00", user: "Beatriz Farias", action: "Registro Material", details: "Vidro (1 caixa)", points: "+70", company: "Cooperativa Bairro Verde" },
        { id: 104, timestamp: "2025-10-25 09:05:00", user: "Sofia Terra", action: "Registro Material", details: "Metal (latas)", points: "+30", company: "Recicladora Vale Limpo" },
        { id: 105, timestamp: "2025-10-24 16:20:00", user: "Rafael Oliveira", action: "Cadastro Newsletter", details: "", points: "+10", company: "" },
        { id: 106, timestamp: "2025-10-24 11:00:00", user: "Mariana Silva", action: "Registro Material", details: "Óleo (2 garrafas)", points: "+40", company: "Recicladora Vale Limpo" },
        { id: 107, timestamp: "2025-10-23 15:00:00", user: "Carlos Rocha", action: "Registro Material", details: "Papelão (3 caixas)", points: "+60", company: "Cooperativa Bairro Verde" },
        { id: 108, timestamp: "2025-10-23 10:00:00", user: "Juliana Pereira", action: "Registro Material", details: "Eletrônico (1 celular)", points: "+100", company: "Recicladora Vale Limpo" },
        { id: 109, timestamp: "2025-10-22 17:00:00", user: "Sofia Terra", action: "Resgate Recompensa", details: "Pacote Sementes", points: "-30", company: "" },
        { id: 110, timestamp: "2025-10-22 13:00:00", user: "Beatriz Farias", action: "Registro Material", details: "Plástico (1 sacola grande)", points: "+45", company: "Cooperativa Bairro Verde" },
        { id: 111, timestamp: "2025-10-21 08:30:00", user: "Carlos Rocha", action: "Registro Material", details: "Metal (Panelas velhas)", points: "+80", company: "MetalNorte Reciclagem" },
    ];
    let filteredLogList = [...simulatedLogs]; // Lista de logs a ser exibida
    let currentLogPage = 1;
    const logsPerPage = 5; // Quantos logs mostrar por página

    // *** NOVO: DADOS E VARIÁVEIS PARA CONFIGURAÇÕES ***
    const DEFAULT_SETTINGS = {
        pointsKgPlastico: 50,
        pointsKgPapel: 30,
        pointsKgVidro: 20, // <-- ADICIONADO
        pointsKgMetal: 40, // <-- ADICIONADO
        pointsLtOleo: 60, // <-- ADICIONADO
        pointsUndEletronico: 100, // <-- ADICIONADO
        pointsNewsletter: 10,
        // ... (resto das configurações)
        settingTelegramLink: "https://t.me/+Fsirxfskk-MyOTRh",
        settingFacebookLink: "",
        settingInstagramLink: "",
        settingContactEmail: "contato@ecologica.com",
        settingContactPhone: "(00) 1234-5678" // <-- Verifique se este já foi adicionado
    };

    let currentSettings = {};
    let tempNewMarker = null;


    // Função para carregar configurações do localStorage ou usar padrão
    const loadSettings = () => {
        const storedSettings = localStorage.getItem('ecoLogica_Settings');
        if (storedSettings) {
            try {
                currentSettings = JSON.parse(storedSettings);
                // Garante que todas as chaves padrão existam, mesmo que salvas anteriormente sem elas
                currentSettings = { ...DEFAULT_SETTINGS, ...currentSettings };
            } catch (e) {
                console.error("Erro ao carregar configurações do localStorage:", e);
                currentSettings = { ...DEFAULT_SETTINGS }; // Usa padrão em caso de erro
            }
        } else {
            currentSettings = { ...DEFAULT_SETTINGS }; // Usa padrão se não houver nada salvo
        }
        console.log("Configurações carregadas:", currentSettings);
    };

    // Carrega as configurações assim que o script começa
    loadSettings();
    // *** FIM NOVO ***

    // *** NOVO: DADOS E VARIÁVEIS PARA EMPRESAS ***
    let simulatedRecyclers = []; // Empresas Recicladoras
    let simulatedSupporters = []; // Empresas Apoiadoras
    let nextCompanyId = 1; // Para simular IDs únicos para todas as empresas

    // Função para carregar empresas do localStorage ou usar exemplos
    const loadCompanies = () => {
        const storedRecyclers = localStorage.getItem('ecoLogica_Recyclers');
        const storedSupporters = localStorage.getItem('ecoLogica_Supporters');

        simulatedRecyclers = storedRecyclers ? JSON.parse(storedRecyclers) : [
            // Exemplos iniciais se localStorage vazio
            { id: 1001, name: "Recicladora Vale Limpo", email: "contato@valelimpo.com", type: "recicladora", cnpj: "11.111.111/0001-11", address: "Rua Industrial, 1000" },
            { id: 1002, name: "Cooperativa Bairro Verde", email: "coop@bairroverde.org", type: "recicladora", cnpj: "22.222.222/0001-22", address: "Av. Central, 500" }
        ];
        simulatedSupporters = storedSupporters ? JSON.parse(storedSupporters) : [
            // Exemplos iniciais se localStorage vazio
            { id: 2001, name: "Supermercado Econômico", email: "mkt@economico.com", type: "apoiadora", cnpj: "33.333.333/0001-33", address: "Rua Principal, 100" },
            { id: 2002, name: "Loja VerdesFolhas", email: "contato@verdesfolhas.com", type: "apoiadora", cnpj: "44.444.444/0001-44", address: "Rua das Vitrines, 20" }
        ];

        // Calcula o próximo ID baseado nos IDs existentes
        const allIds = [...simulatedRecyclers, ...simulatedSupporters].map(c => c.id);
        nextCompanyId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

        console.log("Empresas Recicladoras carregadas:", simulatedRecyclers);
        console.log("Empresas Apoiadoras carregadas:", simulatedSupporters);
    };

    // Carrega as empresas ao iniciar
    loadCompanies();
    // *** FIM NOVO ***


    // ===================================================================
    // *** NOVO: DADOS E VARIÁVEIS PARA PONTOS DE COLETA (ADICIONAR AQUI) ***
    // ===================================================================

    let storedCollectionPoints = localStorage.getItem('ecoLogica_CollectionPoints'); // Adicionado
    let simulatedCollectionPoints = storedCollectionPoints ? JSON.parse(storedCollectionPoints) : [
        { id: 1, name: "EcoPonto Centro", lat: -26.9179, lng: -49.0740, type: "Geral", isActive: true },
        { id: 2, name: "Recicla Eletrônicos Velha", lat: -26.9050, lng: -49.0700, type: "Eletrônicos", isActive: true },
        { id: 3, name: "Ponto Sul (Temporário)", lat: -26.9300, lng: -49.0900, type: "Plástico/Papel", isActive: false }
    ];
    let nextPointId = simulatedCollectionPoints.length > 0 ? Math.max(...simulatedCollectionPoints.map(p => p.id)) + 1 : 1; // Ajuste para o próximo ID

    console.log("Pontos de Coleta carregados:", simulatedCollectionPoints); // Adicione um log para conferir
    // FIM NOVO: DADOS E VARIÁVEIS PARA PONTOS DE COLETA

    // NOVO: Função para salvar pontos no localStorage
    const saveCollectionPoints = () => {
        try {
            localStorage.setItem('ecoLogica_CollectionPoints', JSON.stringify(simulatedCollectionPoints));
            console.log("Pontos de Coleta salvos no localStorage.");
        } catch (e) {
            console.error("Erro ao salvar pontos de coleta no localStorage:", e);
        }
    };
    // FIM NOVO

    // ===================================================================
    // FUNÇÃO: GERENCIAMENTO DO MODAL "EDITAR PERFIL ADMIN"
    // ===================================================================
    const handleAdminProfileModal = () => { /* ... (código inalterado) ... */
        const modalElement = document.getElementById('editAdminProfileModal');
        if (!modalElement) { console.warn("Modal #editAdminProfileModal não encontrado."); return; }
        const modalInstance = new bootstrap.Modal(modalElement);
        const form = document.getElementById('editAdminProfileForm');
        const saveButton = document.getElementById('saveAdminProfileChangesButton');
        const feedbackDiv = document.getElementById('edit-admin-profile-feedback');
        const avatarUploadInput = document.getElementById('adminAvatarUpload');
        const avatarPreviewImg = document.getElementById('edit-admin-profile-avatar-img');
        const currentPasswordInput = document.getElementById('edit-admin-current-password');
        const newPasswordInput = document.getElementById('edit-admin-new-password');
        const confirmPasswordInput = document.getElementById('edit-admin-confirm-password');
        const modalNameDisplay = document.getElementById('modal-admin-name-display');
        const modalEmailDisplay = document.getElementById('modal-admin-email-display');
        const mainAvatarDisplay = document.getElementById('admin-avatar-display');
        const mainNameDisplay = document.getElementById('admin-name-display');
        const mainEmailDisplay = document.getElementById('admin-email-display');

        modalElement.addEventListener('show.bs.modal', () => {
            if (mainNameDisplay && modalNameDisplay) modalNameDisplay.textContent = mainNameDisplay.textContent;
            if (mainEmailDisplay && modalEmailDisplay) modalEmailDisplay.textContent = mainEmailDisplay.textContent;
            if (mainAvatarDisplay) avatarPreviewImg.src = mainAvatarDisplay.src;
            currentPasswordInput.value = ''; newPasswordInput.value = ''; confirmPasswordInput.value = '';
            avatarUploadInput.value = ''; feedbackDiv.textContent = ''; feedbackDiv.className = 'mt-3 text-center';
            saveButton.disabled = false;
        });
        avatarUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { feedbackDiv.textContent = 'Erro: A imagem deve ter no máximo 2MB.'; feedbackDiv.className = 'mt-3 text-center text-danger'; avatarUploadInput.value = ''; return; }
                if (!['image/jpeg', 'image/png'].includes(file.type)) { feedbackDiv.textContent = 'Erro: Formato inválido. Use JPG ou PNG.'; feedbackDiv.className = 'mt-3 text-center text-danger'; avatarUploadInput.value = ''; return; }
                const reader = new FileReader(); reader.onload = (e) => { avatarPreviewImg.src = e.target.result; feedbackDiv.textContent = ''; };
                reader.onerror = () => { feedbackDiv.textContent = 'Erro ao ler a imagem.'; feedbackDiv.className = 'mt-3 text-center text-danger'; }; reader.readAsDataURL(file);
            }
        });
        saveButton.addEventListener('click', () => {
            feedbackDiv.textContent = ''; const currentPassword = currentPasswordInput.value; const newPassword = newPasswordInput.value; const confirmPassword = confirmPasswordInput.value; const newAvatarSrc = avatarPreviewImg.src;
            if (newPassword || confirmPassword) {
                if (newPassword.length < 6) { feedbackDiv.textContent = 'Erro: A nova senha deve ter pelo menos 6 caracteres.'; feedbackDiv.className = 'mt-3 text-center text-danger'; newPasswordInput.focus(); return; }
                if (newPassword !== confirmPassword) { feedbackDiv.textContent = 'Erro: As novas senhas não coincidem.'; feedbackDiv.className = 'mt-3 text-center text-danger'; confirmPasswordInput.focus(); return; }
            }
            console.log("Simulando envio para backend:", { avatarChanged: mainAvatarDisplay ? newAvatarSrc !== mainAvatarDisplay.src : true, passwordChanged: !!newPassword });
            feedbackDiv.textContent = 'Salvando alterações...'; feedbackDiv.className = 'mt-3 text-center text-info'; saveButton.disabled = true;
            setTimeout(() => {
                console.log("Simulação: Dados salvos com sucesso!"); if (mainAvatarDisplay) mainAvatarDisplay.src = newAvatarSrc;
                feedbackDiv.textContent = 'Perfil atualizado com sucesso!'; feedbackDiv.className = 'mt-3 text-center text-success'; saveButton.disabled = false;
                setTimeout(() => { modalInstance.hide(); }, 1500);
            }, 1500);
        });
    }; // Fim handleAdminProfileModal


    // Mantenha a função handleMapEditorActions simplificada com a lógica de Salvar:
    const handleMapEditorActions = () => {
        const form = document.getElementById('pointDetailsForm');
        const formContainer = document.getElementById('pointDetailsFormContainer');
        const cancelButton = document.getElementById('cancelPointButton');

        const resetFormAndMarker = () => {
            formContainer.style.display = 'none';
            form.reset();
            // ESTA LÓGICA AGORA VAI ENCONTRAR O tempNewMarker e fullMapInstance
            if (tempNewMarker && fullMapInstance) {
                fullMapInstance.removeLayer(tempNewMarker);
                tempNewMarker = null;
            }
            document.getElementById('pointFormTitle').textContent = "Adicionar Novo Ponto";
            document.getElementById('savePointButton').textContent = "Salvar Ponto";
        };

        // Adiciona o listener para o botão Cancelar
        if (cancelButton) {
            cancelButton.addEventListener('click', resetFormAndMarker);
        }

        // Lógica de Salvar (submit)
// Lógica de Salvar (submit)
if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // NOVO: Verifica se é edição (se o ID escondido foi preenchido)
        const editingId = document.getElementById('pointId').value ? parseInt(document.getElementById('pointId').value) : null;
        const newPointData = {
            // Se for novo, usa nextPointId++, senão usa o ID existente
            id: editingId || nextPointId++, 
            name: document.getElementById('pointName').value.trim(),
            lat: parseFloat(document.getElementById('pointLat').value),
            lng: parseFloat(document.getElementById('pointLng').value),
            type: document.getElementById('pointType').value.trim(),
            isActive: document.getElementById('pointIsActive').checked
        };
        
        if (editingId) {
            // MODO EDIÇÃO: Encontra o ponto e o substitui
            const index = simulatedCollectionPoints.findIndex(p => p.id === editingId);
            if (index !== -1) {
                simulatedCollectionPoints[index] = newPointData;
                alert(`Ponto '${newPointData.name}' atualizado com sucesso!`);
            }
        } else {
            // MODO CRIAÇÃO: Adiciona um novo ponto
            simulatedCollectionPoints.push(newPointData);
            alert(`Ponto '${newPointData.name}' cadastrado com sucesso!`);
        }

        saveCollectionPoints(); // Salva no localStorage (Função já existente)
        renderCollectionPointsOnFullMap();
        renderPointsList();
        
        // Recarrega o mini-mapa lateral
        setTimeout(() => {
            initAdminMaps(); 
        }, 50);

        resetFormAndMarker(); // Esta função limpa o formulário e o pino temporário
    });
}

    };

    // ===================================================================
    // FUNÇÃO: INICIALIZA OS GRÁFICOS DO ADMIN
    // ===================================================================
    const initAdminCharts = () => {
        // ... (seu código existente dos gráficos, sem alterações) ...
        console.log("Função initAdminCharts chamada.");
        if (typeof Chart === 'undefined') { console.error("Chart.js não está carregado."); return; }
        Chart.defaults.font.family = "'Open Sans', sans-serif"; Chart.defaults.color = '#555'; const meses = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
        const companyCtx = document.getElementById('companyCollectionChart')?.getContext('2d');
        if (companyCtx) { new Chart(companyCtx, { type: 'bar', data: { labels: ['Recicla Vale', 'Cooperativa Bairro', 'MetalNorte', 'Outra'], datasets: [{ label: 'Kg Coletado (Mês Atual)', data: [1250, 850, 1500, 400], backgroundColor: ['rgba(72, 143, 88, 0.7)', 'rgba(44, 88, 54, 0.7)', 'rgba(168, 208, 141, 0.7)', 'rgba(232, 122, 0, 0.7)'], borderColor: ['rgba(72, 143, 88, 1)', 'rgba(44, 88, 54, 1)', 'rgba(168, 208, 141, 1)', 'rgba(232, 122, 0, 1)'], borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false }, title: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x} Kg` } } }, scales: { y: { grid: { display: false } }, x: { beginAtZero: true, title: { display: true, text: 'Kg Coletado' } } } } }); } else { console.warn("Canvas #companyCollectionChart não encontrado."); }
        const totalUserCtx = document.getElementById('totalUserRecyclingChart')?.getContext('2d');
        if (totalUserCtx) { const gradientFill = totalUserCtx.createLinearGradient(0, 0, 0, 150); gradientFill.addColorStop(0, 'rgba(232, 122, 0, 0.6)'); gradientFill.addColorStop(1, 'rgba(232, 122, 0, 0.05)'); new Chart(totalUserCtx, { type: 'line', data: { labels: meses, datasets: [{ label: 'Total Reciclado (Kg)', data: [650, 710, 750, 920, 880, 1050], fill: true, backgroundColor: gradientFill, borderColor: '#e87a00', borderWidth: 2, pointBackgroundColor: '#e87a00', pointRadius: 3, tension: 0.3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Kg' } }, x: { grid: { display: false } } }, interaction: { intersect: false, mode: 'index' }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} Kg` } } } }); } else { console.warn("Canvas #totalUserRecyclingChart não encontrado."); }
        const userGrowthCtx = document.getElementById('userGrowthChart')?.getContext('2d');
        if (userGrowthCtx) { new Chart(userGrowthCtx, { type: 'line', data: { labels: meses, datasets: [{ label: 'Novos Usuários', data: [15, 22, 18, 30, 25, 35], borderColor: '#488f58', borderWidth: 2, pointBackgroundColor: '#488f58', pointRadius: 3, tension: 0.1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Novos Cadastros' } }, x: { grid: { display: false } } }, interaction: { intersect: false, mode: 'index' }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} usuários` } } } }); } else { console.warn("Canvas #userGrowthChart não encontrado."); }
        const visitorsCtx = document.getElementById('siteVisitorsChart')?.getContext('2d');
        if (visitorsCtx) { new Chart(visitorsCtx, { type: 'bar', data: { labels: meses, datasets: [{ label: 'Visitantes Únicos', data: [1100, 1300, 1200, 1500, 1450, 1600], backgroundColor: 'rgba(0, 123, 255, 0.6)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Visitantes' } }, x: { grid: { display: false } } }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} visitantes` } } } }); } else { console.warn("Canvas #siteVisitorsChart não encontrado."); }
    }; // Fim initAdminCharts

    // ===================================================================
    // FUNÇÕES DE GERENCIAMENTO DE USUÁRIOS
    // ===================================================================
    const populateUserTable = () => {
        // ... (seu código existente, sem alterações) ...
        const tableBody = document.getElementById('user-table-body');
        if (!tableBody) { console.warn("Tabela #user-table-body não encontrada."); return; }
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const usersToDisplay = filteredUserList.slice(startIndex, endIndex);
        if (usersToDisplay.length === 0 && currentPage === 1) { tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum usuário encontrado com os filtros aplicados.</td></tr>'; renderPaginationControls(); return; }
        if (usersToDisplay.length === 0 && currentPage > 1) { tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Nenhum usuário nesta página (${currentPage}).</td></tr>`; renderPaginationControls(); return; }
        usersToDisplay.forEach(user => {
            const statusBadgeClass = user.status === 'Ativo' ? 'bg-success' : 'bg-danger';
            // ATUALIZADO: Adicionado data-bs-toggle/target para o botão "Ver Perfil"
            const row = `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.points}</td><td><span class="badge ${statusBadgeClass}">${user.status}</span></td><td><button class="btn btn-sm btn-outline-primary action-btn" data-user-id="${user.id}" data-action="view" title="Ver Perfil" data-bs-toggle="modal" data-bs-target="#userProfileModal"><i class="fas fa-eye"></i></button><button class="btn btn-sm btn-outline-secondary action-btn" data-user-id="${user.id}" data-action="points" title="Add/Rem Pontos"><i class="fas fa-coins"></i></button><button class="btn btn-sm btn-outline-warning action-btn" data-user-id="${user.id}" data-action="reset_pw" title="Resetar Senha"><i class="fas fa-key"></i></button><button class="btn btn-sm btn-outline-danger action-btn" data-user-id="${user.id}" data-action="toggle_status" title="${user.status === 'Ativo' ? 'Desativar' : 'Ativar'} Conta"><i class="fas ${user.status === 'Ativo' ? 'fa-user-slash' : 'fa-user-check'}"></i></button></td></tr>`;
            tableBody.innerHTML += row;
        });
        renderPaginationControls();
    };
    const handleUserActionClick = (event) => {
        // ... (seu código existente, sem alterações) ...
        const button = event.target.closest('.action-btn');
        if (!button) return;
        event.preventDefault();
        const userId = button.dataset.userId;
        const action = button.dataset.action;
        const userIndex = simulatedUsers.findIndex(u => u.id == userId);
        if (userIndex === -1) { console.error(`Usuário ${userId} não encontrado no array original.`); return; }
        const user = simulatedUsers[userIndex];
        console.log(`Ação '${action}' para ${user.name}`);

        switch (action) {
            case 'view':
                // *** IMPLEMENTAÇÃO DO MODAL DE DETALHES ***
                const modalElement = document.getElementById('userProfileModal');
                if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

                    // Preenche os dados no modal
                    document.getElementById('modal-user-avatar').src = 'img/avatar/avatar-user.png'; // Avatar padrão
                    document.getElementById('modal-user-name').textContent = user.name;

                    const statusEl = document.getElementById('modal-user-status');
                    statusEl.textContent = `Status: ${user.status}`;
                    statusEl.className = `text-muted small ${user.status === 'Ativo' ? 'text-success' : 'text-danger'}`;

                    document.getElementById('modal-user-id').textContent = user.id;
                    document.getElementById('modal-user-email').textContent = user.email;
                    document.getElementById('modal-user-points').textContent = user.points;

                    // Dados simulados extras
                    document.getElementById('modal-user-total-recycled').textContent = `${simulatedRecycled} Kg`;
                    document.getElementById('modal-user-last-login').textContent = simulatedLastLogin;

                    // Configura os botões de ação do modal para reexecutar a ação
                    const statusBtn = document.getElementById('modal-toggle-status-btn');
                    const resetPwBtn = document.getElementById('modal-reset-pw-btn');

                    statusBtn.textContent = user.status === 'Ativo' ? 'Desativar Conta' : 'Ativar Conta';
                    statusBtn.className = `btn btn-sm ${user.status === 'Ativo' ? 'btn-outline-danger' : 'btn-outline-success'}`;

                    // Anexa o ID do usuário aos botões
                    statusBtn.dataset.userId = userId;
                    resetPwBtn.dataset.userId = userId;

                    modal.show();
                } else {
                    alert(`(Simulação) Ver perfil de ${user.name}\nPontos: ${user.points}\nStatus: ${user.status}`);
                }
                break;
            // *** FIM IMPLEMENTAÇÃO DO MODAL ***
            case 'points': const pointsToAdd = prompt(`Ajustar pontos para ${user.name} (${user.points}). Digite (+/-):`, "0"); if (pointsToAdd !== null) { const points = parseInt(pointsToAdd); if (!isNaN(points)) { user.points += points; console.log(`Pontos atualizados para ${user.points}.`); handleUserSearchAndFilter(true); alert(`Pontos atualizados para ${user.points}.`); } else { alert("Valor inválido."); } } break;
            case 'reset_pw': if (confirm(`Gerar nova senha para ${user.name}?`)) { console.log(`(Simulação) Senha resetada para ${user.name}.`); alert(`(Simulação) Nova senha gerada.`); } break;
            case 'toggle_status': const newStatus = user.status === 'Ativo' ? 'Inativo' : 'Ativo'; if (confirm(`${newStatus === 'Inativo' ? 'DESATIVAR' : 'ATIVAR'} conta de ${user.name}?`)) { user.status = newStatus; console.log(`Status alterado para ${user.status}.`); handleUserSearchAndFilter(true); alert(`Conta ${newStatus === 'Inativo' ? 'desativada' : 'ativada'}.`); } break;
            default: console.warn(`Ação desconhecida: ${action}`);
        }
    };
    const renderPaginationControls = () => {
        // ... (seu código existente, sem alterações) ...
        const paginationNav = document.querySelector('.user-management-section nav[aria-label="Paginação de usuários"]');
        if (!paginationNav) return;
        const totalItems = filteredUserList.length; const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationUl = paginationNav.querySelector('.pagination'); paginationUl.innerHTML = '';
        if (totalPages <= 1) { paginationNav.style.display = 'none'; return; } paginationNav.style.display = 'flex';
        const prevLi = document.createElement('li'); prevLi.classList.add('page-item'); if (currentPage === 1) prevLi.classList.add('disabled'); prevLi.innerHTML = `<a class="page-link" href="#" data-page="prev">Anterior</a>`; paginationUl.appendChild(prevLi);
        for (let i = 1; i <= totalPages; i++) { const pageLi = document.createElement('li'); pageLi.classList.add('page-item'); if (i === currentPage) pageLi.classList.add('active'); pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`; paginationUl.appendChild(pageLi); }
        const nextLi = document.createElement('li'); nextLi.classList.add('page-item'); if (currentPage === totalPages) nextLi.classList.add('disabled'); nextLi.innerHTML = `<a class="page-link" href="#" data-page="next">Próximo</a>`; paginationUl.appendChild(nextLi);
    };
    const handleUserSearchAndFilter = (redrawOnly = false) => {
        // ... (seu código existente, sem alterações) ...
        const searchInput = document.getElementById('userSearchInput'); const statusFilter = document.getElementById('userStatusFilter'); const searchButton = document.getElementById('user-search-button'); const tableBody = document.getElementById('user-table-body');
        if (!searchInput || !statusFilter || !searchButton || !tableBody) { console.warn("Elementos de filtro/busca de usuários ou tbody não encontrados."); return; }
        const filterUsers = () => { const searchTerm = searchInput.value.toLowerCase().trim(); const selectedStatus = statusFilter.value.toLowerCase(); console.log(`Filtrando usuários: Termo='${searchTerm}', Status='${selectedStatus}'`); filteredUserList = simulatedUsers.filter(user => { const nameMatch = user.name.toLowerCase().includes(searchTerm); const emailMatch = user.email.toLowerCase().includes(searchTerm); const statusMatch = (selectedStatus === '') || (user.status.toLowerCase() === selectedStatus); return (nameMatch || emailMatch) && statusMatch; }); console.log("Usuários filtrados:", filteredUserList); currentPage = 1; populateUserTable(); };
        if (!searchButton.dataset.listenerAdded) { searchButton.addEventListener('click', filterUsers); tableBody.addEventListener('click', handleUserActionClick); searchButton.dataset.listenerAdded = 'true'; /* Real-time filter listeners commented out */ }
        if (redrawOnly) { console.log("Redesenhando tabela com filtros atuais após ação..."); filterUsers(); }
    };
    const handlePagination = () => {
        // ... (seu código existente, sem alterações) ...
        const paginationNav = document.querySelector('.user-management-section nav[aria-label="Paginação de usuários"]');
        if (!paginationNav) { console.warn("Paginação de usuários não encontrada."); return; }
        paginationNav.addEventListener('click', (event) => { const link = event.target.closest('.page-link'); if (!link || link.closest('.page-item').classList.contains('disabled') || link.closest('.page-item').classList.contains('active')) { event.preventDefault(); return; } event.preventDefault(); const targetPage = link.dataset.page; const totalItems = filteredUserList.length; const totalPages = Math.ceil(totalItems / itemsPerPage); let newPage = currentPage; if (targetPage === 'prev') { newPage = Math.max(1, currentPage - 1); } else if (targetPage === 'next') { newPage = Math.min(totalPages, currentPage + 1); } else { newPage = parseInt(targetPage); } if (newPage !== currentPage) { currentPage = newPage; console.log(`Nova página (Usuários): ${currentPage}`); populateUserTable(); } });
    };

    // ===================================================================
    // FUNÇÕES DE AÇÃO DO MODAL DE PERFIL (NOVO)
    // ===================================================================
    document.addEventListener('click', (event) => {
        // Escuta os botões de ação DENTRO do modal de perfil do usuário
        const modalBtn = event.target.closest('#modal-reset-pw-btn, #modal-toggle-status-btn');
        if (modalBtn) {
            const userId = modalBtn.dataset.userId;
            const action = modalBtn.dataset.action;
            const userIndex = simulatedUsers.findIndex(u => u.id == userId);
            if (userIndex === -1) return;
            const user = simulatedUsers[userIndex];

            // Reusa a lógica de confirmação e atualização da função principal
            if (action === 'reset_pw') {
                if (confirm(`Gerar nova senha para ${user.name}?`)) {
                    console.log(`[Modal] Senha resetada para ${user.name}.`);
                    alert(`(Simulação) Nova senha gerada.`);
                    handleUserSearchAndFilter(true); // Redesenha a tabela
                }
            } else if (action === 'toggle_status') {
                const newStatus = user.status === 'Ativo' ? 'Inativo' : 'Ativo';
                if (confirm(`${newStatus === 'Inativo' ? 'DESATIVAR' : 'ATIVAR'} conta de ${user.name}?`)) {
                    user.status = newStatus;
                    console.log(`[Modal] Status alterado para ${user.status}.`);
                    alert(`Conta ${newStatus === 'Inativo' ? 'desativada' : 'ativada'}.`);
                    handleUserSearchAndFilter(true); // Redesenha a tabela
                }
            }
        }
    });

    // ===================================================================
    // *** NOVAS FUNÇÕES PARA LOGS ***
    // ===================================================================
    const populateLogTable = () => {
        const tableBody = document.getElementById('log-table-body');
        if (!tableBody) { console.warn("Tabela #log-table-body não encontrada."); return; }
        tableBody.innerHTML = '';
        const startIndex = (currentLogPage - 1) * logsPerPage; const endIndex = startIndex + logsPerPage;
        const logsToDisplay = filteredLogList.slice(startIndex, endIndex); // Usa filteredLogList
        if (logsToDisplay.length === 0 && currentLogPage === 1) { tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum log encontrado com os filtros aplicados.</td></tr>'; renderLogPaginationControls(); return; }
        if (logsToDisplay.length === 0 && currentLogPage > 1) { tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Nenhum log nesta página (${currentLogPage}).</td></tr>`; renderLogPaginationControls(); return; }
        logsToDisplay.forEach(log => {
            const date = new Date(log.timestamp); const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const pointsClass = log.points.startsWith('+') ? 'text-success' : (log.points.startsWith('-') ? 'text-danger' : '');
            const row = `<tr><td>${formattedDate}</td><td>${log.user}</td><td>${log.action}</td><td>${log.details || '-'}</td><td class="${pointsClass}">${log.points}</td><td>${log.company || '-'}</td></tr>`;
            tableBody.innerHTML += row;
        });
        renderLogPaginationControls();
    };
    const renderLogPaginationControls = () => {
        const paginationNav = document.querySelector('.activity-logs-section nav[aria-label="Paginação de logs"]');
        if (!paginationNav) return;
        const totalItems = filteredLogList.length; const totalPages = Math.ceil(totalItems / logsPerPage);
        const paginationUl = paginationNav.querySelector('.pagination'); if (!paginationUl) return; paginationUl.innerHTML = '';
        if (totalPages <= 1) { paginationNav.style.display = 'none'; return; } paginationNav.style.display = 'flex';
        const prevLi = document.createElement('li'); prevLi.classList.add('page-item'); if (currentLogPage === 1) prevLi.classList.add('disabled'); prevLi.innerHTML = `<a class="page-link" href="#" data-page="prev">Anterior</a>`; paginationUl.appendChild(prevLi);
        for (let i = 1; i <= totalPages; i++) { const pageLi = document.createElement('li'); pageLi.classList.add('page-item'); if (i === currentLogPage) pageLi.classList.add('active'); pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`; paginationUl.appendChild(pageLi); }
        const nextLi = document.createElement('li'); nextLi.classList.add('page-item'); if (currentLogPage === totalPages) nextLi.classList.add('disabled'); nextLi.innerHTML = `<a class="page-link" href="#" data-page="next">Próximo</a>`; paginationUl.appendChild(nextLi);
    };
    const handleLogSearchAndFilter = (redrawOnly = false) => {
        const userInput = document.querySelector('.activity-logs-section input[placeholder*="Usuário"]');
        const companyInput = document.querySelector('.activity-logs-section input[placeholder*="Empresa"]');
        const startDateInput = document.querySelector('.activity-logs-section input[type="date"][placeholder="Data Início"]');
        const endDateInput = document.querySelector('.activity-logs-section input[type="date"][placeholder="Data Fim"]');
        const logTableBody = document.getElementById('log-table-body');
        if (!userInput || !companyInput || !startDateInput || !endDateInput || !logTableBody) { console.warn("Elementos de filtro/busca de logs ou tbody não encontrados."); return; }
        const applyFilters = () => {
            const userTerm = userInput.value.toLowerCase().trim(); const companyTerm = companyInput.value.toLowerCase().trim();
            const startDate = startDateInput.value ? new Date(startDateInput.value + 'T00:00:00') : null;
            const endDate = endDateInput.value ? new Date(endDateInput.value + 'T23:59:59') : null;
            console.log(`Filtrando logs: Usuário='${userTerm}', Empresa='${companyTerm}', Start='${startDate}', End='${endDate}'`);
            filteredLogList = simulatedLogs.filter(log => { // Atualiza filteredLogList (global para logs)
                const logDate = new Date(log.timestamp); if (isNaN(logDate)) return false;
                const userMatch = !userTerm || log.user.toLowerCase().includes(userTerm);
                const companyMatch = !companyTerm || (log.company && log.company.toLowerCase().includes(companyTerm));
                const startDateMatch = !startDate || isNaN(startDate) || logDate >= startDate;
                const endDateMatch = !endDate || isNaN(endDate) || logDate <= endDate;
                return userMatch && companyMatch && startDateMatch && endDateMatch;
            });
            console.log("Logs filtrados:", filteredLogList); currentLogPage = 1; populateLogTable();
        };
        if (!userInput.dataset.listenerAdded) {
            userInput.addEventListener('input', applyFilters); companyInput.addEventListener('input', applyFilters);
            startDateInput.addEventListener('change', applyFilters); endDateInput.addEventListener('change', applyFilters);
            userInput.dataset.listenerAdded = 'true';
        }
        if (redrawOnly) { console.log("Redesenhando tabela de logs com filtros atuais..."); applyFilters(); }
    };
    const handleLogPagination = () => {
        const paginationNav = document.querySelector('.activity-logs-section nav[aria-label="Paginação de logs"]');
        if (!paginationNav) { console.warn("Elemento de paginação de logs não encontrado."); return; }
        paginationNav.addEventListener('click', (event) => {
            const link = event.target.closest('.page-link'); if (!link || link.closest('.page-item').classList.contains('disabled') || link.closest('.page-item').classList.contains('active')) { event.preventDefault(); return; }
            event.preventDefault(); // *** PREVINE SCROLL ***
            const targetPage = link.dataset.page; const totalItems = filteredLogList.length; const totalPages = Math.ceil(totalItems / logsPerPage); let newPage = currentLogPage;
            if (targetPage === 'prev') { newPage = Math.max(1, currentLogPage - 1); } else if (targetPage === 'next') { newPage = Math.min(totalPages, currentLogPage + 1); } else { newPage = parseInt(targetPage); }
            if (newPage !== currentLogPage) { currentLogPage = newPage; console.log(`Logs - Nova página: ${currentLogPage}`); populateLogTable(); }
        });
    };
    // *** FIM FUNÇÕES PARA LOGS ***

    // ===================================================================
    // FUNÇÃO: GERENCIA O FORMULÁRIO "SISTEMA DE PONTOS" (ATUALIZADA)
    // ===================================================================
    const handlePointsSystemForm = () => {
        const form = document.getElementById('pointsSystemForm');
        if (!form) { console.warn("Formulário #pointsSystemForm não encontrado."); return; }

        // Seleciona TODOS os inputs
        const plasticoInput = document.getElementById('pointsKgPlastico');
        const papelInput = document.getElementById('pointsKgPapel');
        const vidroInput = document.getElementById('pointsKgVidro'); // <-- ADICIONADO
        const metalInput = document.getElementById('pointsKgMetal'); // <-- ADICIONADO
        const oleoInput = document.getElementById('pointsLtOleo'); // <-- ADICIONADO
        const eletronicoInput = document.getElementById('pointsUndEletronico'); // <-- ADICIONADO
        const newsletterInput = document.getElementById('pointsNewsletter');

        // --- Função para preencher o formulário com os valores atuais ---
        const populateForm = () => {
            if (plasticoInput) plasticoInput.value = currentSettings.pointsKgPlastico || 0;
            if (papelInput) papelInput.value = currentSettings.pointsKgPapel || 0;
            if (vidroInput) vidroInput.value = currentSettings.pointsKgVidro || 0; // <-- ADICIONADO
            if (metalInput) metalInput.value = currentSettings.pointsKgMetal || 0; // <-- ADICIONADO
            if (oleoInput) oleoInput.value = currentSettings.pointsLtOleo || 0; // <-- ADICIONADO
            if (eletronicoInput) eletronicoInput.value = currentSettings.pointsUndEletronico || 0; // <-- ADICIONADO
            if (newsletterInput) newsletterInput.value = currentSettings.pointsNewsletter || 0;
        };

        // --- Listener para salvar os valores ---
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Salvando configurações do sistema de pontos...");

            // Atualiza o objeto currentSettings
            currentSettings.pointsKgPlastico = parseInt(plasticoInput.value) || 0;
            currentSettings.pointsKgPapel = parseInt(papelInput.value) || 0;
            currentSettings.pointsKgVidro = parseInt(vidroInput.value) || 0; // <-- ADICIONADO
            currentSettings.pointsKgMetal = parseInt(metalInput.value) || 0; // <-- ADICIONADO
            currentSettings.pointsLtOleo = parseInt(oleoInput.value) || 0; // <-- ADICIONADO
            currentSettings.pointsUndEletronico = parseInt(eletronicoInput.value) || 0; // <-- ADICIONADO
            currentSettings.pointsNewsletter = parseInt(newsletterInput.value) || 0;

            // Salva no localStorage
            try {
                localStorage.setItem('ecoLogica_Settings', JSON.stringify(currentSettings));
                console.log("Configurações de pontos salvas:", currentSettings);
                alert("Valores de pontos atualizados com sucesso!");
            } catch (e) {
                console.error("Erro ao salvar configurações de pontos:", e);
                alert("Erro ao salvar as configurações.");
            }
        });

        // --- Listener para ajuste manual (código inalterado) ---
        const manualAdjustGroup = document.getElementById('manualAdjustGroup');

        if (manualAdjustGroup) {
            const emailInput = manualAdjustGroup.querySelector('input[type="email"]');
            const pointsInput = manualAdjustGroup.querySelector('input[type="number"]');
            const applyButton = manualAdjustGroup.querySelector('button');

            if (applyButton && emailInput && pointsInput) {
                applyButton.addEventListener('click', () => {
                    const email = emailInput.value.trim();
                    const points = parseInt(pointsInput.value);

                    if (!email || isNaN(points)) {
                        alert("Por favor, insira um email válido e a quantidade de pontos.");
                        return;
                    }

                    // Encontra o usuário
                    const userIndex = simulatedUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

                    if (userIndex === -1) {
                        alert(`Usuário com email "${email}" não encontrado.`);
                        return;
                    }

                    simulatedUsers[userIndex].points += points;
                    console.log(`(Ajuste Manual) Pontos de ${simulatedUsers[userIndex].name} atualizados para ${simulatedUsers[userIndex].points}.`);
                    alert(`Pontos de ${simulatedUsers[userIndex].name} ajustados para ${simulatedUsers[userIndex].points}.`);
                    handleUserSearchAndFilter(true); // Atualiza a tabela de usuários principal
                    emailInput.value = ''; // Limpa os campos
                    pointsInput.value = '';
                });
            }
        } else {
            console.warn("Elemento #manualAdjustGroup não encontrado."); // Avisa se o ID estiver faltando
        }

        // Preenche o formulário com os valores carregados inicialmente
        populateForm();
    };

    // ===================================================================
    // FUNÇÃO: GERENCIA O FORMULÁRIO "CONFIGURAÇÕES GERAIS"
    // ===================================================================
    const handleSiteSettingsForm = () => {
        const form = document.getElementById('siteSettingsForm');
        if (!form) { console.warn("Formulário #siteSettingsForm não encontrado."); return; }

        const telegramInput = document.getElementById('settingTelegramLink');
        const facebookInput = document.getElementById('settingFacebookLink');
        const instagramInput = document.getElementById('settingInstagramLink');
        const emailInput = document.getElementById('settingContactEmail');
        const phoneInput = document.getElementById('settingContactPhone');
        // Adicionar outros inputs de configuração aqui

        // --- Função para preencher o formulário ---
        const populateForm = () => {
            if (telegramInput) telegramInput.value = currentSettings.settingTelegramLink || '';
            if (facebookInput) facebookInput.value = currentSettings.settingFacebookLink || '';
            if (instagramInput) instagramInput.value = currentSettings.settingInstagramLink || '';
            if (emailInput) emailInput.value = currentSettings.settingContactEmail || '';
            if (phoneInput) phoneInput.value = currentSettings.settingContactPhone || '';
            // Preencher outros
        };

        // --- Listener para salvar ---
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Salvando configurações gerais...");

            // Atualiza o objeto currentSettings
            currentSettings.settingTelegramLink = telegramInput.value.trim();
            currentSettings.settingFacebookLink = facebookInput.value.trim();
            currentSettings.settingInstagramLink = instagramInput.value.trim();
            currentSettings.settingContactEmail = emailInput.value.trim();
            currentSettings.settingContactPhone = phoneInput.value.trim();
            // Atualizar outros

            // Salva no localStorage
            try {
                localStorage.setItem('ecoLogica_Settings', JSON.stringify(currentSettings));
                console.log("Configurações gerais salvas:", currentSettings);
                alert("Configurações gerais atualizadas com sucesso!");
                // ATENÇÃO: Para que links no rodapé (carregado via JS) sejam atualizados
                // seria necessário recarregar o rodapé ou ter uma lógica mais complexa
                // no main.js para ler essas configurações ao montar o rodapé.
            } catch (e) {
                console.error("Erro ao salvar configurações gerais:", e);
                alert("Erro ao salvar as configurações.");
            }
        });

        // Preenche o formulário inicialmente
        populateForm();
    };

    // ===================================================================
    // FUNÇÃO: GERENCIA O FORMULÁRIO "ADICIONAR/EDITAR CAMPANHA"
    // ===================================================================
    const handleCampaignForm = () => {
        // ... (seu código existente, sem alterações) ...
        const form = document.getElementById('addCampaignForm');
        const campaignListDiv = document.getElementById('current-campaigns-list');
        if (!form || !campaignListDiv) { console.warn("Form/lista de campanha não encontrados."); return; }
        const renderCampaignList = () => { campaignListDiv.innerHTML = ''; if (simulatedCampaigns.length === 0) { campaignListDiv.innerHTML = '<p class="text-muted small ms-2">Nenhuma campanha cadastrada.</p>'; return; } simulatedCampaigns.forEach(campaign => { const listItem = `<a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" data-campaign-id="${campaign.id}">${campaign.title}<div><span class="badge bg-secondary rounded-pill me-1" data-action="edit"><i class="fas fa-pencil-alt fa-xs"></i></span><span class="badge bg-danger rounded-pill" data-action="delete"><i class="fas fa-trash-alt fa-xs"></i></span></div></a>`; campaignListDiv.innerHTML += listItem; }); };
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Formulário de campanha submetido.");

            // Coleta os dados
            const campaignData = {
                // ... (coleta de dados) ...
                id: null,
                title: document.getElementById('campaignTitle').value.trim(),
                // ... (resto dos campos) ...
                startDate: document.getElementById('campaignStartDate').value,
                endDate: document.getElementById('campaignEndDate').value,
                description: document.getElementById('campaignDescription').value.trim(),
                image: document.getElementById('campaignImage').value.trim(),
                points: parseInt(document.getElementById('campaignPoints').value) || null
            };

            // Validação e Simulação
            if (!campaignData.title || !campaignData.description) {
                alert("Título e Descrição são obrigatórios.");
                return;
            }

            // 1. Adiciona a campanha ao array simulado
            campaignData.id = nextCampaignId++;
            simulatedCampaigns.push(campaignData);

            // 2. SALVA NO LOCALSTORAGE para que campanhas.html possa ler
            try {
                localStorage.setItem('ecoLogica_Campaigns', JSON.stringify(simulatedCampaigns));
                console.log("Campanhas salvas no localStorage.");
            } catch (e) {
                console.error("Erro ao salvar no localStorage:", e);
            }

            // Limpa o formulário e atualiza a lista
            form.reset();
            renderCampaignList();

            alert("Campanha adicionada com sucesso!");

        });

        // --- Listener para cliques na lista (editar/excluir - delegação) ---
        campaignListDiv.addEventListener('click', (event) => {
            const actionBadge = event.target.closest('.badge[data-action]');
            if (!actionBadge) return;
            event.preventDefault();

            const listItem = actionBadge.closest('.list-group-item');
            if (!listItem) return;
            const campaignId = listItem.dataset.campaignId;
            const action = actionBadge.dataset.action;
            const campaign = simulatedCampaigns.find(c => c.id == campaignId);

            if (!campaign) return;

            if (action === 'edit') {
                // ... (código de edição, sem alterações) ...
                console.log(`Editando: ${campaign.title}`);
                document.getElementById('campaignTitle').value = campaign.title;
                document.getElementById('campaignStartDate').value = campaign.startDate || '';
                document.getElementById('campaignEndDate').value = campaign.endDate || '';
                document.getElementById('campaignDescription').value = campaign.description;
                document.getElementById('campaignImage').value = campaign.image || '';
                document.getElementById('campaignPoints').value = campaign.points || '';
                const campaignSection = form.closest('.add-campaign-section');
                if (campaignSection) { campaignSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                else { form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

            } else if (action === 'delete') {
                if (confirm(`Tem certeza que deseja excluir a campanha "${campaign.title}"?`)) {
                    console.log(`(Simulação) Excluindo campanha ID ${campaignId}`);

                    // 1. Filtra o array, removendo a campanha
                    simulatedCampaigns = simulatedCampaigns.filter(c => c.id != campaignId);

                    // *** 2. ATUALIZA O LOCALSTORAGE (ESSENCIAL!) ***
                    try {
                        localStorage.setItem('ecoLogica_Campaigns', JSON.stringify(simulatedCampaigns));
                        console.log("Campanhas atualizadas no localStorage após exclusão.");
                    } catch (e) {
                        console.error("Erro ao salvar no localStorage após exclusão:", e);
                    }
                    // *** FIM DA ATUALIZAÇÃO ***

                    // 3. Re-renderiza a lista na página de admin
                    renderCampaignList();
                    alert("Campanha excluída com sucesso!"); // Feedback opcional
                }
            }
        });
        renderCampaignList();
    };

    // ===================================================================
    // FUNÇÃO: RENDERIZA LISTAS DE EMPRESAS (Atualizada com Ação de Edição)
    // ===================================================================
    const renderCompanyList = (listElementSelector, companyArray) => {
        const listElement = document.querySelector(listElementSelector);
        if (!listElement) {
            console.warn(`Elemento da lista de empresas não encontrado: ${listElementSelector}`);
            return;
        }
        listElement.innerHTML = ''; // Limpa a lista

        if (companyArray.length === 0) {
            listElement.innerHTML = '<li class="list-group-item text-muted small">Nenhuma empresa cadastrada.</li>';
            return;
        }

        companyArray.forEach(company => {
            const listItem = `
            <a href="#" class="list-group-item list-group-item-action py-1 px-2 d-flex justify-content-between align-items-center" data-company-id="${company.id}" data-company-type="${company.type}">
                ${company.name}
                <span class="badge bg-secondary rounded-pill" data-action="edit" title="Editar"><i class="fas fa-pencil-alt fa-xs"></i></span>
            </a>`;
            listElement.innerHTML += listItem;
        });

        // Adiciona listener de clique para a lista (se ainda não tiver)
        // Usamos um handler separado para evitar duplicidade
        if (!listElement.dataset.listenerAdded) {
            listElement.addEventListener('click', handleCompanyListClick);
            listElement.dataset.listenerAdded = 'true';
        }
    };



    // Seletores específicos para as listas no HTML
    const recyclerListSelector = '#recycler-company-list';
    const supporterListSelector = '#supporter-company-list';
    // *** FIM NOVAS FUNÇÕES ***

    // ===================================================================
    // *** NOVO: Handler de Clique para Listas de Empresas (CORRIGIDO) ***
    // ===================================================================
    const handleCompanyListClick = (event) => {
        // 1. Encontra o link <a> pai que foi clicado
        const listItem = event.target.closest('a.list-group-item');

        // Se o clique não foi em um item da lista, não faz nada
        if (!listItem) return;

        // 2. PREVINE O SCROLL (AÇÃO PADRÃO DO LINK '#') IMEDIATAMENTE
        event.preventDefault();

        // 3. Agora, verifica se o clique foi especificamente no badge de ação
        const actionBadge = event.target.closest('.badge[data-action]');

        // 4. Se o clique foi no badge (edição)
        if (actionBadge) {
            const companyId = listItem.dataset.companyId;
            const companyType = listItem.dataset.companyType;
            const action = actionBadge.dataset.action;

            // Encontra a empresa no array correto
            let company;
            if (companyType === 'recicladora') {
                company = simulatedRecyclers.find(c => c.id == companyId);
            } else {
                company = simulatedSupporters.find(c => c.id == companyId);
            }

            if (!company) {
                console.error("Empresa não encontrada para edição.");
                return;
            }

            if (action === 'edit') {
                console.log("Modo de Edição:", company);

                // Pega os elementos do formulário
                const form = document.getElementById('addCompanyForm');
                const h3 = form.closest('.add-company-section').querySelector('h3');
                const submitButton = form.querySelector('button[type="submit"]');

                // Preenche o formulário
                document.getElementById('companyName').value = company.name;
                document.getElementById('companyEmail').value = company.email;
                document.getElementById('companyType').value = company.type;
                document.getElementById('companyCNPJ').value = company.cnpj || '';
                document.getElementById('companyAddress').value = company.address || '';

                // Armazena o ID da empresa que está sendo editada
                form.dataset.editingId = company.id;

                // Altera a UI do formulário para "Modo Edição"
                h3.textContent = "Editar Empresa";
                submitButton.textContent = "Salvar Alterações";
                submitButton.classList.remove('btn-success');
                submitButton.classList.add('btn-primary');

                // Desabilita a troca de tipo
                document.getElementById('companyType').disabled = true;

                // Rola até o formulário
                form.closest('.add-company-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // 5. Se o clique foi no nome (não no badge), o scroll já foi prevenido
            // e nenhuma outra ação é necessária.
            console.log("Clicou no nome da empresa, scroll prevenido.");
        }
    };

    // ===================================================================
    // *** NOVO: Helper para Resetar Formulário da Empresa ***
    // ===================================================================
    const resetCompanyForm = () => {
        const form = document.getElementById('addCompanyForm');
        if (!form) return;

        const h3 = form.closest('.add-company-section').querySelector('h3');
        const submitButton = form.querySelector('button[type="submit"]');

        form.reset(); // Limpa os campos
        delete form.dataset.editingId; // Remove o ID de edição

        // Restaura a UI do formulário para "Modo Cadastro"
        h3.textContent = "Cadastrar Nova Empresa";
        submitButton.textContent = "Cadastrar Empresa";
        submitButton.classList.remove('btn-primary'); // Remove cor azul
        submitButton.classList.add('btn-success'); // Adiciona cor verde

        // Habilita a troca de tipo
        document.getElementById('companyType').disabled = false;
    };

    // ===================================================================
    // FUNÇÃO: GERENCIA FORMULÁRIO "CADASTRAR/EDITAR EMPRESA" (Atualizada)
    // ===================================================================
    const handleAddCompanyForm = () => {
        const form = document.getElementById('addCompanyForm');
        if (!form) { console.warn("Formulário #addCompanyForm não encontrado."); return; }

        const nameInput = document.getElementById('companyName');
        const emailInput = document.getElementById('companyEmail');
        const typeSelect = document.getElementById('companyType');
        const cnpjInput = document.getElementById('companyCNPJ');
        const addressInput = document.getElementById('companyAddress');

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Verifica se está em modo de edição
            const editingId = form.dataset.editingId ? parseInt(form.dataset.editingId) : null;

            // Coleta os dados
            const companyData = {
                id: editingId || nextCompanyId, // Usa ID existente ou o próximo ID
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                type: typeSelect.value, // Tipo (mesmo desabilitado, o valor é lido)
                cnpj: cnpjInput.value.trim(),
                address: addressInput.value.trim()
            };

            // Validação básica
            if (!companyData.name || !companyData.email || !companyData.type) {
                alert("Nome, Email e Tipo são obrigatórios.");
                return;
            }

            try {
                if (editingId) {
                    // --- MODO DE EDIÇÃO ---
                    console.log("Salvando edições para ID:", editingId);
                    let arrayToUpdate, index;
                    if (companyData.type === 'recicladora') {
                        arrayToUpdate = simulatedRecyclers;
                        index = arrayToUpdate.findIndex(c => c.id === editingId);
                    } else {
                        arrayToUpdate = simulatedSupporters;
                        index = arrayToUpdate.findIndex(c => c.id === editingId);
                    }

                    if (index > -1) {
                        arrayToUpdate[index] = companyData; // Atualiza o objeto no array
                    } else {
                        throw new Error("ID da empresa para edição não encontrado nos arrays.");
                    }

                } else {
                    // --- MODO DE CRIAÇÃO ---
                    console.log("Cadastrando nova empresa:", companyData);
                    if (companyData.type === 'recicladora') {
                        simulatedRecyclers.push(companyData);
                    } else if (companyData.type === 'apoiadora') {
                        simulatedSupporters.push(companyData);
                    }
                    nextCompanyId++; // Incrementa o ID apenas na criação
                }

                // Salva AMBOS os arrays atualizados no localStorage
                localStorage.setItem('ecoLogica_Recyclers', JSON.stringify(simulatedRecyclers));
                localStorage.setItem('ecoLogica_Supporters', JSON.stringify(simulatedSupporters));
                console.log("Listas de empresas salvas no localStorage.");

                // Atualiza a lista visual correspondente
                if (companyData.type === 'recicladora') {
                    renderCompanyList(recyclerListSelector, simulatedRecyclers);
                } else {
                    renderCompanyList(supporterListSelector, simulatedSupporters);
                }

                resetCompanyForm(); // Reseta o formulário para o modo "Cadastrar"
                alert(`Empresa ${editingId ? 'atualizada' : 'cadastrada'} com sucesso!`);

            } catch (e) {
                console.error("Erro ao salvar empresa:", e);
                alert("Erro ao salvar a empresa.");
            }
        });
    };

    // *** FIM NOVA FUNÇÃO ***



    // Atualiza a lista lateral de pontos de coleta (HTML)
    const renderPointsList = () => {
        const listElement = document.querySelector('.collection-points-management-section .list-group-flush');
        if (!listElement) return;

        listElement.innerHTML = ''; // Limpa

        simulatedCollectionPoints.forEach(point => {
            const itemClass = point.isActive ? '' : 'text-muted'; // Ponto inativo fica cinza
            const listItem = `
<a href="#" class="list-group-item list-group-item-action py-1 px-2 d-flex justify-content-between align-items-center ${itemClass}" 
   data-point-id="${point.id}">
    ${point.name}
    <span>
        <span class="badge bg-secondary rounded-pill me-1" data-action="edit-point" title="Editar Ponto"><i class="fas fa-pencil-alt fa-xs"></i></span>
        <span class="badge bg-danger rounded-pill" data-action="delete-point" title="Excluir Ponto"><i class="fas fa-trash-alt fa-xs"></i></span> 
    </span>
</a>`;
            listElement.innerHTML += listItem;
        });
    };

    // *** NOVO: Handler de Clique para Listas de Pontos de Coleta ***
    const handlePointsListClick = (event) => {
        const listItem = event.target.closest('a.list-group-item');
        const actionBadge = event.target.closest('.badge[data-action]');

        if (!listItem || !actionBadge) return;
        event.preventDefault(); // Evita o scroll (do link #)

        const pointId = parseInt(listItem.dataset.pointId);
        const pointIndex = simulatedCollectionPoints.findIndex(p => p.id === pointId);
        const point = simulatedCollectionPoints[pointIndex];

        if (!point) return;

        if (actionBadge.dataset.action === 'edit-point') {

            // 1. Prepara o formulário do Modal
            document.getElementById('pointFormTitle').textContent = "Editar Ponto de Coleta";
            document.getElementById('savePointButton').textContent = "Salvar Alterações";

            // 2. Preenche os campos
            document.getElementById('pointId').value = point.id; // Campo escondido para ID
            document.getElementById('pointName').value = point.name;
            document.getElementById('pointLat').value = point.lat;
            document.getElementById('pointLng').value = point.lng;
            document.getElementById('pointType').value = point.type;
            document.getElementById('pointIsActive').checked = point.isActive;

            // 3. Exibe o formulário (se estiver escondido por padrão)
            document.getElementById('pointDetailsFormContainer').style.display = 'block';

            // 4. Abre o Modal
            const mapEditorModal = new bootstrap.Modal(document.getElementById('mapEditorModal'));
            mapEditorModal.show();

            // 5. Após abrir, centraliza o mapa no ponto (no listener 'shown.bs.modal')

        } else if (actionBadge.dataset.action === 'delete-point') {
            if (confirm(`Tem certeza que deseja DELETAR o ponto de coleta "${point.name}"?`)) {
                // Lógica de exclusão:
                simulatedCollectionPoints.splice(pointIndex, 1);
                saveCollectionPoints(); // Salva no localStorage (Função já existente)
                renderPointsList();     // Atualiza a lista lateral
                alert("Ponto excluído com sucesso!");

                // Se o mapa estiver aberto, precisa atualizar ele também
                if (fullMapInstance) {
                    renderCollectionPointsOnFullMap();
                }
            }
        }
    };
    // *** FIM handlePointsListClick ***

    // Listener para o botão "Abrir Editor de Mapa"
    const handleMapEditorButton = () => {
        const button = document.querySelector('.collection-points-management-section .btn-info');
        if (button) {
            // Remove a chamada de alerta e conecta ao modal
            button.dataset.bsToggle = "modal";
            button.dataset.bsTarget = "#mapEditorModal";
        }
    };
    // *** FIM NOVA FUNÇÃO ***

    const initFullMapEditor = () => {
        const mapContainerId = 'full-map-container';
        const formContainer = document.getElementById('pointDetailsFormContainer');
        const pointLatInput = document.getElementById('pointLat');
        const pointLngInput = document.getElementById('pointLng');
        const pointNameInput = document.getElementById('pointName');

        if (typeof L === 'undefined' || typeof L.Control.Geocoder === 'undefined') {
            console.error("Leaflet ou o Geocoder não estão carregados.");
            return;
        }

        if (!fullMapInstance) {
            fullMapInstance = L.map(mapContainerId, {
                scrollWheelZoom: true,
                zoomControl: true,
            }).setView([-26.918, -49.075], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(fullMapInstance);

            renderCollectionPointsOnFullMap();

            // *** INTEGRAÇÃO REAL DO GEOCODER ***
            const geocoder = L.Control.Geocoder.nominatim();

            L.Control.geocoder({
                query: "Blumenau, SC",
                placeholder: "Digite o endereço completo aqui...",
                defaultMarkGeocode: false,
                geocoder: geocoder
            })
                .on('markgeocode', function (e) {
                    const latlng = e.geocode.center;

                    // 1. Remove o marcador temporário anterior, se existir
                    if (tempNewMarker) {
                        fullMapInstance.removeLayer(tempNewMarker);
                    }

                    // 2. Cria o novo marcador temporário e preenche o formulário
                    tempNewMarker = L.marker(latlng, { draggable: true }).addTo(fullMapInstance)
                        .bindPopup(`Local encontrado: ${e.geocode.name}`).openPopup();

                    // 3. Centraliza e preenche campos
                    fullMapInstance.setView(latlng, 17);
                    pointLatInput.value = latlng.lat;
                    pointLngInput.value = latlng.lng;
                    pointNameInput.value = e.geocode.name;

                    // 4. Configura o arrasto para atualização das coordenadas
                    tempNewMarker.on('dragend', function (e) {
                        const newLatlng = e.target.getLatLng();
                        pointLatInput.value = newLatlng.lat;
                        pointLngInput.value = newLatlng.lng;
                        e.target.openPopup();
                    });

                    // 5. Exibe o formulário de detalhes
                    formContainer.style.display = 'block';
                    formContainer.scrollIntoView({ behavior: 'smooth' });

                }).addTo(fullMapInstance);
            // *************************************************************

        } else {
            fullMapInstance.invalidateSize();
            renderCollectionPointsOnFullMap();
        }
    };

    // Função helper para listar pontos no modal E RENDERIZAR MARCADORES NO MAPA GRANDE
    const renderCollectionPointsOnFullMap = () => {
        if (!fullMapInstance) return;

        // 1. LIMPA OS MARCADORES ANTERIORES NO MAPA GRANDE
        fullMapInstance.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                fullMapInstance.removeLayer(layer);
            }
        });

        const listContainer = document.querySelector('#mapEditorModal .modal-points-list-scrollable');
        if (listContainer) listContainer.innerHTML = ''; // Limpa a lista

        simulatedCollectionPoints.forEach(point => {
            const statusColor = point.isActive ? '#488f58' : '#e74c3c';

            // --- ADICIONA MARCADOR AO MAPA GRANDE ---
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<i class="fas fa-map-marker-alt" style="color: ${statusColor}; font-size: 24px;"></i>`,
                iconSize: [24, 41],
                iconAnchor: [12, 41]
            });

            const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(fullMapInstance);

            // Adicionar pop-up se desejar
            marker.bindPopup(`<b>${point.name}</b><br>Status: ${point.isActive ? 'Ativo' : 'Inativo'}`);
            // FIM ADICIONA MARCADOR AO MAPA GRANDE

            // Renderizar o item na lista lateral do modal
            if (listContainer) {
                listContainer.innerHTML += `
                <a href="#" class="list-group-item list-group-item-action list-group-item-sm d-flex justify-content-between align-items-center">
                    ${point.name} 
                    <span style="color:${statusColor}"><i class="fas fa-edit me-1"></i></span>
                </a>
            `;
            }
        });
    };



    /**
     * Renderiza os pontos de coleta (simulados) no mapa pequeno (mini-mapa).
     * AGORA USANDO OS ÍCONES CUSTOMIZADOS DO MAPA GRANDE.
     * @param {L.Map} targetMapInstance - A instância do mapa onde os pontos serão renderizados.
     */
    const renderCollectionPointsOnMiniMap = (targetMapInstance) => {
        if (typeof L === 'undefined' || !targetMapInstance) return;

        // Limpa marcadores existentes
        targetMapInstance.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                targetMapInstance.removeLayer(layer);
            }
        });

        simulatedCollectionPoints.forEach(point => {
            // Lógica de Ícone Customizado: (Copiada do renderCollectionPointsOnFullMap)
            const statusColor = point.isActive ? '#488f58' : '#e74c3c';

            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<i class="fas fa-map-marker-alt" style="color: ${statusColor}; font-size: 24px;"></i>`,
                iconSize: [24, 41],
                iconAnchor: [12, 41]
            });
            // Fim da Lógica de Ícone Customizado

            L.marker([point.lat, point.lng], { icon: customIcon }) // Usa o ícone customizado
                .addTo(targetMapInstance)
                .bindPopup(`<b>${point.name}</b>`);
        });
    };

    // ===================================================================
    // INICIALIZAÇÃO DOS MAPAS (Lado direito e Modal)
    // ===================================================================

    const initAdminMaps = () => {
        if (typeof L === 'undefined') {
            console.error("Leaflet não carregado.");
            return;
        }

        const miniMapDiv = document.getElementById('mini-map-placeholder');

        if (miniMapDiv) {
            // CORREÇÃO ESSENCIAL: Destruir a instância anterior, se existir
            if (miniMapInstance) {
                miniMapInstance.remove();
                miniMapInstance = null;
            }

            // 1. Recria o container (limpa o HTML e garante que o mapa será novo)
            miniMapDiv.innerHTML = "";

            // 2. Cria uma nova instância e a armazena
            miniMapInstance = L.map(miniMapDiv, {
                zoomControl: false,
                attributionControl: false
            }).setView([-26.9179, -49.0740], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMapInstance);

            // 3. Renderiza os pontos no mini-mapa
            renderCollectionPointsOnMiniMap(miniMapInstance);

            // Ajusta o zoom para caber todos os pontos
            if (simulatedCollectionPoints.length > 0) {
                const bounds = new L.LatLngBounds(simulatedCollectionPoints.map(p => [p.lat, p.lng]));
                miniMapInstance.fitBounds(bounds, { padding: [5, 5] });
            }

            // 4. Força o redimensionamento imediatamente (Embora esteja visível, garante o redraw)
            miniMapInstance.invalidateSize();


        } else {
            console.warn("Div #mini-map-placeholder não encontrada.");
        }
    };

    // ===================================================================
    // *** NOVO: Handler para o Modal do Editor de Mapas ***
    // ===================================================================

    const handleMapEditorModal = () => {
        const mapEditorModal = document.getElementById('mapEditorModal');

        if (mapEditorModal) {
            // Usa o evento que dispara APÓS o modal estar visível
            mapEditorModal.addEventListener('shown.bs.modal', () => {
                console.log("Modal de Editor de Mapas totalmente visível. Inicializando/Redimensionando mapa...");

                // 1. Chama a função que cria/atualiza o mapa
                initFullMapEditor();

                // 2. ESSENCIAL: Garante o redimensionamento forçado se a instância existir
                if (fullMapInstance) {
                    fullMapInstance.invalidateSize();
                    console.log("Leaflet invalidateSize() chamado.");
                }
            });
        }
    };









    // ===================================================================
    // CHAMADAS DE INICIALIZAÇÃO (Atualizado com Logs)
    // ===================================================================

    handleAdminProfileModal();
    initAdminCharts();

    // Usuários
    populateUserTable(); // Popula usuários (página 1 de todos)
    handleUserSearchAndFilter(); // Configura filtros/busca/ações de usuários
    handlePagination(); // Configura paginação de usuários

    // Logs
    populateLogTable(); // Popula logs (página 1 de todos)
    handleLogSearchAndFilter(); // Configura filtros de logs
    handleLogPagination(); // Configura paginação de logs

    // Campanhas
    handleCampaignForm();

    // Configurações Sidebar
    handlePointsSystemForm();
    handleSiteSettingsForm();

    // Empresas
    handleAddCompanyForm();
    renderCompanyList(recyclerListSelector, simulatedRecyclers);
    renderCompanyList(supporterListSelector, simulatedSupporters);

    // Pontos de Coleta
    renderPointsList();
    handleMapEditorButton();

    // *** NOVO: Anexar o Listener para Ações na Lista Lateral ***
    document.querySelector('.collection-points-management-section .list-group-flush')
        .addEventListener('click', handlePointsListClick);
    // *** FIM NOVO ***


    // Chama a inicialização dos mapas
    initAdminMaps();
    handleMapEditorModal();
    handleMapEditorActions();


    // Chamar outras funções de inicialização aqui

}); // Fim do DOMContentLoaded