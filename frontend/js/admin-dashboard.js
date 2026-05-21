/**
 * @file admin-dashboard.js
 * Versão Conectada ao Backend Spring Boot
 */

// ===================================================================
// VARIÁVEIS GLOBAIS (Agora iniciam vazias esperando o Backend)
// ===================================================================

// Usuários
let simulatedUsers = []; 
let filteredUserList = [];
let currentUserIdCounter = 0; // Será atualizado com base no maior ID vindo do banco
let currentPage = 1;
const itemsPerPage = 5;

// Empresas
let simulatedRecyclers = [];
let simulatedSupporters = [];
let nextCompanyId = 0;

// Logs e Campanhas (Mantidos híbridos para evitar erros se o backend não tiver esses endpoints ainda)
let simulatedLogs = [];
let filteredLogList = [];
let currentLogPage = 1;
const logsPerPage = 5;

let simulatedCampaigns = [];
let nextCampaignId = 1;

// Configurações e Perfil
let currentSettings = {};
const defaultAdminProfile = {
    name: "Administrador",
    email: "admin@ecologica.com",
    avatar: "img/avatar/avatar-adm.png",
    memberSince: "20/09/2025"
};
let currentAdminProfile = JSON.parse(localStorage.getItem('ecoLogica_AdminProfile')) || defaultAdminProfile;

// Mapas
let miniMapInstance = null;
let fullMapInstance = null;
let simulatedCollectionPoints = []; // Será carregado se houver endpoint, ou localStorage
let tempNewMarker = null;
let collectionPointMarkers = [];
let materialTypes = [];
let rewards = [];
let rewardImageDataUrl = '';

// ===================================================================
// INICIALIZAÇÃO (DOMContentLoaded)
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    const session = requireLogin();
    if (!session) return;
    if (session.role !== 'admin') {
        redirectByRole(session.role);
        return;
    }
    console.log("admin-dashboard.js: Iniciando conexão com Backend...");

    // 1. Carregar Perfil Visual (Admin)
    loadAdminProfileUI();

    // 2. BUSCAR DADOS REAIS DO BACKEND
    loadDashboardData();

    // 3. Inicializar Componentes de UI (que não dependem de dados imediatos)
    handleAdminProfileModal();
    
    // Configurações de Formulários
    handleUserForm();           // Cadastro de Usuários
    handleUserSearchAndFilter();
    handlePagination();
    handleAddCompanyForm();     // Cadastro de Empresas
    handleCampaignForm();       // Campanhas (LocalStorage/Híbrido)
    handleLogForm();            // Logs (LocalStorage/Híbrido)
    
    // Outros ajustes
    setupCNPJMasks();
    setupPhoneMasks();
    setupExportButtons();
    
    // Configurações Gerais
    loadSettings();
    handlePointsSystemForm();
    handleSiteSettingsForm();
    handleAnnouncementForm();
    handleAdBannerForm();
    
    // Mapas
    initAdminMaps();
    handleMapEditorModal();
    handleMapEditorActions();
    
    // Listeners Globais
    handleViewAllCompaniesModal();
    document.querySelector('.collection-points-management-section .list-group-flush')
        .addEventListener('click', handlePointsListClick);
    document.querySelector('#mapEditorModal .modal-points-list-scrollable')
        .addEventListener('click', handleModalPointEdit);

    // Recompensas
    renderRewardsList(); 
    handleRewardManager();
});

// ===================================================================
// FUNÇÃO MESTRA: CARREGAR DADOS DA API
// ===================================================================
async function loadDashboardData() {
    try {
        // --- 1. BUSCAR USUÁRIOS ---
        // Espera-se que o endpoint GET /usuarios retorne lista de DTOs
        const usersData = await apiFetch('/usuarios'); 
        
        if (usersData && Array.isArray(usersData)) {
            // Mapeia do formato JAVA (nome, tipoUsuario) para o formato JS (name, status, role)
            simulatedUsers = usersData.map(u => ({
                id: u.id || u.idUsuario,
                name: u.nome,
                cpf: u.cpf,
                email: u.email,
                points: u.pontos || 0,
                rawStatus: u.status,
                status: u.status === 'ATIVO' ? 'Ativo' : 'Inativo',
                role: u.tipoUsuario
            }));

            // Atualiza contadores e listas
            filteredUserList = [...simulatedUsers];
            if (simulatedUsers.length > 0) {
                currentUserIdCounter = Math.max(...simulatedUsers.map(u => u.id)) + 1;
            }
            
            // Atualiza a tabela na tela
            populateUserTable();
        }

        // --- 2. BUSCAR EMPRESAS ---
        // Se você tiver endpoints separados, ótimo. Se não, filtramos dos usuários.
        // Tentativa de buscar endpoints específicos:
        try {
            const recicladoras = await apiFetch('/empresas-recicladoras');
            if (recicladoras) {
                simulatedRecyclers = recicladoras.map(r => ({
                    id: r.id,
                    name: r.nomeEmpresa || r.nome,
                    email: r.email,
                    cnpj: r.cnpj,
                    address: r.endereco,
                    phone: r.telefone,
                    rawStatus: r.status || 'PENDENTE',
                    status: r.status === 'ATIVO' ? 'Ativa' : r.status === 'SUSPENSO' ? 'Inativa' : 'Pendente',
                    type: 'recicladora'
                }));
            }
        } catch (e) { console.log("Endpoint de recicladoras não disponível ou vazio, tentando filtrar de usuários..."); }

        try {
            const apoiadoras = await apiFetch('/empresas-apoiadoras');
            if (apoiadoras) {
                simulatedSupporters = apoiadoras.map(a => ({
                    id: a.id,
                    name: a.nomeEmpresa || a.nome,
                    email: a.email,
                    cnpj: a.cnpj,
                    address: a.endereco,
                    phone: a.telefone,
                    rawStatus: a.status || 'PENDENTE',
                    status: a.status === 'ATIVO' ? 'Ativa' : a.status === 'SUSPENSO' ? 'Inativa' : 'Pendente',
                    type: 'apoiadora'
                }));
            }
        } catch (e) { console.log("Endpoint de apoiadoras não disponível."); }

        // Atualiza Listas de Empresas na tela
        renderCompanyList('#recycler-company-list', simulatedRecyclers);
        renderCompanyList('#supporter-company-list', simulatedSupporters);
        renderCompanyTables();
        populateCompanySelects();

        try {
            simulatedCampaigns = await apiFetch('/campanhas');
            renderCampaignsList();
        } catch (error) {
            console.warn('Nao foi possivel carregar campanhas.', error);
        }

        try {
            materialTypes = await apiFetch('/tipos-materiais', 'GET', null, { skipAuth: true });
            renderMaterialTypeCheckboxes();
            renderMaterialTypesList();
        } catch (error) {
            console.warn('Nao foi possivel carregar tipos de materiais.', error);
        }

        try {
            simulatedCollectionPoints = await apiFetch('/locais-coleta', 'GET', null, { skipAuth: true });
            renderCollectionPoints();
        } catch (error) {
            console.warn('Nao foi possivel carregar pontos de coleta.', error);
        }

        await renderRewardsListBackend();
        await loadActiveAnnouncementPreview();

        // --- 3. ATUALIZAR GRÁFICOS COM DADOS REAIS ---
        initAdminCharts();

        console.log("Dados do Dashboard atualizados com sucesso!");

    } catch (error) {
        console.error("Erro crítico ao carregar dados do dashboard:", error);
        // Não mostramos alert para não travar a navegação, mas logamos o erro
    }
}

