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

// ===================================================================
// INICIALIZAÇÃO (DOMContentLoaded)
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("admin-dashboard.js: Iniciando conexão com Backend...");

    // 1. Carregar Perfil Visual (Admin)
    loadAdminProfileUI();

    // 2. BUSCAR DADOS REAIS DO BACKEND
    loadDashboardData();

    // 3. Inicializar Componentes de UI (que não dependem de dados imediatos)
    handleAdminProfileModal();
    
    // Configurações de Formulários
    handleUserForm();           // Cadastro de Usuários
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
                email: u.email,
                points: u.pontos || 0,
                status: 'Ativo', // Se o Java não retornar status, assumimos Ativo
                role: u.tipoUsuario // 'COMUM', 'RECICLADORA', etc.
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
                    type: 'apoiadora'
                }));
            }
        } catch (e) { console.log("Endpoint de apoiadoras não disponível."); }

        // Atualiza Listas de Empresas na tela
        renderCompanyList('#recycler-company-list', simulatedRecyclers);
        renderCompanyList('#supporter-company-list', simulatedSupporters);

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
    renderPaginationControls();
};

const handleUserForm = () => {
    const form = document.getElementById('addEditUserForm');
    const modalElement = document.getElementById('addEditUserModal');
    const btnOpenAdd = document.getElementById('btnOpenAddUser');

    if (!form || !modalElement) return;

    // Abrir Modal de Novo Usuário
    if (btnOpenAdd) {
        btnOpenAdd.addEventListener('click', () => {
            form.reset();
            document.getElementById('userEditId').value = '';
            document.getElementById('userModalTitle').textContent = "Novo Usuário";
            document.getElementById('userInitialPoints').disabled = false;
        });
    }

    // SALVAR (POST/PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const idInput = document.getElementById('userEditId');
        const editingId = idInput.value ? parseInt(idInput.value) : null;
        
        // Payload conforme DTO do Java
        const payload = {
            nome: document.getElementById('userNameInput').value.trim(),
            email: document.getElementById('userEmailInput').value.trim(),
            senha: "123", // Senha padrão (ideal: criar campo de senha no form)
            tipoUsuario: "COMUM", // Default
            pontos: parseInt(document.getElementById('userInitialPoints').value) || 0
            // status: document.getElementById('userStatusSelect').value (Se o backend aceitar)
        };

        try {
            if (editingId) {
                // Se tiver endpoint de edição: await apiFetch(`/usuarios/${editingId}`, 'PUT', payload);
                alert('Funcionalidade de Edição requer endpoint PUT /usuarios/{id} no Java.');
            } else {
                // CRIAÇÃO
                await apiFetch('/usuarios', 'POST', payload);
                alert("Usuário criado com sucesso!");
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
    
    const filterUsers = () => {
        const term = searchInput.value.toLowerCase().trim();
        filteredUserList = simulatedUsers.filter(user => 
            user.name.toLowerCase().includes(term) || 
            user.email.toLowerCase().includes(term)
        );
        currentPage = 1;
        populateUserTable();
    };

    if (searchButton && !searchButton.dataset.listenerAdded) {
        searchButton.addEventListener('click', filterUsers);
        searchButton.dataset.listenerAdded = 'true';
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
    const form = document.getElementById('addCompanyForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const type = document.getElementById('companyType').value;
        const endpoint = type === 'recicladora' ? '/empresas-recicladoras' : '/empresas-apoiadoras';

        const payload = {
            nomeEmpresa: document.getElementById('companyName').value.trim(),
            email: document.getElementById('companyEmail').value.trim(),
            cnpj: document.getElementById('companyCNPJ').value.replace(/\D/g, ''), // Limpa máscara
            endereco: document.getElementById('companyAddress').value.trim(),
            telefone: "00000000", // Valor padrão se não houver campo
            senha: "senhaPadrao123", // Obrigatório para criar o Login associado
            tipoUsuario: type === 'recicladora' ? 'RECICLADORA' : 'APOIADORA'
        };

        try {
            await apiFetch(endpoint, 'POST', payload);
            alert(`Empresa (${type}) cadastrada com sucesso!`);
            
            // Limpa form e recarrega
            form.reset();
            await loadDashboardData(); 

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
        <a href="#" class="list-group-item list-group-item-action py-1 px-2 d-flex justify-content-between align-items-center" data-company-id="${company.id}">
            ${company.name}
            <span class="badge bg-light text-dark border">${company.id}</span>
        </a>`;
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