// ===================================================================
// GERENCIAMENTO DE USUÁRIOS (Conectado)
// ===================================================================
const populateUserTable = () => {
    const tableBody = document.getElementById('user-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Paginação
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const usersToDisplay = filteredUserList.slice(startIndex, endIndex);

    if (usersToDisplay.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum dado encontrado.</td></tr>';
        renderPaginationControls();
        return;
    }

    usersToDisplay.forEach(user => {
        const statusBadgeClass = user.status === 'Ativo' ? 'bg-success' : 'bg-danger';
        const row = `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.points}</td>
            <td><span class="badge ${statusBadgeClass}">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary action-btn" data-user-id="${user.id}" data-action="view" title="Ver Perfil" data-bs-toggle="modal" data-bs-target="#userProfileModal"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-outline-secondary action-btn" data-user-id="${user.id}" data-action="edit-data" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn btn-sm btn-outline-danger action-btn" data-user-id="${user.id}" data-action="toggle_status" title="Ativar/Desativar"><i class="fas fa-power-off"></i></button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    tableBody.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', async () => {
            const user = simulatedUsers.find(item => String(item.id) === String(button.dataset.userId));
            if (!user) return;

            if (button.dataset.action === 'edit-data') {
                document.getElementById('userEditId').value = user.id;
                document.getElementById('userModalTitle').textContent = 'Editar Usuario';
                document.getElementById('userNameInput').value = user.name;
                document.getElementById('userEmailInput').value = user.email;
                document.getElementById('userCpfInput').value = user.cpf || '';
                document.getElementById('userPasswordInput').value = '';
                document.getElementById('userInitialPoints').value = user.points || 0;
                document.getElementById('userInitialPoints').disabled = true;
                document.getElementById('userStatusSelect').value = user.status;
                new bootstrap.Modal(document.getElementById('addEditUserModal')).show();
                return;
            }

            if (button.dataset.action === 'view') {
                fillUserProfileModal(user);
                return;
            }

            if (button.dataset.action === 'toggle_status') {
                await toggleUserStatus(user);
            }
        });
    });
    renderPaginationControls();
};

const fillUserProfileModal = (user) => {
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value ?? '--';
    };

    setText('modal-user-name', user.name);
    setText('modal-user-status', user.status);
    setText('modal-user-id', user.id);
    setText('modal-user-email', user.email);
    setText('modal-user-points', user.points || 0);

    const toggleButton = document.getElementById('modal-toggle-status-btn');
    if (toggleButton) {
        toggleButton.dataset.userId = user.id;
        toggleButton.innerHTML = user.status === 'Ativo'
            ? '<i class="fas fa-user-slash me-1"></i> Desativar Conta'
            : '<i class="fas fa-user-check me-1"></i> Ativar Conta';
    }
};

const toggleUserStatus = async (user) => {
    const novoStatus = user.status === 'Ativo' ? 'SUSPENSO' : 'ATIVO';
    await apiFetch(`/usuarios/${user.id}`, 'PUT', { status: novoStatus });
    await loadDashboardData();
};

const handleUserForm = () => {
    const form = document.getElementById('addEditUserForm');
    const modalElement = document.getElementById('addEditUserModal');
    const btnOpenAdd = document.getElementById('btnOpenAddUser');

    if (!form || !modalElement) return;

    const modalToggleButton = document.getElementById('modal-toggle-status-btn');
    if (modalToggleButton && !modalToggleButton.dataset.listenerAdded) {
        modalToggleButton.addEventListener('click', async () => {
            const user = simulatedUsers.find(item => String(item.id) === String(modalToggleButton.dataset.userId));
            if (user) await toggleUserStatus(user);
        });
        modalToggleButton.dataset.listenerAdded = 'true';
    }

    // Abrir Modal de Novo Usuário
    if (btnOpenAdd) {
        btnOpenAdd.addEventListener('click', () => {
            form.reset();
            document.getElementById('userEditId').value = '';
            document.getElementById('userModalTitle').textContent = "Novo Usuário";
            document.getElementById('userPasswordInput').value = '123456789';
            document.getElementById('userInitialPoints').disabled = false;
        });
    }

    // SALVAR (POST/PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const idInput = document.getElementById('userEditId');
        const editingId = idInput.value ? parseInt(idInput.value) : null;
        const selectedStatus = document.getElementById('userStatusSelect').value === 'Ativo' ? 'ATIVO' : 'SUSPENSO';
        const initialPoints = Number(document.getElementById('userInitialPoints').value || 0);
        
        // Payload conforme DTO do Java
        const payload = {
            nome: document.getElementById('userNameInput').value.trim(),
            email: document.getElementById('userEmailInput').value.trim(),
            cpf: document.getElementById('userCpfInput').value.trim(),
            tipoUsuario: 'cidadao',
            status: selectedStatus
        };

        const senhaInformada = document.getElementById('userPasswordInput').value;
        if (!editingId || senhaInformada) {
            payload.senha = senhaInformada || '123456789';
        }

        try {
            if (editingId) {
                await apiFetch(`/usuarios/${editingId}`, 'PUT', payload);
                alert('Usuario atualizado com sucesso!');
            } else {
                const createdUser = await apiFetch('/usuarios', 'POST', payload);
                if (initialPoints > 0) {
                    await apiFetch('/pontuacao/atribuir', 'POST', {
                        idUsuario: createdUser.id,
                        pontos: initialPoints,
                        atividade: 'Pontuacao inicial definida pelo administrador'
                    });
                }
                if (selectedStatus !== 'ATIVO') {
                    await apiFetch(`/usuarios/${createdUser.id}`, 'PUT', { status: selectedStatus });
                }
                alert("Usuario criado com sucesso!");
            }

            // Recarrega dados e fecha modal
            await loadDashboardData();
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

        } catch (error) {
            alert("Erro ao salvar usuário: " + error.message);
        }
    });
};

// Funções Auxiliares de Usuário (Busca, Paginação)
const handleUserSearchAndFilter = (redrawOnly = false) => {
    const searchInput = document.getElementById('userSearchInput');
    const searchButton = document.getElementById('user-search-button');
    const statusFilter = document.getElementById('userStatusFilter');
    
    const filterUsers = () => {
        const term = searchInput.value.toLowerCase().trim();
        const status = statusFilter ? statusFilter.value : '';
        filteredUserList = simulatedUsers.filter(user => 
            (user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)) &&
            (!status || user.status.toLowerCase() === status)
        );
        currentPage = 1;
        populateUserTable();
    };

    if (searchButton && !searchButton.dataset.listenerAdded) {
        searchButton.addEventListener('click', filterUsers);
        searchButton.dataset.listenerAdded = 'true';
    }
    if (statusFilter && !statusFilter.dataset.listenerAdded) {
        statusFilter.addEventListener('change', filterUsers);
        statusFilter.dataset.listenerAdded = 'true';
    }
    if (redrawOnly) filterUsers();
};

const renderPaginationControls = () => {
    const paginationNav = document.querySelector('.user-management-section nav[aria-label="Paginação de usuários"]');
    if (!paginationNav) return;
    
    const totalPages = Math.ceil(filteredUserList.length / itemsPerPage);
    const paginationUl = paginationNav.querySelector('.pagination');
    paginationUl.innerHTML = '';

    if (totalPages <= 1) { paginationNav.style.display = 'none'; return; }
    paginationNav.style.display = 'flex';

    // Cria botões prev/next/números simples
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        paginationUl.appendChild(li);
    }
};

const handlePagination = () => {
    const paginationNav = document.querySelector('.user-management-section nav[aria-label="Paginação de usuários"]');
    if (!paginationNav) return;
    paginationNav.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('.page-link');
        if (!link) return;
        const page = parseInt(link.dataset.page);
        if (!isNaN(page)) {
            currentPage = page;
            populateUserTable();
        }
    });
};

// ===================================================================
// GERENCIAMENTO DE EMPRESAS (Conectado)
// ===================================================================
const handleAddCompanyForm = () => {
    const form = document.getElementById('addCompanyFormNew');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const type = document.getElementById('newCompanyType').value;

        const payload = {
            nome: document.getElementById('newCompanyName').value.trim(),
            email: document.getElementById('newCompanyEmail').value.trim(),
            cnpj: document.getElementById('newCompanyCNPJ').value.replace(/\D/g, ''),
            endereco: document.getElementById('newCompanyAddress').value.trim(),
            telefone: document.getElementById('newCompanyPhone').value.trim(),
            senha: '123456789',
            tipoUsuario: type
        };

        try {
            const createdCompany = await apiFetch('/usuarios', 'POST', payload);
            await apiFetch(`/usuarios/${createdCompany.id}`, 'PUT', { status: 'ATIVO' });
            alert(`Empresa (${type}) cadastrada com sucesso! Senha inicial: 123456789`);
            form.reset();
            await loadDashboardData();
            renderCompanyTables();
        } catch (error) {
            alert("Erro ao cadastrar empresa: " + error.message);
        }
    });
};

const renderCompanyList = (selector, listData) => {
    const listElement = document.querySelector(selector);
    if (!listElement) return;
    
    listElement.innerHTML = '';
    if (listData.length === 0) {
        listElement.innerHTML = '<li class="list-group-item text-muted small">Nenhum registro.</li>';
        return;
    }

    listData.forEach(company => {
        const item = `
        <button type="button" class="list-group-item list-group-item-action py-1 px-2 d-flex justify-content-between align-items-center text-start" data-company-id="${company.id}" data-company-type="${company.type}">
            <span>
                <strong>${escapeHtml(company.name)}</strong>
                <small class="d-block text-muted">${escapeHtml(company.status || '')}</small>
            </span>
            <span class="badge bg-light text-dark border">${company.id}</span>
        </button>`;
        listElement.innerHTML += item;
    });
};

// ===================================================================
// GRÁFICOS (Adaptados para Dados Reais)
// ===================================================================
const initAdminCharts = () => {
    const ctx = document.getElementById('companyCollectionChart');
    if (!ctx) return;
    
    // Preparar dados agrupados por Empresa (baseado em simulatedUsers ou Logs se disponíveis)
    // Aqui usamos uma lógica simples: se tiver usuários do tipo Recicladora, mostramos
    // Se não, mantemos vazio ou mock visual.
    
    const labels = simulatedRecyclers.map(r => r.name);
    const dataPoints = simulatedRecyclers.map(() => Math.floor(Math.random() * 500)); // Mock visual já que logs reais podem estar vazios

    if (window.companyChartInstance) window.companyChartInstance.destroy();
    
    window.companyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ['Sem Dados'],
            datasets: [{
                label: 'Coletas (Kg)',
                data: dataPoints.length ? dataPoints : [0],
                backgroundColor: 'rgba(72, 143, 88, 0.7)'
            }]
        },
        options: { responsive: true }
    });
    
    // Outros gráficos (Usuários Totais)
    const ctxUsers = document.getElementById('totalUserRecyclingChart');
    if (ctxUsers) {
        if (window.totalUserChartInstance) window.totalUserChartInstance.destroy();
        window.totalUserChartInstance = new Chart(ctxUsers, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
                datasets: [{
                    label: 'Novos Usuários',
                    data: [5, 10, 15, 20, simulatedUsers.length], // Pega o total real no final
                    borderColor: '#e87a00',
                    fill: true
                }]
            },
            options: { responsive: true }
        });
    }
};

// ===================================================================
// UTILITÁRIOS E UI (Perfil, Configurações, Máscaras)
// ===================================================================

const loadAdminProfileUI = () => {
    const nameEl = document.getElementById('admin-name-display');
    const emailEl = document.getElementById('admin-email-display');
    if (nameEl) nameEl.textContent = currentAdminProfile.name;
    if (emailEl) emailEl.textContent = currentAdminProfile.email;
};

const handleAdminProfileModal = () => {
    const saveBtn = document.getElementById('saveAdminProfileChangesButton');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            alert('Simulação: Perfil atualizado (implementar endpoint /admin/profile se necessário).');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editAdminProfileModal'));
            modal.hide();
        });
    }
};

const loadSettings = () => {
    // Tenta carregar do localStorage por enquanto
    const stored = localStorage.getItem('ecoLogica_Settings');
    if (stored) currentSettings = JSON.parse(stored);
};

// Máscaras
const setupCNPJMasks = () => {
    const inputs = document.querySelectorAll('input[id*="CNPJ"]');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            v = v.replace(/^(\d{2})(\d)/, '$1.$2');
            v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
            v = v.replace(/(\d{4})(\d)/, '$1-$2');
            e.target.value = v.substring(0, 18);
        });
    });
};

const setupPhoneMasks = () => {
    const inputs = document.querySelectorAll('input[id*="Phone"], input[id*="telefone"]');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
            v = v.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = v.substring(0, 15);
        });
    });
};

// Funções de Placeholder para funcionalidades secundárias
const handleCampaignForm = () => {
    // Mantém lógica visual ou LocalStorage para campanhas por enquanto
    const form = document.getElementById('addCampaignForm');
    if(form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Campanha salva localmente (Conecte ao Backend endpoint /campanhas)');
        form.reset();
    });
};

const handleLogForm = () => {
    // Mantém lógica visual para Logs
    const form = document.getElementById('addLogForm');
    if(form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Log registrado visualmente.');
        const modal = bootstrap.Modal.getInstance(document.getElementById('addLogModal'));
        modal.hide();
    });
};

// Funções vazias para evitar erros de referência se chamadas
const handlePointsSystemForm = () => {};
const handleSiteSettingsForm = () => {};
const handleAnnouncementForm = () => {};
const handleAdBannerForm = () => {};
const setupExportButtons = () => {};
const renderRewardsList = () => {};
const handleRewardManager = () => {};

// ===================================================================
// MAPAS (Leaflet)
// ===================================================================
const initAdminMaps = () => {
    if (typeof L === 'undefined') return;
    const miniMapDiv = document.getElementById('mini-map-placeholder');
    if (miniMapDiv) {
        if (miniMapInstance) miniMapInstance.remove();
        miniMapInstance = L.map(miniMapDiv, { zoomControl: false }).setView([-26.9179, -49.0740], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMapInstance);
    }
};

const handleMapEditorModal = () => {
    const modal = document.getElementById('mapEditorModal');
    if (modal) {
        modal.addEventListener('shown.bs.modal', () => {
            if (!fullMapInstance) {
                fullMapInstance = L.map('full-map-container').setView([-26.9179, -49.0740], 14);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(fullMapInstance);
            } else {
                fullMapInstance.invalidateSize();
            }
        });
    }
};

const handleMapEditorActions = () => {
    const saveBtn = document.getElementById('savePointButton');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            alert('Ponto salvo (Simulação). Conecte ao Endpoint /pontos-coleta');
            // Lógica de salvar ponto aqui
        });
    }
};

// Handlers de clique vazios para evitar erro
const handleViewAllCompaniesModal = () => {};
const handlePointsListClick = (e) => e.preventDefault();
const handleModalPointEdit = (e) => e.preventDefault();

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function populateCompanySelects() {
    const supporterSelect = document.getElementById('campaignSupporterSelect');
    if (supporterSelect) {
        supporterSelect.innerHTML = '<option value="" selected disabled>Selecione uma apoiadora...</option>';
        simulatedSupporters.forEach(company => {
            supporterSelect.insertAdjacentHTML('beforeend', `<option value="${company.id}">${escapeHtml(company.name)}</option>`);
        });
    }

    const recyclerSelect = document.getElementById('pointRecyclerSelect');
    if (recyclerSelect) {
        recyclerSelect.innerHTML = '<option value="" selected disabled>Selecione uma recicladora...</option>';
        simulatedRecyclers.forEach(company => {
            recyclerSelect.insertAdjacentHTML('beforeend', `<option value="${company.id}">${escapeHtml(company.name)}</option>`);
        });
    }
}

function renderCampaignsList() {
    const list = document.getElementById('current-campaigns-list');
    if (!list) return;

    if (!simulatedCampaigns.length) {
        list.innerHTML = '<div class="list-group-item text-muted small">Nenhuma campanha cadastrada.</div>';
        return;
    }

    list.innerHTML = simulatedCampaigns.map(campaign => `
        <div class="list-group-item d-flex justify-content-between align-items-start gap-2">
            <div>
                <strong>${escapeHtml(campaign.titulo)}</strong>
                <div class="small text-muted">${escapeHtml(campaign.dataInicio || '--')} ate ${escapeHtml(campaign.dataFim || '--')}</div>
                <div class="small">${escapeHtml(campaign.nomeEmpresaApoiadora || 'Sem apoiadora')}</div>
            </div>
            <span class="badge bg-success rounded-pill">${Number(campaign.pontosExtras || 0)} pts</span>
        </div>
    `).join('');
}

function renderMaterialTypeCheckboxes() {
    const group = document.getElementById('pointTypeCheckGroup');
    if (!group) return;

    const activeTypes = materialTypes.filter(type => type.ativo !== false);
    if (!activeTypes.length) {
        group.innerHTML = '<p class="text-muted small mb-0">Nenhum material ativo cadastrado.</p>';
        return;
    }

    group.innerHTML = activeTypes.map(type => `
        <div class="form-check form-check-inline">
            <input class="form-check-input point-type-checkbox" type="checkbox" id="materialType${type.id}" value="${type.id}">
            <label class="form-check-label small" for="materialType${type.id}">${escapeHtml(type.nomeTipo)}</label>
        </div>
    `).join('');
}

function resetMaterialTypeForm() {
    document.getElementById('materialTypeForm')?.reset();
    const idInput = document.getElementById('materialTypeId');
    const activeInput = document.getElementById('materialTypeActive');
    const saveButton = document.getElementById('saveMaterialTypeButton');
    if (idInput) idInput.value = '';
    if (activeInput) activeInput.checked = true;
    if (saveButton) saveButton.textContent = 'Salvar Material';
}

function renderMaterialTypesList() {
    const list = document.getElementById('material-types-list');
    if (!list) return;

    if (!materialTypes.length) {
        list.innerHTML = '<p class="text-muted small text-center mt-3">Nenhum material cadastrado.</p>';
        return;
    }

    list.innerHTML = materialTypes.map(type => {
        const active = type.ativo !== false;
        return `
            <div class="list-group-item py-2" data-material-id="${type.id}">
                <div class="d-flex justify-content-between align-items-start gap-2">
                    <div>
                        <strong>${escapeHtml(type.nomeTipo)}</strong>
                        <div class="small text-muted">${escapeHtml(type.descricao || '')}</div>
                        <span class="badge ${active ? 'bg-success' : 'bg-secondary'}">${active ? 'Ativo' : 'Inativo'}</span>
                    </div>
                    <span class="d-inline-flex gap-1">
                        <button type="button" class="btn btn-sm btn-outline-secondary js-edit-material" data-material-id="${type.id}" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-warning js-toggle-material" data-material-id="${type.id}" title="Ativar/Desativar"><i class="fas fa-power-off"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-danger js-delete-material" data-material-id="${type.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function handleMaterialTypeManager() {
    const form = document.getElementById('materialTypeForm');
    const list = document.getElementById('material-types-list');
    const cancelButton = document.getElementById('cancelMaterialTypeEditButton');

    if (form && !form.dataset.listenerAdded) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = document.getElementById('materialTypeId').value;
            const payload = {
                nomeTipo: document.getElementById('materialTypeName').value.trim(),
                descricao: document.getElementById('materialTypeDescription').value.trim(),
                ativo: document.getElementById('materialTypeActive').checked
            };

            try {
                await apiFetch(id ? `/tipos-materiais/${id}` : '/tipos-materiais', id ? 'PUT' : 'POST', payload);
                materialTypes = await apiFetch('/tipos-materiais', 'GET', null, { skipAuth: true });
                renderMaterialTypesList();
                renderMaterialTypeCheckboxes();
                resetMaterialTypeForm();
            } catch (error) {
                alert('Erro ao salvar material: ' + error.message);
            }
        });
        form.dataset.listenerAdded = 'true';
    }

    if (cancelButton && !cancelButton.dataset.listenerAdded) {
        cancelButton.addEventListener('click', resetMaterialTypeForm);
        cancelButton.dataset.listenerAdded = 'true';
    }

    if (list && !list.dataset.listenerAdded) {
        list.addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-material-id]');
            if (!button) return;

            const material = materialTypes.find(item => String(item.id) === String(button.dataset.materialId));
            if (!material) return;

            if (button.classList.contains('js-edit-material')) {
                document.getElementById('materialTypeId').value = material.id;
                document.getElementById('materialTypeName').value = material.nomeTipo || '';
                document.getElementById('materialTypeDescription').value = material.descricao || '';
                document.getElementById('materialTypeActive').checked = material.ativo !== false;
                document.getElementById('saveMaterialTypeButton').textContent = 'Atualizar Material';
                return;
            }

            try {
                if (button.classList.contains('js-toggle-material')) {
                    await apiFetch(`/tipos-materiais/${material.id}`, 'PUT', {
                        nomeTipo: material.nomeTipo,
                        descricao: material.descricao,
                        ativo: material.ativo === false
                    });
                }

                if (button.classList.contains('js-delete-material')) {
                    if (!confirm(`Excluir o material "${material.nomeTipo}"?`)) return;
                    await apiFetch(`/tipos-materiais/${material.id}`, 'DELETE');
                }

                materialTypes = await apiFetch('/tipos-materiais', 'GET', null, { skipAuth: true });
                renderMaterialTypesList();
                renderMaterialTypeCheckboxes();
                resetMaterialTypeForm();
            } catch (error) {
                alert('Erro ao alterar material: ' + error.message);
            }
        });
        list.dataset.listenerAdded = 'true';
    }
}

function renderCollectionPoints() {
    const sideList = document.querySelector('.collection-points-management-section .list-group-flush');
    const modalList = document.querySelector('#mapEditorModal .modal-points-list-scrollable');

    const html = simulatedCollectionPoints.length
        ? simulatedCollectionPoints.map(point => `
            <div class="list-group-item py-2 px-2" data-point-id="${point.id}">
                <div class="d-flex justify-content-between align-items-start gap-2">
                    <button type="button" class="btn btn-link p-0 text-start text-decoration-none flex-grow-1 js-edit-point" data-point-id="${point.id}">
                        <strong>${escapeHtml(point.nome)}</strong>
                        <div class="small text-muted">${escapeHtml(point.endereco || point.cidade || '')}</div>
                    </button>
                    <span class="d-inline-flex gap-1">
                        <button type="button" class="btn btn-sm btn-outline-secondary js-edit-point" data-point-id="${point.id}" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-danger js-delete-point" data-point-id="${point.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                    </span>
                </div>
            </div>
        `).join('')
        : '<div class="list-group-item text-muted small">Nenhum ponto cadastrado.</div>';

    if (sideList) sideList.innerHTML = html;
    if (modalList) modalList.innerHTML = html;

    renderCollectionPointMarkers();
}

function renderCollectionPointMarkers() {
    if (typeof L === 'undefined') return;
    [miniMapInstance, fullMapInstance].filter(Boolean).forEach(map => {
        map.__ecoCollectionMarkers = map.__ecoCollectionMarkers || [];
        map.__ecoCollectionMarkers.forEach(marker => marker.remove());
        map.__ecoCollectionMarkers = [];
        simulatedCollectionPoints
            .filter(point => point.latitude && point.longitude)
            .forEach(point => {
                const marker = L.marker([point.latitude, point.longitude])
                    .addTo(map)
                    .bindPopup(`<strong>${escapeHtml(point.nome)}</strong><br>${escapeHtml(point.endereco || '')}`);
                map.__ecoCollectionMarkers.push(marker);
            });
    });
}

function csvValue(value) {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename, rows) {
    const csv = rows.map(row => row.map(csvValue).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function getAllCompanies() {
    return [...simulatedRecyclers, ...simulatedSupporters];
}

function filteredCompanies(type) {
    const searchInput = document.getElementById('companySearchInput');
    const term = (searchInput?.value || '').trim().toLowerCase();
    return getAllCompanies()
        .filter(company => !type || company.type === type)
        .filter(company => {
            if (!term) return true;
            return [company.name, company.email, company.cnpj, company.address, company.phone, company.status]
                .some(value => String(value || '').toLowerCase().includes(term));
        });
}

function companyTableHtml(companies, emptyText) {
    if (!companies.length) {
        return `<p class="text-muted text-center small my-4">${emptyText}</p>`;
    }

    return `
        <div class="table-responsive">
            <table class="table table-sm table-hover align-middle">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CNPJ</th>
                        <th>Status</th>
                        <th class="text-end">Acoes</th>
                    </tr>
                </thead>
                <tbody>
                    ${companies.map(company => `
                        <tr>
                            <td>
                                <strong>${escapeHtml(company.name)}</strong>
                                <div class="small text-muted">${escapeHtml(company.address || '')}</div>
                            </td>
                            <td>${escapeHtml(company.email || '')}</td>
                            <td>${escapeHtml(company.cnpj || '')}</td>
                            <td><span class="badge ${company.rawStatus === 'ATIVO' ? 'bg-success' : company.rawStatus === 'SUSPENSO' ? 'bg-secondary' : 'bg-warning text-dark'}">${escapeHtml(company.status || '')}</span></td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-secondary js-edit-company" data-company-id="${company.id}" data-company-type="${company.type}" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn btn-sm btn-outline-warning js-toggle-company" data-company-id="${company.id}" data-company-type="${company.type}" title="Ativar/Desativar"><i class="fas fa-power-off"></i></button>
                                <button class="btn btn-sm btn-outline-danger js-delete-company" data-company-id="${company.id}" data-company-type="${company.type}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderCompanyTables() {
    const recyclers = document.getElementById('recyclersTableContainer');
    const supporters = document.getElementById('supportersTableContainer');
    if (recyclers) recyclers.innerHTML = companyTableHtml(filteredCompanies('recicladora'), 'Nenhuma recicladora encontrada.');
    if (supporters) supporters.innerHTML = companyTableHtml(filteredCompanies('apoiadora'), 'Nenhuma apoiadora encontrada.');
}

function findCompany(id, type) {
    return getAllCompanies().find(company => String(company.id) === String(id) && (!type || company.type === type));
}

function fillCompanyEditForm(company) {
    document.getElementById('editCompanyId').value = company.id;
    document.getElementById('editingCompanyNameDisplay').textContent = company.name;
    document.getElementById('editCompanyName').value = company.name || '';
    document.getElementById('editCompanyEmail').value = company.email || '';
    document.getElementById('editCompanyPhone').value = company.phone || '';
    document.getElementById('editCompanyCNPJ').value = company.cnpj || '';
    document.getElementById('editCompanyAddress').value = company.address || '';
    document.getElementById('editCompanyTypeDisplay').textContent = company.type === 'recicladora' ? 'Recicladora' : 'Apoiadora';
    document.getElementById('editCompanyTypeHidden').value = company.type;
    document.getElementById('edit-company-tab-container')?.classList.remove('d-none');
    new bootstrap.Tab(document.getElementById('edit-company-tab')).show();
}

async function reloadCompanies() {
    const recicladoras = await apiFetch('/empresas-recicladoras');
    simulatedRecyclers = recicladoras.map(r => ({
        id: r.id,
        name: r.nomeEmpresa || r.nome,
        email: r.email,
        cnpj: r.cnpj,
        address: r.endereco,
        phone: r.telefone,
        rawStatus: r.status || 'PENDENTE',
        status: r.status === 'ATIVO' ? 'Ativa' : r.status === 'SUSPENSO' ? 'Inativa' : 'Pendente',
        type: 'recicladora'
    }));

    const apoiadoras = await apiFetch('/empresas-apoiadoras');
    simulatedSupporters = apoiadoras.map(a => ({
        id: a.id,
        name: a.nomeEmpresa || a.nome,
        email: a.email,
        cnpj: a.cnpj,
        address: a.endereco,
        phone: a.telefone,
        rawStatus: a.status || 'PENDENTE',
        status: a.status === 'ATIVO' ? 'Ativa' : a.status === 'SUSPENSO' ? 'Inativa' : 'Pendente',
        type: 'apoiadora'
    }));

    renderCompanyList('#recycler-company-list', simulatedRecyclers);
    renderCompanyList('#supporter-company-list', simulatedSupporters);
    renderCompanyTables();
    populateCompanySelects();
}

function handleCompanyModalBackend() {
    const modal = document.getElementById('viewAllCompaniesModal');
    const searchInput = document.getElementById('companySearchInput');
    const exportButton = document.getElementById('btnExportCompanies');
    const editForm = document.getElementById('editCompanyForm');

    if (modal && !modal.dataset.listenerAdded) {
        modal.addEventListener('show.bs.modal', event => {
            const trigger = event.relatedTarget;
            const targetType = trigger?.dataset.companyType;
            renderCompanyTables();
            if (targetType === 'apoiadora') {
                new bootstrap.Tab(document.getElementById('view-supporters-tab')).show();
            } else {
                new bootstrap.Tab(document.getElementById('view-recyclers-tab')).show();
            }
        });
        modal.dataset.listenerAdded = 'true';
    }

    if (searchInput && !searchInput.dataset.listenerAdded) {
        searchInput.addEventListener('input', renderCompanyTables);
        searchInput.dataset.listenerAdded = 'true';
    }

    if (exportButton && !exportButton.dataset.listenerAdded) {
        exportButton.addEventListener('click', () => {
            const rows = [
                ['Categoria', 'ID', 'Nome', 'Email', 'CNPJ', 'Telefone', 'Endereco', 'Status'],
                ...getAllCompanies().map(company => [
                    company.type,
                    company.id,
                    company.name,
                    company.email,
                    company.cnpj,
                    company.phone,
                    company.address,
                    company.rawStatus
                ])
            ];
            downloadCsv(`empresas-ecologica-${new Date().toISOString().slice(0, 10)}.csv`, rows);
        });
        exportButton.dataset.listenerAdded = 'true';
    }

    document.getElementById('companyTabsContent')?.addEventListener('click', async event => {
        const button = event.target.closest('button[data-company-id]');
        if (!button) return;

        const company = findCompany(button.dataset.companyId, button.dataset.companyType);
        if (!company) return;

        if (button.classList.contains('js-edit-company')) {
            fillCompanyEditForm(company);
            return;
        }

        try {
            if (button.classList.contains('js-toggle-company')) {
                const status = company.rawStatus === 'ATIVO' ? 'SUSPENSO' : 'ATIVO';
                await apiFetch(`/usuarios/${company.id}`, 'PUT', { status });
            }

            if (button.classList.contains('js-delete-company')) {
                if (!confirm(`Excluir a empresa "${company.name}"?`)) return;
                await apiFetch(`/usuarios/${company.id}`, 'DELETE');
            }

            await reloadCompanies();
        } catch (error) {
            alert('Erro ao alterar empresa: ' + error.message);
        }
    }, { capture: false });

    if (editForm && !editForm.dataset.listenerAdded) {
        editForm.addEventListener('submit', async event => {
            event.preventDefault();
            const id = document.getElementById('editCompanyId').value;
            const type = document.getElementById('editCompanyTypeHidden').value;

            try {
                await apiFetch(`/usuarios/${id}`, 'PUT', {
                    nome: document.getElementById('editCompanyName').value.trim(),
                    email: document.getElementById('editCompanyEmail').value.trim(),
                    cnpj: document.getElementById('editCompanyCNPJ').value.replace(/\D/g, ''),
                    endereco: document.getElementById('editCompanyAddress').value.trim(),
                    telefone: document.getElementById('editCompanyPhone').value.trim()
                });
                await reloadCompanies();
                new bootstrap.Tab(document.getElementById(type === 'apoiadora' ? 'view-supporters-tab' : 'view-recyclers-tab')).show();
                alert('Empresa atualizada.');
            } catch (error) {
                alert('Erro ao atualizar empresa: ' + error.message);
            }
        });
        editForm.dataset.listenerAdded = 'true';
    }
}

function setupExportButtonsReal() {
    const exportUsersButton = document.getElementById('btnExportUsers');
    if (exportUsersButton && !exportUsersButton.dataset.listenerAdded) {
        exportUsersButton.addEventListener('click', () => {
            const rows = [
                ['ID', 'Nome', 'CPF/CNPJ', 'Email', 'Tipo', 'Status', 'Pontos'],
                ...simulatedUsers.map(user => [user.id, user.name, user.cpf, user.email, user.role, user.rawStatus, user.points])
            ];
            downloadCsv(`usuarios-ecologica-${new Date().toISOString().slice(0, 10)}.csv`, rows);
        });
        exportUsersButton.dataset.listenerAdded = 'true';
    }
}

function handleManualPointsAdjustment() {
    const button = document.getElementById('manualAdjustApplyButton');
    if (!button || button.dataset.listenerAdded) return;

    button.addEventListener('click', async () => {
        const email = document.getElementById('manualAdjustEmail').value.trim().toLowerCase();
        const points = Number(document.getElementById('manualAdjustPoints').value);

        if (!email || !Number.isFinite(points) || points === 0) {
            alert('Informe o email do usuario e uma quantidade de pontos diferente de zero.');
            return;
        }

        let user = simulatedUsers.find(item => (item.email || '').toLowerCase() === email);
        if (!user) {
            const usersData = await apiFetch('/usuarios');
            simulatedUsers = usersData.map(u => ({
                id: u.id || u.idUsuario,
                name: u.nome,
                cpf: u.cpf,
                email: u.email,
                points: u.pontos || 0,
                rawStatus: u.status,
                status: u.status === 'ATIVO' ? 'Ativo' : 'Inativo',
                role: u.tipoUsuario
            }));
            user = simulatedUsers.find(item => (item.email || '').toLowerCase() === email);
        }

        if (!user) {
            alert('Usuario nao encontrado para o email informado.');
            return;
        }

        try {
            await apiFetch('/pontuacao/atribuir', 'POST', {
                idUsuario: user.id,
                pontos: points,
                atividade: 'Ajuste manual realizado pelo administrador'
            });
            document.getElementById('manualAdjustEmail').value = '';
            document.getElementById('manualAdjustPoints').value = '';
            await loadDashboardData();
            alert('Pontuacao ajustada com sucesso.');
        } catch (error) {
            alert('Erro ao ajustar pontuacao: ' + error.message);
        }
    });
    button.dataset.listenerAdded = 'true';
}

async function loadActiveAnnouncementPreview() {
    const preview = document.getElementById('active-announcement-preview');
    if (!preview) return;

    try {
        const aviso = await apiFetch('/avisos/ativo', 'GET', null, { skipAuth: true, skipAuthRedirect: true });
        if (!aviso || !aviso.ativo) {
            preview.innerHTML = '<p class="text-muted small fst-italic">Nenhum aviso publicado.</p>';
            return;
        }
        preview.innerHTML = `<div class="alert alert-${aviso.tipo === 'warning' ? 'warning' : aviso.tipo === 'success' ? 'success' : 'info'} py-2 mb-0">${escapeHtml(aviso.texto)}</div>`;
    } catch {
        preview.innerHTML = '<p class="text-muted small fst-italic">Nenhum aviso publicado.</p>';
    }
}

function handleAnnouncementFormBackend() {
    const form = document.getElementById('announcementForm');
    const removeButton = document.getElementById('btnRemoveAnnouncement');

    if (form && !form.dataset.backendListenerAdded) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            try {
                await apiFetch('/avisos', 'POST', {
                    texto: document.getElementById('announcementText').value.trim(),
                    tipo: document.getElementById('announcementType').value
                });
                form.reset();
                await loadActiveAnnouncementPreview();
                alert('Aviso publicado em todas as paginas.');
            } catch (error) {
                alert('Erro ao publicar aviso: ' + error.message);
            }
        }, true);
        form.dataset.backendListenerAdded = 'true';
    }

    if (removeButton && !removeButton.dataset.backendListenerAdded) {
        removeButton.addEventListener('click', async () => {
            try {
                await apiFetch('/avisos/ativo', 'DELETE');
                localStorage.removeItem('ecoLogica_CurrentAnnouncement');
                await loadActiveAnnouncementPreview();
                alert('Aviso removido de todas as paginas.');
            } catch (error) {
                alert('Erro ao remover aviso: ' + error.message);
            }
        });
        removeButton.dataset.backendListenerAdded = 'true';
    }
}

function handleCampaignFormBackend() {
    const form = document.getElementById('addCampaignForm');
    if (!form || form.dataset.backendListenerAdded) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        try {
            await apiFetch('/campanhas', 'POST', {
                titulo: document.getElementById('campaignTitle').value.trim(),
                descricao: document.getElementById('campaignDescription').value.trim(),
                dataInicio: document.getElementById('campaignStartDate').value,
                dataFim: document.getElementById('campaignEndDate').value,
                idApoiadora: Number(document.getElementById('campaignSupporterSelect').value),
                imagemUrl: document.getElementById('campaignImage').value.trim(),
                pontosExtras: Number(document.getElementById('campaignPoints').value || 0)
            });
            form.reset();
            simulatedCampaigns = await apiFetch('/campanhas');
            renderCampaignsList();
            alert('Campanha salva no banco de dados.');
        } catch (error) {
            alert('Erro ao salvar campanha: ' + error.message);
        }
    }, true);
    form.dataset.backendListenerAdded = 'true';
}

function handleMapEditorModalBackend() {
    const modal = document.getElementById('mapEditorModal');
    if (!modal || modal.dataset.backendListenerAdded) return;

    modal.addEventListener('shown.bs.modal', () => {
        if (fullMapInstance) {
            fullMapInstance.invalidateSize();
            if (!fullMapInstance.__ecoClickBound) {
                fullMapInstance.on('click', handleMapClickForPoint);
                fullMapInstance.__ecoClickBound = true;
            }
        }
        populateCompanySelects();
        renderMaterialTypeCheckboxes();
        renderCollectionPoints();
    });
    modal.dataset.backendListenerAdded = 'true';
}

function handleMapClickForPoint(event) {
    document.getElementById('pointDetailsFormContainer').style.display = 'block';
    document.getElementById('pointFormTitle').textContent = 'Adicionar Novo Ponto';
    document.getElementById('pointId').value = '';
    document.getElementById('pointDetailsForm')?.reset();
    document.getElementById('pointLat').value = event.latlng.lat.toFixed(6);
    document.getElementById('pointLng').value = event.latlng.lng.toFixed(6);

    if (tempNewMarker) tempNewMarker.remove();
    tempNewMarker = L.marker(event.latlng).addTo(fullMapInstance).bindPopup('Novo ponto de coleta').openPopup();
}

function fillPointForm(point) {
    document.getElementById('pointDetailsFormContainer').style.display = 'block';
    document.getElementById('pointFormTitle').textContent = 'Editar Ponto de Coleta';
    document.getElementById('pointId').value = point.id || '';
    document.getElementById('pointLat').value = point.latitude || '';
    document.getElementById('pointLng').value = point.longitude || '';
    document.getElementById('pointName').value = point.nome || '';
    document.getElementById('pointAddress').value = point.endereco || '';
    document.getElementById('pointRecyclerSelect').value = point.idRecicladora || '';

    const selectedIds = new Set((point.tiposMateriaisIds || []).map(String));
    document.querySelectorAll('.point-type-checkbox').forEach(input => {
        input.checked = selectedIds.has(String(input.value));
    });

    if (fullMapInstance && point.latitude && point.longitude) {
        const latlng = [point.latitude, point.longitude];
        fullMapInstance.setView(latlng, Math.max(fullMapInstance.getZoom(), 15));
        if (tempNewMarker) tempNewMarker.remove();
        tempNewMarker = L.marker(latlng).addTo(fullMapInstance).bindPopup('Editando ponto').openPopup();
    }
}

function handleMapEditorActionsBackend() {
    const form = document.getElementById('pointDetailsForm');
    const saveButton = document.getElementById('savePointButton');
    const cancelButton = document.getElementById('cancelPointButton');

    if (saveButton && !saveButton.dataset.captureAdded) {
        saveButton.addEventListener('click', event => event.stopImmediatePropagation(), true);
        saveButton.dataset.captureAdded = 'true';
    }

    if (form && !form.dataset.backendListenerAdded) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const pointId = document.getElementById('pointId').value;
            const selectedMaterials = Array.from(document.querySelectorAll('.point-type-checkbox:checked')).map(input => Number(input.value));
            try {
                await apiFetch(pointId ? `/locais-coleta/${pointId}` : '/locais-coleta', pointId ? 'PUT' : 'POST', {
                    nome: document.getElementById('pointName').value.trim(),
                    endereco: document.getElementById('pointAddress').value.trim(),
                    cidade: document.getElementById('pointAddress').value.split(',').pop()?.trim() || '',
                    latitude: Number(document.getElementById('pointLat').value),
                    longitude: Number(document.getElementById('pointLng').value),
                    idRecicladora: Number(document.getElementById('pointRecyclerSelect').value),
                    tiposMateriaisIds: selectedMaterials
                });
                form.reset();
                document.getElementById('pointDetailsFormContainer').style.display = 'none';
                if (tempNewMarker) {
                    tempNewMarker.remove();
                    tempNewMarker = null;
                }
                simulatedCollectionPoints = await apiFetch('/locais-coleta', 'GET', null, { skipAuth: true });
                renderCollectionPoints();
                alert(pointId ? 'Ponto de coleta atualizado.' : 'Ponto de coleta salvo no banco de dados.');
            } catch (error) {
                alert('Erro ao salvar ponto de coleta: ' + error.message);
            }
        }, true);
        form.dataset.backendListenerAdded = 'true';
    }

    if (cancelButton && !cancelButton.dataset.listenerAdded) {
        cancelButton.addEventListener('click', () => {
            form.reset();
            document.getElementById('pointDetailsFormContainer').style.display = 'none';
            if (tempNewMarker) {
                tempNewMarker.remove();
                tempNewMarker = null;
            }
        });
        cancelButton.dataset.listenerAdded = 'true';
    }

    [document.querySelector('.collection-points-management-section .list-group-flush'), document.querySelector('#mapEditorModal .modal-points-list-scrollable')]
        .filter(Boolean)
        .forEach(list => {
            if (list.dataset.pointActionsAdded) return;
            list.addEventListener('click', async (event) => {
                const editButton = event.target.closest('.js-edit-point');
                const deleteButton = event.target.closest('.js-delete-point');
                const pointId = editButton?.dataset.pointId || deleteButton?.dataset.pointId;
                if (!pointId) return;

                event.preventDefault();
                event.stopPropagation();
                const point = simulatedCollectionPoints.find(item => String(item.id) === String(pointId));
                if (!point) return;

                if (editButton) {
                    fillPointForm(point);
                    return;
                }

                if (confirm(`Excluir o ponto "${point.nome}"?`)) {
                    try {
                        await apiFetch(`/locais-coleta/${point.id}`, 'DELETE');
                        simulatedCollectionPoints = await apiFetch('/locais-coleta', 'GET', null, { skipAuth: true });
                        renderCollectionPoints();
                    } catch (error) {
                        alert('Erro ao excluir ponto de coleta: ' + error.message);
                    }
                }
            });
            list.dataset.pointActionsAdded = 'true';
        });
}

async function renderRewardsListBackend() {
    const list = document.getElementById('rewards-list');
    if (!list) return;

    try {
        rewards = await apiFetch('/beneficios');
        if (!rewards.length) {
            list.innerHTML = '<p class="text-muted small text-center mt-3">Nenhuma recompensa cadastrada.</p>';
            return;
        }
        list.innerHTML = rewards.map(reward => `
            <button type="button" class="list-group-item list-group-item-action d-flex align-items-center gap-2 text-start" data-reward-id="${reward.id}">
                <img src="${escapeHtml(reward.imagemUrl || 'img/geral-site/logo-aba-navegador.png')}" alt="${escapeHtml(reward.titulo)}" style="width:36px;height:36px;object-fit:contain;">
                <span class="flex-grow-1">${escapeHtml(reward.titulo)}</span>
                <span class="badge bg-success">${reward.pontosNecessarios} pts</span>
            </button>
        `).join('');
    } catch (error) {
        list.innerHTML = `<p class="text-danger small text-center mt-3">${escapeHtml(error.message)}</p>`;
    }
}

function readImageAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function handleRewardManagerBackend() {
    const form = document.getElementById('rewardForm');
    const imageInput = document.getElementById('rewardImage');
    const preview = document.getElementById('rewardImagePreview');
    const addButton = document.getElementById('btnAddReward');

    if (addButton && !addButton.dataset.listenerAdded) {
        addButton.addEventListener('click', () => {
            form.reset();
            document.getElementById('rewardId').value = '';
            document.getElementById('rewardModalTitle').textContent = 'Nova Recompensa';
            rewardImageDataUrl = '';
            if (preview) preview.classList.add('d-none');
        });
        addButton.dataset.listenerAdded = 'true';
    }

    if (imageInput && !imageInput.dataset.listenerAdded) {
        imageInput.addEventListener('change', async () => {
            const file = imageInput.files?.[0];
            rewardImageDataUrl = file ? await readImageAsDataUrl(file) : '';
            if (preview && rewardImageDataUrl) {
                preview.src = rewardImageDataUrl;
                preview.classList.remove('d-none');
            } else if (preview) {
                preview.removeAttribute('src');
                preview.classList.add('d-none');
            }
        });
        imageInput.dataset.listenerAdded = 'true';
    }

    if (form && !form.dataset.backendListenerAdded) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const id = document.getElementById('rewardId').value;
            const payload = {
                titulo: document.getElementById('rewardName').value.trim(),
                descricao: document.getElementById('rewardDescription').value.trim(),
                pontosNecessarios: Number(document.getElementById('rewardCost').value),
                estoque: Number(document.getElementById('rewardStock').value || 0),
                imagemUrl: rewardImageDataUrl
            };

            try {
                await apiFetch(id ? `/beneficios/${id}` : '/beneficios', id ? 'PUT' : 'POST', payload);
                await renderRewardsListBackend();
                bootstrap.Modal.getInstance(document.getElementById('rewardModal'))?.hide();
                alert('Recompensa salva no banco de dados.');
            } catch (error) {
                alert('Erro ao salvar recompensa: ' + error.message);
            }
        }, true);
        form.dataset.backendListenerAdded = 'true';
    }

    const list = document.getElementById('rewards-list');
    if (list && !list.dataset.listenerAdded) {
        list.addEventListener('click', (event) => {
            const button = event.target.closest('[data-reward-id]');
            if (!button) return;

            const reward = rewards.find(item => String(item.id) === String(button.dataset.rewardId));
            if (!reward) return;

            document.getElementById('rewardId').value = reward.id;
            document.getElementById('rewardModalTitle').textContent = 'Editar Recompensa';
            document.getElementById('rewardName').value = reward.titulo || '';
            document.getElementById('rewardDescription').value = reward.descricao || '';
            document.getElementById('rewardCost').value = reward.pontosNecessarios || 0;
            document.getElementById('rewardStock').value = reward.estoque ?? 0;
            rewardImageDataUrl = reward.imagemUrl || '';

            if (preview && rewardImageDataUrl) {
                preview.src = rewardImageDataUrl;
                preview.classList.remove('d-none');
            } else if (preview) {
                preview.removeAttribute('src');
                preview.classList.add('d-none');
            }

            new bootstrap.Modal(document.getElementById('rewardModal')).show();
        });
        list.dataset.listenerAdded = 'true';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleCampaignFormBackend();
    setupExportButtonsReal();
    handleCompanyModalBackend();
    handleManualPointsAdjustment();
    handleAnnouncementFormBackend();
    handleMapEditorModalBackend();
    handleMapEditorActionsBackend();
    handleMaterialTypeManager();
    handleRewardManagerBackend();
});
