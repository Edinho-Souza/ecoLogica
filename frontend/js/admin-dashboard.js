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
    // DADOS DO PERFIL DO ADMIN
    // ===================================================================
    const defaultAdminProfile = {
        name: "Administrador",
        email: "admin@ecologica.com",
        avatar: "img/avatar/avatar-adm.png",
        memberSince: "20/09/2025" // <--- DATA DEFINIDA AQUI
    };

    // Carrega do localStorage ou usa o padrão (agora inclui a data)
    let currentAdminProfile = JSON.parse(localStorage.getItem('ecoLogica_AdminProfile')) || defaultAdminProfile;

    // Garante que o campo exista mesmo se já tiver dados salvos antigos
    if (!currentAdminProfile.memberSince) {
        currentAdminProfile.memberSince = defaultAdminProfile.memberSince;
    }

    // Função para atualizar a interface
    const loadAdminProfileUI = () => {
        const avatarEl = document.getElementById('admin-avatar-display');
        const nameEl = document.getElementById('admin-name-display');
        const emailEl = document.getElementById('admin-email-display');
        const memberSinceEl = document.getElementById('admin-member-since-display'); // <--- NOVO SELETOR
        const greetingNameEl = document.querySelector('.admin-profile-name');

        if (avatarEl) avatarEl.src = currentAdminProfile.avatar;
        if (nameEl) nameEl.textContent = currentAdminProfile.name;
        if (emailEl) emailEl.textContent = currentAdminProfile.email;
        if (greetingNameEl) greetingNameEl.textContent = currentAdminProfile.name;

        // Atualiza o texto da data
        if (memberSinceEl) memberSinceEl.textContent = currentAdminProfile.memberSince;
    };

    // Carrega a UI inicialmente
    loadAdminProfileUI();

    // ===================================================================
    // DADOS SIMULADOS E VARIÁVEIS DE PAGINAÇÃO (Atualizado com Logs)
    // ===================================================================
    let storedUsers = localStorage.getItem('ecoLogica_Users');
    let simulatedUsers = storedUsers ? JSON.parse(storedUsers) : [
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
    let filteredUserList = [...simulatedUsers];
    let currentUserIdCounter = simulatedUsers.length > 0 ? Math.max(...simulatedUsers.map(u => u.id)) + 1 : 1;
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
        { id: 1, name: "EcoPonto Centro", lat: -26.9179, lng: -49.0740, type: "Papel, Vidro", isActive: true },
        { id: 2, name: "Recicla Eletrônicos Velha", lat: -26.9050, lng: -49.0700, type: "Eletronicos", isActive: true },
        { id: 3, name: "Ponto Sul (Temporário)", lat: -26.9300, lng: -49.0900, type: "Plastico, Papel", isActive: false }
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

    // admin-dashboard.js (Perto da linha ~200, após saveCollectionPoints)

    // NOVO: Função para obter os valores dos checkboxes
    const getSelectedPointTypes = () => {
        // Seleciona todos os checkboxes com a classe 'point-type-checkbox'
        const checkboxes = document.querySelectorAll('.point-type-checkbox');
        const selectedTypes = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedTypes.push(checkbox.value);
            }
        });
        // Retorna os tipos selecionados como uma string separada por vírgula (Ex: "Metal, Papel")
        return selectedTypes.join(', ');
    };

    // NOVO: Função para definir o estado dos checkboxes
    const setPointTypesCheckboxes = (typesString) => {
        // 1. Limpa todas as seleções primeiro
        const checkboxes = document.querySelectorAll('.point-type-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        if (!typesString) return;

        // 2. Define o array de tipos para marcar (Ex: ["Metal", "Papel"])
        const pointTypes = typesString.split(',').map(type => type.trim());

        // 3. Marca os checkboxes correspondentes
        pointTypes.forEach(type => {
            const checkbox = document.querySelector(`.point-type-checkbox[value="${type}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    };

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

                const selectedTypesString = getSelectedPointTypes();

                if (selectedTypesString === '') {
                    alert("Por favor, selecione pelo menos um Tipo de Material.");
                    return; // Impede a submissão
                }

                // Atualiza o campo hidden 'pointType' (embora a função getSelectedPointTypes
                // já esteja sendo usada para newPointData, é bom garantir que a validação 
                // e a coleta ocorram antes.)
                document.getElementById('pointType').value = selectedTypesString;
                // FIM NOVO: LÓGICA DE VALIDAÇÃO E ATUALIZAÇÃO DO CAMPO ESCONDIDO

                const editingId = document.getElementById('pointId').value ? parseInt(document.getElementById('pointId').value) : null;

                const newPointData = {
                    // Se for novo, usa nextPointId++, senão usa o ID existente
                    id: editingId || nextPointId++,
                    // NOVO: Salva o Nome Curto (pointName)
                    name: document.getElementById('pointName').value.trim(),
                    // CORRIGIDO: Salva o Endereço Completo (pointAddress)
                    address: document.getElementById('pointAddress').value.trim(),

                    lat: parseFloat(document.getElementById('pointLat').value),
                    lng: parseFloat(document.getElementById('pointLng').value),
                    type: selectedTypesString, // O valor de tipos selecionados
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
    // NOVA FUNÇÃO: MÁSCARA DE CNPJ
    // ===================================================================
    const setupCNPJMasks = () => {
        const formatCNPJ = (value) => {
            return value
                .replace(/\D/g, '') // Remove tudo o que não é dígito
                .replace(/^(\d{2})(\d)/, '$1.$2') // Coloca ponto após os dois primeiros dígitos
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca ponto após os três próximos
                .replace(/\.(\d{3})(\d)/, '.$1/$2') // Coloca barra após os três próximos
                .replace(/(\d{4})(\d)/, '$1-$2') // Coloca hífen antes dos dois últimos
                .substring(0, 18); // Limita ao tamanho do CNPJ formatado
        };

        const inputs = ['newCompanyCNPJ', 'editCompanyCNPJ'];

        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    e.target.value = formatCNPJ(e.target.value);
                });
                // Limita o tamanho máximo do campo no HTML via JS
                input.maxLength = 18;
            }
        });
    };

    // ===================================================================
    // NOVA FUNÇÃO: MÁSCARA DE TELEFONE
    // ===================================================================
    const setupPhoneMasks = () => {
        const formatPhone = (value) => {
            return value
                .replace(/\D/g, '') // Remove tudo o que não é dígito
                .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses no DDD
                .replace(/(\d)(\d{4})$/, '$1-$2') // Coloca o hífen antes dos últimos 4 dígitos
                .substring(0, 15); // Limita tamanho
        };

        ['newCompanyPhone', 'editCompanyPhone'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    e.target.value = formatPhone(e.target.value);
                });
                input.maxLength = 15;
            }
        });
    };

    // ===================================================================
    // FUNÇÃO: GERENCIA OS FORMULÁRIOS DO MODAL (Dispara Refresh)
    // ===================================================================
    const handleModalCompanyForms = () => {

        // 1. Lógica para ADICIONAR
        const addForm = document.getElementById('addCompanyFormNew');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const newCompany = {
                    id: nextCompanyId++,
                    name: document.getElementById('newCompanyName').value.trim(),
                    email: document.getElementById('newCompanyEmail').value.trim(),
                    phone: document.getElementById('newCompanyPhone').value.trim(),
                    type: document.getElementById('newCompanyType').value,
                    cnpj: document.getElementById('newCompanyCNPJ').value.trim(),
                    address: document.getElementById('newCompanyAddress').value.trim()
                };

                if (!newCompany.name || !newCompany.email || !newCompany.phone || !newCompany.cnpj || !newCompany.address) {
                    alert("Por favor, preencha todos os campos obrigatórios.");
                    return;
                }

                if (newCompany.type === 'recicladora') {
                    simulatedRecyclers.push(newCompany);
                    localStorage.setItem('ecoLogica_Recyclers', JSON.stringify(simulatedRecyclers));
                    renderCompanyList(recyclerListSelector, simulatedRecyclers);
                } else {
                    simulatedSupporters.push(newCompany);
                    localStorage.setItem('ecoLogica_Supporters', JSON.stringify(simulatedSupporters));
                    renderCompanyList(supporterListSelector, simulatedSupporters);
                }

                // *** CORREÇÃO: Dispara o evento para o Modal se atualizar (mantendo paginação) ***
                document.dispatchEvent(new Event('refreshCompanyModal'));
                // ********************************************************************************

                addForm.reset();
                alert("Empresa cadastrada com sucesso!");
            });
        }

        // 2. Lógica para EDITAR
        const editForm = document.getElementById('editCompanyForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const id = parseInt(document.getElementById('editCompanyId').value);
                const type = document.getElementById('editCompanyTypeHidden').value;

                const newName = document.getElementById('editCompanyName').value.trim();
                const newEmail = document.getElementById('editCompanyEmail').value.trim();
                const newPhone = document.getElementById('editCompanyPhone').value.trim();
                const newCNPJ = document.getElementById('editCompanyCNPJ').value.trim();
                const newAddress = document.getElementById('editCompanyAddress').value.trim();

                if (!newName || !newEmail || !newPhone || !newCNPJ || !newAddress) {
                    alert("Todos os campos são obrigatórios.");
                    return;
                }

                let targetArray = (type === 'recicladora') ? simulatedRecyclers : simulatedSupporters;
                const index = targetArray.findIndex(c => c.id === id);

                if (index !== -1) {
                    targetArray[index].name = newName;
                    targetArray[index].email = newEmail;
                    targetArray[index].phone = newPhone;
                    targetArray[index].cnpj = newCNPJ;
                    targetArray[index].address = newAddress;

                    if (type === 'recicladora') {
                        localStorage.setItem('ecoLogica_Recyclers', JSON.stringify(targetArray));
                        renderCompanyList(recyclerListSelector, targetArray);
                    } else {
                        localStorage.setItem('ecoLogica_Supporters', JSON.stringify(targetArray));
                        renderCompanyList(supporterListSelector, targetArray);
                    }

                    alert("Alterações salvas com sucesso!");

                    // *** CORREÇÃO: Dispara o evento para o Modal se atualizar ***
                    document.dispatchEvent(new Event('refreshCompanyModal'));
                    // ************************************************************

                    const listTabBtn = (type === 'recicladora') ? document.getElementById('view-recyclers-tab') : document.getElementById('view-supporters-tab');
                    if (listTabBtn) { const tab = new bootstrap.Tab(listTabBtn); tab.show(); }
                }
            });
        }
    };

    // ===================================================================
    // FUNÇÃO: INICIALIZA OS GRÁFICOS DO ADMIN (Integrado com Dados Reais)
    // ===================================================================
    const initAdminCharts = () => {
        console.log("Inicializando gráficos com dados dinâmicos...");

        if (typeof Chart === 'undefined') {
            console.error("Chart.js não está carregado.");
            return;
        }

        // Configurações Globais
        Chart.defaults.font.family = "'Open Sans', sans-serif";
        Chart.defaults.color = '#555';

        // -------------------------------------------------------
        // 1. PREPARAÇÃO DE DADOS: COLETA POR EMPRESA
        // -------------------------------------------------------
        const companyMap = {};

        // Inicializa todas as recicladoras com 0 pontos
        simulatedRecyclers.forEach(comp => {
            companyMap[comp.name] = 0;
        });

        // Soma os pontos dos logs para cada empresa
        simulatedLogs.forEach(log => {
            // Considera apenas pontos positivos (+) e se a empresa existe
            if (log.company && log.points.toString().includes('+')) {
                // Remove caracteres não numéricos para somar
                const points = parseInt(log.points.replace(/\D/g, '')) || 0;

                // Se a empresa do log está ativa no sistema, soma os pontos
                if (companyMap.hasOwnProperty(log.company)) {
                    companyMap[log.company] += points;
                }
            }
        });

        const companyLabels = Object.keys(companyMap);
        const companyValues = Object.values(companyMap);

        // -------------------------------------------------------
        // 2. PREPARAÇÃO DE DADOS: EVOLUÇÃO MENSAL (Simulada + Real)
        // -------------------------------------------------------
        const monthsLabels = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
        const monthlyData = [0, 0, 0, 0, 0, 0]; // 6 meses

        // Processa os logs reais (Assumindo que os logs atuais são de Outubro)
        simulatedLogs.forEach(log => {
            if (log.points.toString().includes('+')) {
                const date = new Date(log.timestamp);
                const month = date.getMonth(); // 9 = Outubro
                const points = parseInt(log.points.replace(/\D/g, '')) || 0;

                // Mapeia Outubro para o índice 5 do array
                // (Lógica simples para demonstração)
                if (month === 9) monthlyData[5] += points;
                else if (month === 8) monthlyData[4] += points;
            }
        });

        // Preenche meses anteriores com dados fictícios para o gráfico ter histórico visual
        for (let i = 0; i < 5; i++) {
            if (monthlyData[i] === 0) {
                monthlyData[i] = Math.floor(Math.random() * 500) + 200; // Valor aleatório entre 200 e 700
            }
        }

        // -------------------------------------------------------
        // 3. RENDERIZAÇÃO DOS GRÁFICOS
        // -------------------------------------------------------

        // GRÁFICO 1: Coleta por Empresa (ATUALIZADO PARA EXIBIR Kg)
        const companyCtx = document.getElementById('companyCollectionChart')?.getContext('2d');
        if (companyCtx) {
            // Destrói instância anterior se existir
            if (window.companyChartInstance) window.companyChartInstance.destroy();

            window.companyChartInstance = new Chart(companyCtx, {
                type: 'bar',
                data: {
                    labels: companyLabels,
                    datasets: [{
                        label: 'Volume Coletado (Kg)', // <--- MUDOU AQUI
                        data: companyValues,
                        backgroundColor: [
                            'rgba(72, 143, 88, 0.7)',
                            'rgba(44, 88, 54, 0.7)',
                            'rgba(168, 208, 141, 0.7)',
                            'rgba(232, 122, 0, 0.7)'
                        ],
                        borderColor: 'rgba(72, 143, 88, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                // <--- MUDOU AQUI: Agora exibe "Kg" ao passar o mouse
                                label: ctx => ` ${ctx.parsed.x} Kg`
                            }
                        }
                    },
                    scales: {
                        x: { beginAtZero: true }
                    }
                }
            });
        }

        // GRÁFICO 2: Total Reciclado (Linha)
        const totalUserCtx = document.getElementById('totalUserRecyclingChart')?.getContext('2d');
        if (totalUserCtx) {
            if (window.totalUserChartInstance) window.totalUserChartInstance.destroy();

            window.totalUserChartInstance = new Chart(totalUserCtx, {
                type: 'line',
                data: {
                    labels: monthsLabels,
                    datasets: [{
                        label: 'Total Reciclado (Pontos)',
                        data: monthlyData,
                        fill: true,
                        backgroundColor: 'rgba(232, 122, 0, 0.2)', // Laranja transparente
                        borderColor: '#e87a00',
                        borderWidth: 2,
                        tension: 0.3 // Curva suave
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        // GRÁFICO 3: Crescimento de Usuários (Estático - Exemplo)
        const userGrowthCtx = document.getElementById('userGrowthChart')?.getContext('2d');
        if (userGrowthCtx) {
            if (window.userGrowthChartInstance) window.userGrowthChartInstance.destroy();
            window.userGrowthChartInstance = new Chart(userGrowthCtx, { type: 'line', data: { labels: monthsLabels, datasets: [{ label: 'Novos Usuários', data: [15, 22, 18, 30, 25, simulatedUsers.length], borderColor: '#488f58', borderWidth: 2, tension: 0.1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } });
        }

        // GRÁFICO 4: Visitantes (Estático - Exemplo)
        const visitorsCtx = document.getElementById('siteVisitorsChart')?.getContext('2d');
        if (visitorsCtx) {
            if (window.visitorsChartInstance) window.visitorsChartInstance.destroy();
            window.visitorsChartInstance = new Chart(visitorsCtx, { type: 'bar', data: { labels: monthsLabels, datasets: [{ label: 'Visitantes', data: [1100, 1300, 1200, 1500, 1450, 1600], backgroundColor: 'rgba(0, 123, 255, 0.6)' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } });
        }
    };

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
            const row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.points}</td>
                <td><span class="badge ${statusBadgeClass}">${user.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary action-btn" data-user-id="${user.id}" data-action="view" title="Ver Perfil" data-bs-toggle="modal" data-bs-target="#userProfileModal"><i class="fas fa-eye"></i></button>
                    
                    <button class="btn btn-sm btn-outline-secondary action-btn" data-user-id="${user.id}" data-action="edit-data" title="Editar Dados"><i class="fas fa-pencil-alt"></i></button>
                    
                    <button class="btn btn-sm btn-outline-secondary action-btn" data-user-id="${user.id}" data-action="points" title="Add/Rem Pontos"><i class="fas fa-coins"></i></button>
                    <button class="btn btn-sm btn-outline-warning action-btn" data-user-id="${user.id}" data-action="reset_pw" title="Resetar Senha"><i class="fas fa-key"></i></button>
                    <button class="btn btn-sm btn-outline-danger action-btn" data-user-id="${user.id}" data-action="toggle_status" title="${user.status === 'Ativo' ? 'Desativar' : 'Ativar'} Conta"><i class="fas ${user.status === 'Ativo' ? 'fa-user-slash' : 'fa-user-check'}"></i></button>
                </td>
            </tr>`;
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

            case 'edit-data': // <--- NOVO CASE
                const editModalEl = document.getElementById('addEditUserModal');
                const editModal = new bootstrap.Modal(editModalEl);

                // Preenche o form
                document.getElementById('userModalTitle').textContent = "Editar Usuário";
                document.getElementById('userEditId').value = user.id;
                document.getElementById('userNameInput').value = user.name;
                document.getElementById('userEmailInput').value = user.email;
                document.getElementById('userInitialPoints').value = user.points;
                document.getElementById('userInitialPoints').disabled = true; // Protege pontos na edição básica
                document.getElementById('userStatusSelect').value = user.status;

                editModal.show();
                break;

            // *** FIM IMPLEMENTAÇÃO DO MODAL ***
            case 'points':
                const pointsToAdd = prompt(`Ajustar pontos para ${user.name} (${user.points}). Digite (+/-):`, "0");
                if (pointsToAdd !== null) {
                    const points = parseInt(pointsToAdd);
                    if (!isNaN(points)) {
                        user.points += points;
                        // SALVAR NO STORAGE
                        localStorage.setItem('ecoLogica_Users', JSON.stringify(simulatedUsers));

                        console.log(`Pontos atualizados para ${user.points}.`);
                        handleUserSearchAndFilter(true);
                        alert(`Pontos atualizados para ${user.points}.`);
                    } else {
                        alert("Valor inválido.");
                    }
                }
                break;
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
    // NOVA FUNÇÃO: GERENCIA CADASTRO/EDIÇÃO DE USUÁRIOS
    // ===================================================================
    const handleUserForm = () => {
        const form = document.getElementById('addEditUserForm');
        const modalElement = document.getElementById('addEditUserModal');
        const btnOpenAdd = document.getElementById('btnOpenAddUser');

        if (!form || !modalElement) return;

        const modalTitle = document.getElementById('userModalTitle');
        const idInput = document.getElementById('userEditId');
        const nameInput = document.getElementById('userNameInput');
        const emailInput = document.getElementById('userEmailInput');
        const pointsInput = document.getElementById('userInitialPoints');
        const statusSelect = document.getElementById('userStatusSelect');

        // Limpa o form ao abrir para "Novo Usuário"
        if (btnOpenAdd) {
            btnOpenAdd.addEventListener('click', () => {
                form.reset();
                idInput.value = '';
                modalTitle.textContent = "Novo Usuário";
                pointsInput.disabled = false; // Permite definir pontos no cadastro
            });
        }

        // Salvar
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const editingId = idInput.value ? parseInt(idInput.value) : null;

            if (editingId) {
                // EDIÇÃO
                const index = simulatedUsers.findIndex(u => u.id === editingId);
                if (index !== -1) {
                    simulatedUsers[index].name = nameInput.value.trim();
                    simulatedUsers[index].email = emailInput.value.trim();
                    simulatedUsers[index].status = statusSelect.value;
                    // Pontos geralmente editamos pelo botão de moedas, mas se quiser permitir aqui:
                    // simulatedUsers[index].points = parseInt(pointsInput.value); 

                    alert("Usuário atualizado com sucesso!");
                }
            } else {
                // CRIAÇÃO
                const newUser = {
                    id: currentUserIdCounter++,
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    points: parseInt(pointsInput.value) || 0,
                    status: statusSelect.value
                };
                simulatedUsers.push(newUser);
                alert("Usuário criado com sucesso!");
            }

            // Persistência e Atualização
            localStorage.setItem('ecoLogica_Users', JSON.stringify(simulatedUsers));

            // Recarrega a tabela (mantendo filtros se possível, mas resetando a busca simples)
            handleUserSearchAndFilter(true);

            // Fecha modal
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
        });
    };

    // ===================================================================
    // FUNÇÃO: GERENCIA O FORMULÁRIO DE ANÚNCIOS (Criar e Remover)
    // ===================================================================
    const handleAnnouncementForm = () => {
        const form = document.getElementById('announcementForm');
        const btnRemove = document.getElementById('btnRemoveAnnouncement');

        if (!form) { console.warn("Formulário de anúncios não encontrado."); return; }

        // --- PUBLICAR ANÚNCIO ---
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const text = document.getElementById('announcementText').value.trim();
            const type = document.getElementById('announcementType').value;

            if (!text) {
                alert("Por favor, escreva uma mensagem.");
                return;
            }

            // Cria o objeto de dados
            const announcementData = {
                id: Date.now(),
                text: text,
                type: type, // 'info', 'warning', 'success'
                date: new Date().toLocaleDateString('pt-BR'),
                active: true
            };

            // Salva no localStorage para que o site principal possa ler
            localStorage.setItem('ecoLogica_CurrentAnnouncement', JSON.stringify(announcementData));

            console.log("Anúncio publicado:", announcementData);
            alert("Anúncio publicado com sucesso! Ele aparecerá no topo das páginas do site.");
            form.reset();
        });

        // --- REMOVER ANÚNCIO ---
        if (btnRemove) {
            btnRemove.addEventListener('click', () => {
                if (confirm("Tem certeza que deseja remover o anúncio do site?")) {
                    // Remove do storage
                    localStorage.removeItem('ecoLogica_CurrentAnnouncement');
                    alert("Anúncio removido com sucesso.");
                    form.reset();
                }
            });
        }
    };


    // ===================================================================
    // FUNÇÃO: GERENCIA O BANNER PROMOCIONAL (Imagem)
    // ===================================================================
    const handleAdBannerForm = () => {
        const form = document.getElementById('adBannerForm');
        const btnRemove = document.getElementById('btnRemoveAdBanner');

        if (!form) return;

        // --- PUBLICAR BANNER ---
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const imageUrl = document.getElementById('adBannerImage').value.trim();
            const linkUrl = document.getElementById('adBannerLink').value.trim();
            const altText = document.getElementById('adBannerAlt').value.trim();

            if (!imageUrl) {
                alert("A URL da imagem é obrigatória.");
                return;
            }

            const bannerData = {
                id: Date.now(),
                image: imageUrl,
                link: linkUrl || '#',
                alt: altText,
                active: true
            };

            localStorage.setItem('ecoLogica_AdBanner', JSON.stringify(bannerData));

            console.log("Banner publicado:", bannerData);
            alert("Banner de propaganda publicado com sucesso!");
            form.reset();
        });

        // --- REMOVER BANNER ---
        if (btnRemove) {
            btnRemove.addEventListener('click', () => {
                if (confirm("Tem certeza que deseja remover o banner de propaganda?")) {
                    localStorage.removeItem('ecoLogica_AdBanner');
                    alert("Banner removido.");
                    form.reset();
                }
            });
        }
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
            // --- CÓDIGO SIMPLIFICADO AQUI ---
            const listItem = `
        <a href="#" class="list-group-item list-group-item-action py-1 px-2 d-flex justify-content-between align-items-center" data-company-id="${company.id}" data-company-type="${company.type}">
            ${company.name}
            </a>`;
            listElement.innerHTML += listItem;
            // --- FIM DO CÓDIGO SIMPLIFICADO ---
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
    // *** Handler de Clique para Listas de Empresas (ATUALIZADO) ***
    // ===================================================================
    const handleCompanyListClick = (event) => {
        // 1. Encontra o elemento de ação e o item da lista
        const actionBadge = event.target.closest('.badge[data-action]') || event.target.closest('.company-modal-action-btn');
        const listItem = event.target.closest('a.list-group-item');

        if (!actionBadge && !listItem) {
            if (event.target.closest('a[href="#"]')) event.preventDefault();
            return;
        }

        event.preventDefault();

        // 2. Identifica os dados (Dataset)
        const dataTarget = actionBadge ? actionBadge.dataset : event.target.dataset;
        if (!dataTarget.companyId) return;

        const companyId = parseInt(dataTarget.companyId);
        const companyType = dataTarget.companyType;
        const action = dataTarget.action;

        // 3. Encontra a empresa no array correto
        let company;
        if (companyType === 'recicladora') {
            company = simulatedRecyclers.find(c => c.id === companyId);
        } else {
            company = simulatedSupporters.find(c => c.id === companyId);
        }

        if (!company) return;

        // --- LÓGICA DE AÇÃO ---

        if (action === 'edit') {
            // NOVO: Abre o Modal e Preenche o formulário de Edição
            const modalElement = document.getElementById('viewAllCompaniesModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);

                // Preenche os campos do formulário NO MODAL
                document.getElementById('editCompanyId').value = company.id;
                document.getElementById('editCompanyName').value = company.name;
                document.getElementById('editCompanyEmail').value = company.email;
                document.getElementById('editCompanyCNPJ').value = company.cnpj || '';
                document.getElementById('editCompanyAddress').value = company.address || '';

                // Exibe o tipo apenas como texto (não editável neste modo)
                document.getElementById('editCompanyTypeDisplay').innerText = company.type.toUpperCase();
                document.getElementById('editCompanyTypeHidden').value = company.type; // Salva no hidden para usar ao salvar
                document.getElementById('editingCompanyNameDisplay').innerText = company.name;

                // Mostra a aba de edição (que geralmente fica oculta)
                const editTabContainer = document.getElementById('edit-company-tab-container');
                const editTabBtn = document.getElementById('edit-company-tab');

                if (editTabContainer && editTabBtn) {
                    editTabContainer.classList.remove('d-none'); // Remove 'display:none'
                    const tab = new bootstrap.Tab(editTabBtn);
                    tab.show(); // Ativa a aba
                }

                modal.show(); // Abre o modal
            }

        } else if (action === 'delete') {
            // Lógica de exclusão (Mantida igual)
            if (confirm(`Tem certeza que deseja EXCLUIR a empresa "${company.name}"?`)) {
                let arrayToUpdate, storageKey;

                if (companyType === 'recicladora') {
                    simulatedRecyclers = simulatedRecyclers.filter(c => c.id !== companyId);
                    arrayToUpdate = simulatedRecyclers;
                    storageKey = 'ecoLogica_Recyclers';
                } else {
                    simulatedSupporters = simulatedSupporters.filter(c => c.id !== companyId);
                    arrayToUpdate = simulatedSupporters;
                    storageKey = 'ecoLogica_Supporters';
                }

                localStorage.setItem(storageKey, JSON.stringify(arrayToUpdate));

                // Atualiza as listas
                renderCompanyList(recyclerListSelector, simulatedRecyclers);
                renderCompanyList(supporterListSelector, simulatedSupporters);

                // Se estiver dentro do modal, atualiza as tabelas também
                renderCompanyTable('recyclersTableContainer', simulatedRecyclers);
                renderCompanyTable('supportersTableContainer', simulatedSupporters);

                alert("Empresa excluída com sucesso!");
            }
        }
    };


    // admin-dashboard.js (Função renderCompanyTable com Paginação)

    const renderCompanyTable = (containerId, companyArray, currentSortColumn, currentSortDirection, currentPage = 1, totalPages = 1, tableType) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (companyArray.length === 0) {
            container.innerHTML = '<div class="alert alert-info small">Nenhum registro encontrado nesta página.</div>';
            return;
        }

        // Função ícone de ordenação
        const getSortIcon = (columnKey) => {
            if (columnKey !== currentSortColumn) return '<i class="fas fa-sort text-muted ms-1 small" style="opacity: 0.3;"></i>';
            return currentSortDirection === 'asc'
                ? '<i class="fas fa-sort-up text-dark ms-1 small"></i>'
                : '<i class="fas fa-sort-down text-dark ms-1 small"></i>';
        };

        let tableHtml = `
        <div class="table-responsive mb-2">
            <table class="table table-striped table-sm admin-table align-middle" style="table-layout: fixed; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 50px; cursor: pointer;" class="text-center sortable-header" data-sort-key="id">
                            ID ${getSortIcon('id')}
                        </th>
                        <th style="cursor: pointer;" class="sortable-header" data-sort-key="name">
                            Nome ${getSortIcon('name')}
                        </th>
                        <th style="cursor: pointer;" class="sortable-header" data-sort-key="email">
                            Email ${getSortIcon('email')}
                        </th>
                        <th style="cursor: pointer;" class="sortable-header" data-sort-key="phone">
                            Telefone ${getSortIcon('phone')}
                        </th>
                        <th style="cursor: pointer;" class="sortable-header" data-sort-key="cnpj">
                            CNPJ ${getSortIcon('cnpj')}
                        </th>
                        <th style="cursor: pointer;" class="sortable-header" data-sort-key="address">
                            Endereço ${getSortIcon('address')}
                        </th>
                        <th style="width: 110px;" class="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;

        companyArray.forEach(company => {
            const phoneDisplay = company.phone ? company.phone : '-';

            tableHtml += `
            <tr data-company-id="${company.id}" data-company-type="${company.type}">
                <td class="text-center fw-bold">${company.id}</td>
                <td class="text-break">${company.name}</td>
                <td class="text-break">${company.email}</td>
                <td class="text-break">${phoneDisplay}</td>
                <td class="text-break">${company.cnpj || '-'}</td>
                <td class="text-break small">${company.address || '-'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-secondary company-modal-action-btn me-1" data-action="edit" data-id="${company.id}" data-type="${company.type}" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn btn-sm btn-outline-danger company-modal-action-btn" data-action="delete" data-id="${company.id}" data-type="${company.type}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
        });

        tableHtml += `</tbody></table></div>`;

        // --- CONTROLES DE PAGINAÇÃO ---
        if (totalPages > 1) {
            tableHtml += `
            <nav aria-label="Navegação da tabela">
                <ul class="pagination pagination-sm justify-content-end mb-0">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link company-page-link" href="#" data-page="prev" data-table-type="${tableType}">Anterior</a>
                    </li>
            `;

            for (let i = 1; i <= totalPages; i++) {
                tableHtml += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link company-page-link" href="#" data-page="${i}" data-table-type="${tableType}">${i}</a>
                    </li>
                `;
            }

            tableHtml += `
                    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link company-page-link" href="#" data-page="next" data-table-type="${tableType}">Próximo</a>
                    </li>
                </ul>
            </nav>
            `;
        }
        // -------------------------------

        container.innerHTML = tableHtml;
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

        // admin-dashboard.js (Dentro de handlePointsListClick, Linha ~951)

        // ...
        if (actionBadge.dataset.action === 'edit-point') {

            // 1. Prepara o formulário do Modal
            document.getElementById('pointFormTitle').textContent = "Editar Ponto de Coleta";
            document.getElementById('savePointButton').textContent = "Salvar Alterações";

            // 2. Preenche os campos
            document.getElementById('pointId').value = point.id;
            document.getElementById('pointName').value = point.name;    // Carrega o Nome Curto

            // CORRIGIDO: Tenta carregar 'point.address'. Se for undefined (ponto antigo), usa point.name como fallback.
            document.getElementById('pointAddress').value = point.address || point.name;

            document.getElementById('pointLat').value = point.lat;
            document.getElementById('pointLng').value = point.lng;
            setPointTypesCheckboxes(point.type);
            document.getElementById('pointIsActive').checked = point.isActive;

            // 3. Exibe o formulário (se estiver escondido por padrão)
            // ...

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

    // admin-dashboard.js (Perto da Linha ~1000)

    // *** NOVO: Handler de Edição da Lista DENTRO do Modal ***
    const handleModalPointEdit = (event) => {
        const editIcon = event.target.closest('.modal-points-list-scrollable a');
        if (!editIcon) return;

        event.preventDefault();

        // 1. Encontra o Ponto de Coleta
        // O ID é necessário para encontrar o ponto. Como a lista dentro do modal não
        // possui o data-point-id, precisamos re-renderizar a lista do modal (Passo 2)
        // ou usar o ponto clicado para encontrar o ID na lista original.

        // Por simplicidade, vamos usar o ID do ponto que está sendo editado na lista lateral (handlePointsListClick)
        // Se o user está editando DENTRO do modal, ele provavelmente clicou na lista lateral anteriormente.
        // Vamos garantir que a lista do modal tenha o ID.

        // --- LÓGICA REQUER QUE A LISTA DO MODAL TENHA O data-point-id ---
        const pointId = parseInt(editIcon.dataset.pointId);
        const point = simulatedCollectionPoints.find(p => p.id === pointId);

        if (!point) {
            console.error("Ponto de coleta não encontrado para edição no modal.");
            return;
        }

        console.log(`Editando ponto no modal: ${point.name}`);

        // 2. Preenche o Formulário (Reutiliza a lógica de edição)
        document.getElementById('pointId').value = point.id;
        document.getElementById('pointName').value = point.name;
        document.getElementById('pointAddress').value = point.address || point.name;
        document.getElementById('pointLat').value = point.lat;
        document.getElementById('pointLng').value = point.lng;
        setPointTypesCheckboxes(point.type);
        document.getElementById('pointIsActive').checked = point.isActive;

        // 3. Atualiza a UI para modo Edição
        document.getElementById('pointFormTitle').textContent = "Editar Ponto de Coleta";
        document.getElementById('savePointButton').textContent = "Salvar Alterações";
        document.getElementById('pointDetailsFormContainer').style.display = 'block';

        // 4. Centraliza o Mapa no Ponto
        if (fullMapInstance) {
            fullMapInstance.setView([point.lat, point.lng], 17); // Ajusta o zoom para 17

            // Se houver um marcador temporário (de uma busca), removemos
            if (tempNewMarker) {
                fullMapInstance.removeLayer(tempNewMarker);
                tempNewMarker = null;
            }
        }
    };
    // *** FIM handleModalPointEdit ***

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

    // ===================================================================
    // FUNÇÃO: INICIALIZA O EDITOR DE MAPA (Endereço Padronizado e Limpo)
    // ===================================================================
    const initFullMapEditor = () => {
        const mapContainerId = 'full-map-container';
        const formContainer = document.getElementById('pointDetailsFormContainer');
        const pointLatInput = document.getElementById('pointLat');
        const pointLngInput = document.getElementById('pointLng');
        const pointNameInput = document.getElementById('pointName');
        const pointAddressInput = document.getElementById('pointAddress');

        if (typeof L === 'undefined') {
            console.error("Leaflet não carregado.");
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

            // --- FUNÇÃO CENTRAL: BUSCA E FORMATA O ENDEREÇO ---
            const fetchAndFormatAddress = async (lat, lng, suggestedName = "") => {

                // Feedback visual
                updateMarkerAndForm({ lat, lng }, "Formatando endereço...");

                try {
                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
                    const response = await fetch(url, { headers: { 'User-Agent': 'EcoLogicaAdmin/1.0' } });
                    if (!response.ok) throw new Error("Erro na API");
                    const data = await response.json();

                    if (data && data.address) {
                        const addr = data.address;
                        let parts = [];

                        // 1. LOGRADOURO (Com abreviações)
                        let logradouro = addr.road || "";
                        // Mapa de abreviações comuns
                        logradouro = logradouro.replace(/^Avenida/i, 'Av.')
                            .replace(/^Doutor/i, 'Dr.')
                            .replace(/^Engenheiro/i, 'Eng.')
                            .replace(/^Professor/i, 'Prof.')
                            .replace(/^Coronel/i, 'Cel.')
                            .replace(/^General/i, 'Gen.');

                        if (logradouro) parts.push(logradouro);

                        // 2. NÚMERO
                        if (addr.house_number) parts.push(addr.house_number);

                        // 3. COMPLEMENTO / BAIRRO
                        // Às vezes o andar vem em 'flats' ou no nome extra
                        // Vamos montar o bloco do meio: " - Bairro" ou " - Complemento - Bairro"
                        let middleParts = [];

                        // Tenta pegar complemento se disponível (raro na API free, mas preventivo)
                        if (addr.flats) middleParts.push(addr.flats);

                        const bairro = addr.suburb || addr.neighbourhood || addr.city_district || addr.village;
                        if (bairro) middleParts.push(bairro);

                        // Junta logradouro e número com vírgula
                        let finalString = parts.join(', ');

                        // Adiciona o meio com " - "
                        if (middleParts.length > 0) {
                            finalString += ` - ${middleParts.join(' - ')}`;
                        }

                        // 4. CIDADE - ESTADO (Sigla)
                        const cidade = addr.city || addr.town || addr.municipality;
                        let estado = addr.state || "";

                        // Mapa de Estados para Sigla (Adicione outros se precisar)
                        const stateMap = {
                            "Santa Catarina": "SC", "Paraná": "PR", "Rio Grande do Sul": "RS",
                            "São Paulo": "SP", "Rio de Janeiro": "RJ", "Minas Gerais": "MG"
                        };
                        if (stateMap[estado]) estado = stateMap[estado];

                        if (cidade && estado) {
                            finalString += `, ${cidade} - ${estado}`;
                        } else if (cidade) {
                            finalString += `, ${cidade}`;
                        }

                        // 5. CEP
                        if (addr.postcode) {
                            finalString += `, ${addr.postcode}`;
                        }

                        // --- ATUALIZAÇÃO FINAL DO INPUT ---
                        pointAddressInput.value = finalString;

                        // Atualiza Popup
                        if (tempNewMarker) tempNewMarker.setPopupContent(`<b>Local:</b><br>${finalString}`).openPopup();

                        // Sugere nome se vazio (Prioriza o nome do local buscado ou a rua)
                        if (pointNameInput.value.trim() === '' || pointNameInput.value === 'Carregando endereço...' || pointNameInput.value === 'Formatando endereço...') {
                            // Se veio de uma busca (suggestedName), usa o nome do local (ex: Senac)
                            // Se for clique, usa o nome da rua
                            if (suggestedName && !suggestedName.includes(',')) {
                                pointNameInput.value = suggestedName;
                            } else {
                                // Pega a primeira parte do nome sugerido ou o logradouro
                                const shortName = suggestedName ? suggestedName.split(',')[0] : (logradouro || bairro || "Novo Ponto");
                                pointNameInput.value = shortName;
                            }
                        }

                    } else {
                        pointAddressInput.value = "Endereço não identificado";
                    }
                } catch (e) {
                    console.error(e);
                    pointAddressInput.value = "Erro na conexão com mapa";
                }
            };

            // 1. EVENTO DE BUSCA (GEOCODER)
            const geocoder = L.Control.Geocoder.nominatim();
            L.Control.geocoder({
                query: "Blumenau, SC",
                placeholder: "Buscar (Ex: Senac Blumenau)...",
                defaultMarkGeocode: false,
                geocoder: geocoder
            })
                .on('markgeocode', function (e) {
                    // Passa o nome original da busca para usar como sugestão de Nome do Ponto
                    fetchAndFormatAddress(e.geocode.center.lat, e.geocode.center.lng, e.geocode.name);
                })
                .addTo(fullMapInstance);

            // 2. EVENTO DE CLIQUE
            fullMapInstance.on('click', function (e) {
                fetchAndFormatAddress(e.latlng.lat, e.latlng.lng);
            });

        } else {
            fullMapInstance.invalidateSize();
            renderCollectionPointsOnFullMap();
        }

        // Helper simples para posicionar o pino antes do fetch terminar
        function updateMarkerAndForm(latlng, placeholderText) {
            if (tempNewMarker) fullMapInstance.removeLayer(tempNewMarker);

            tempNewMarker = L.marker(latlng, { draggable: true }).addTo(fullMapInstance);
            tempNewMarker.bindPopup(placeholderText).openPopup();

            // Permite arrastar e atualizar novamente
            tempNewMarker.on('dragend', function (e) {
                const newPos = e.target.getLatLng();
                fetchAndFormatAddress(newPos.lat, newPos.lng);
                pointLatInput.value = newPos.lat;
                pointLngInput.value = newPos.lng;
            });

            fullMapInstance.setView(latlng, 16); // Zoom mais próximo ao encontrar
            pointLatInput.value = latlng.lat;
            pointLngInput.value = latlng.lng;
            pointAddressInput.value = placeholderText;

            formContainer.style.display = 'block';
            const checkboxes = document.querySelectorAll('.point-type-checkbox');
            checkboxes.forEach(cb => cb.checked = false);
            document.getElementById('pointIsActive').checked = true;
        }

        const fetchAndFormatAddress = async (lat, lng, suggestedName = "") => {
        };
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

            // ===================================================================
            // *** BLOCO DE POPUP ATUALIZADO (SEM LAT/LNG) ***
            // ===================================================================

            const popupContent = `
            <div style="max-width: 250px;">
                <p class="mb-1"><strong>Ponto:</strong> ${point.name}</p>
                <p class="mb-1"><strong>Endereço:</strong><br>${point.address || 'Endereço Indisponível'}</p>
                <hr style="margin: 5px 0;">
                <p class="mb-1 small">
                    <strong>Status:</strong> ${point.isActive ? '<span class="text-success">Ativo</span>' : '<span class="text-danger">Inativo</span>'}<br>
                    <strong>Materiais:</strong> ${point.type || 'Nenhum'}<br>
                </p>
                </div>
        `;

            // Adicionar pop-up com mais detalhes
            marker.bindPopup(popupContent);
            // ===================================================================

            // Renderizar o item na lista lateral do modal
            if (listContainer) {
                listContainer.innerHTML += `
                <a href="#" class="list-group-item list-group-item-action list-group-item-sm d-flex justify-content-between align-items-center" data-point-id="${point.id}">
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
        // Adicione a referência ao formulário
        const form = document.getElementById('pointDetailsForm');

        // As variáveis 'tempNewMarker' e 'fullMapInstance' são acessíveis globalmente.

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

            // *** NOVO LISTENER: Quando o modal é ocultado/fechado ***
            mapEditorModal.addEventListener('hidden.bs.modal', () => {
                console.log("Modal fechado. Resetando estado do formulário.");

                // Simula a lógica de reset contida em resetFormAndMarker,
                // garantindo que o modo de edição seja sempre limpo.
                const formContainer = document.getElementById('pointDetailsFormContainer');
                if (formContainer) formContainer.style.display = 'none';

                // O form.reset() lida com inputs de texto, rádio, e checkboxes.
                if (form) form.reset();

                // Limpa o ID de edição (campo escondido)
                if (document.getElementById('pointId')) {
                    document.getElementById('pointId').value = "";
                }

                // Reseta os títulos
                if (document.getElementById('pointFormTitle')) {
                    document.getElementById('pointFormTitle').textContent = "Adicionar Novo Ponto";
                }
                if (document.getElementById('savePointButton')) {
                    document.getElementById('savePointButton').textContent = "Salvar Ponto";
                }

                // Remove o marcador temporário se existir
                if (tempNewMarker && fullMapInstance) {
                    fullMapInstance.removeLayer(tempNewMarker);
                    tempNewMarker = null;
                }
            });
            // *** FIM NOVO LISTENER ***
        }
    };


    // ===================================================================
    // FUNÇÃO: GERENCIA O MODAL "VER TODAS" (Correção Definitiva da Aba Editar)
    // ===================================================================
    const handleViewAllCompaniesModal = () => {
        const modalElement = document.getElementById('viewAllCompaniesModal');
        const addCompanyTab = document.getElementById('add-company-tab');
        const recyclersTab = document.getElementById('view-recyclers-tab'); // <--- NOVO
        const supportersTab = document.getElementById('view-supporters-tab'); // <--- NOVO
        const searchInput = document.getElementById('companySearchInput');

        // --- ESTADO DA VISUALIZAÇÃO ---
        let sortCol = 'id';
        let sortDir = 'asc';
        let pageRecyclers = 1;
        let pageSupporters = 1;
        const itemsPerPage = 5;

        if (!modalElement || !addCompanyTab) return;

        // --- FUNÇÃO AUXILIAR: ESCONDER ABA DE EDIÇÃO ---
        const hideEditTab = () => {
            const editTabContainer = document.getElementById('edit-company-tab-container');
            if (editTabContainer) editTabContainer.classList.add('d-none');
        };

        // --- FUNÇÃO CENTRAL DE ATUALIZAÇÃO ---
        const updateView = () => {
            // ... (Lógica de filtro mantida igual) ...
            const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const matchesSearch = (company) => {
                if (!term) return true;
                const nameMatch = company.name.toLowerCase().includes(term);
                const cnpjClean = company.cnpj ? company.cnpj.replace(/\D/g, '') : '';
                const cnpjMatch = (company.cnpj && company.cnpj.includes(term)) || cnpjClean.includes(term);
                return nameMatch || cnpjMatch;
            };

            let filteredRecyclers = simulatedRecyclers.filter(matchesSearch);
            let filteredSupporters = simulatedSupporters.filter(matchesSearch);

            // ... (Lógica de ordenação mantida igual) ...
            const sortFunction = (a, b) => {
                let valA = a[sortCol];
                let valB = b[sortCol];
                if (valA == null) valA = "";
                if (valB == null) valB = "";
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                if (valA < valB) return sortDir === 'asc' ? -1 : 1;
                if (valA > valB) return sortDir === 'asc' ? 1 : -1;
                return 0;
            };
            filteredRecyclers.sort(sortFunction);
            filteredSupporters.sort(sortFunction);

            // ... (Lógica de paginação mantida igual) ...
            // Recicladoras
            const totalPagesRec = Math.ceil(filteredRecyclers.length / itemsPerPage) || 1;
            if (pageRecyclers > totalPagesRec) pageRecyclers = totalPagesRec;
            if (pageRecyclers < 1) pageRecyclers = 1;
            const startRec = (pageRecyclers - 1) * itemsPerPage;
            const endRec = startRec + itemsPerPage;
            const paginatedRecyclers = filteredRecyclers.slice(startRec, endRec);
            renderCompanyTable('recyclersTableContainer', paginatedRecyclers, sortCol, sortDir, pageRecyclers, totalPagesRec, 'recicladora');

            // Apoiadoras
            const totalPagesSup = Math.ceil(filteredSupporters.length / itemsPerPage) || 1;
            if (pageSupporters > totalPagesSup) pageSupporters = totalPagesSup;
            if (pageSupporters < 1) pageSupporters = 1;
            const startSup = (pageSupporters - 1) * itemsPerPage;
            const endSup = startSup + itemsPerPage;
            const paginatedSupporters = filteredSupporters.slice(startSup, endSup);
            renderCompanyTable('supportersTableContainer', paginatedSupporters, sortCol, sortDir, pageSupporters, totalPagesSup, 'apoiadora');
        };

        // Listener para atualização externa (Salvar)
        document.addEventListener('refreshCompanyModal', () => { updateView(); });

        // Listener da Busca
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                pageRecyclers = 1; pageSupporters = 1; updateView();
            });
        }

        // --- LISTENERS DE ABAS (CORREÇÃO AQUI) ---
        // 1. Aba Adicionar: Limpa form novo e esconde editar
        addCompanyTab.addEventListener('shown.bs.tab', () => {
            const newForm = document.getElementById('addCompanyFormNew');
            if (newForm) newForm.reset();
            hideEditTab(); // <--- Usa a função auxiliar
        });

        // 2. Abas de Listagem: TAMBÉM escondem a aba editar agora
        if (recyclersTab) recyclersTab.addEventListener('shown.bs.tab', hideEditTab);
        if (supportersTab) supportersTab.addEventListener('shown.bs.tab', hideEditTab);
        // -----------------------------------------

        // Listener ao Abrir Modal
        modalElement.addEventListener('show.bs.modal', (event) => {
            if (searchInput) searchInput.value = '';
            sortCol = 'id'; sortDir = 'asc';
            pageRecyclers = 1; pageSupporters = 1;

            updateView();

            hideEditTab(); // Esconde aba editar ao abrir
            const editForm = document.getElementById('editCompanyForm');
            if (editForm) editForm.reset();

            const button = event.relatedTarget;
            const rawCompanyType = button ? button.dataset.companyType : null;
            let targetTabId = (rawCompanyType === 'apoiadora') ? 'view-supporters-tab' : 'view-recyclers-tab';
            const targetTabElement = document.getElementById(targetTabId);
            if (targetTabElement) { new bootstrap.Tab(targetTabElement).show(); }
        });

        // Listener Global (Cliques)
        modalElement.addEventListener('click', (event) => {
            // ... (Lógica de Paginação mantida igual) ...
            const pageLink = event.target.closest('.company-page-link');
            if (pageLink) {
                event.preventDefault();
                const li = pageLink.closest('.page-item');
                if (li.classList.contains('disabled') || li.classList.contains('active')) return;
                const targetPage = pageLink.dataset.page;
                const type = pageLink.dataset.tableType;
                let currentPage = (type === 'recicladora') ? pageRecyclers : pageSupporters;
                if (targetPage === 'prev') currentPage = Math.max(1, currentPage - 1);
                else if (targetPage === 'next') currentPage++;
                else currentPage = parseInt(targetPage);
                if (type === 'recicladora') pageRecyclers = currentPage;
                else pageSupporters = currentPage;
                updateView();
                return;
            }

            // ... (Lógica de Ordenação mantida igual) ...
            const header = event.target.closest('.sortable-header');
            if (header) {
                const column = header.dataset.sortKey;
                if (column === sortCol) sortDir = (sortDir === 'asc') ? 'desc' : 'asc';
                else { sortCol = column; sortDir = 'asc'; }
                updateView();
                return;
            }

            // ... (Lógica de Ações mantida igual) ...
            const button = event.target.closest('.company-modal-action-btn');
            if (!button) return;
            event.preventDefault();
            const action = button.dataset.action;
            const companyId = parseInt(button.dataset.id);
            const companyType = button.dataset.type;

            let company;
            if (companyType === 'recicladora') company = simulatedRecyclers.find(c => c.id === companyId);
            else company = simulatedSupporters.find(c => c.id === companyId);
            if (!company) return;

            if (action === 'edit') {
                // Preenche Form
                document.getElementById('editCompanyId').value = company.id;
                document.getElementById('editCompanyName').value = company.name;
                document.getElementById('editCompanyEmail').value = company.email;
                document.getElementById('editCompanyPhone').value = company.phone || '';
                document.getElementById('editCompanyCNPJ').value = company.cnpj || '';
                document.getElementById('editCompanyAddress').value = company.address || '';
                document.getElementById('editCompanyTypeDisplay').innerText = company.type.toUpperCase();
                document.getElementById('editCompanyTypeHidden').value = company.type;
                document.getElementById('editingCompanyNameDisplay').innerText = company.name;

                // Mostra aba
                const editTabContainer = document.getElementById('edit-company-tab-container');
                if (editTabContainer) editTabContainer.classList.remove('d-none');
                const editTabBtn = document.getElementById('edit-company-tab');
                if (editTabBtn) new bootstrap.Tab(editTabBtn).show();

            } else if (action === 'delete') {
                if (confirm(`Tem certeza que deseja EXCLUIR a empresa "${company.name}"?`)) {
                    if (companyType === 'recicladora') {
                        simulatedRecyclers = simulatedRecyclers.filter(c => c.id !== companyId);
                        localStorage.setItem('ecoLogica_Recyclers', JSON.stringify(simulatedRecyclers));
                    } else {
                        simulatedSupporters = simulatedSupporters.filter(c => c.id !== companyId);
                        localStorage.setItem('ecoLogica_Supporters', JSON.stringify(simulatedSupporters));
                    }
                    renderCompanyList(recyclerListSelector, simulatedRecyclers);
                    renderCompanyList(supporterListSelector, simulatedSupporters);
                    updateView();
                    alert("Empresa excluída com sucesso!");
                }
            }
        });
    };

    // ===================================================================
    // NOVA FUNÇÃO: GERENCIA O REGISTRO MANUAL DE LOGS (COLETAS)
    // ===================================================================
    const handleLogForm = () => {
        const form = document.getElementById('addLogForm');
        const modalElement = document.getElementById('addLogModal');
        const btnOpen = document.getElementById('btnOpenAddLog');

        const userSelect = document.getElementById('logUserSelect');
        const companySelect = document.getElementById('logCompanySelect');

        // Função para carregar as listas nos Selects
        const populateSelects = () => {
            // 1. Usuários
            userSelect.innerHTML = '<option value="" selected disabled>Selecione um usuário...</option>';
            simulatedUsers.forEach(u => {
                if (u.status === 'Ativo') { // Só mostra ativos
                    const option = document.createElement('option');
                    option.value = u.name; // Usando nome para simplificar visualização no log
                    option.textContent = `${u.name} (ID: ${u.id})`;
                    userSelect.appendChild(option);
                }
            });

            // 2. Empresas (Apenas Recicladoras fazem sentido para coleta)
            companySelect.innerHTML = '<option value="" selected disabled>Selecione a empresa...</option>';
            simulatedRecyclers.forEach(c => {
                const option = document.createElement('option');
                option.value = c.name;
                option.textContent = c.name;
                companySelect.appendChild(option);
            });
        };

        // Ao abrir o modal, carrega as listas frescas
        if (btnOpen) {
            btnOpen.addEventListener('click', () => {
                populateSelects();
                form.reset();
                // Define data padrão como agora
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                document.getElementById('logDateInput').value = now.toISOString().slice(0, 16);
            });
        }

        // Salvar Log
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const userName = userSelect.value;
                const companyName = companySelect.value;
                const details = document.getElementById('logMaterialInput').value.trim();
                const pointsVal = parseInt(document.getElementById('logPointsInput').value);
                const dateVal = document.getElementById('logDateInput').value;

                if (!userName || !companyName || !details || isNaN(pointsVal)) {
                    alert("Preencha todos os campos obrigatórios.");
                    return;
                }

                // Cria o objeto Log
                const newLog = {
                    id: Date.now(), // ID único baseado no tempo
                    timestamp: dateVal ? dateVal.replace('T', ' ') : new Date().toLocaleString('pt-BR'),
                    user: userName,
                    action: "Registro Material",
                    details: details,
                    points: `+${pointsVal}`, // Formato visual com +
                    company: companyName
                };

                // 1. Adiciona ao array de Logs
                simulatedLogs.unshift(newLog); // Adiciona no começo da lista

                // 2. Atualiza Pontos do Usuário (Opcional, mas recomendável)
                const userIndex = simulatedUsers.findIndex(u => u.name === userName);
                if (userIndex !== -1) {
                    simulatedUsers[userIndex].points += pointsVal;
                    localStorage.setItem('ecoLogica_Users', JSON.stringify(simulatedUsers)); // Salva usuários
                    // Se a tabela de usuários estiver visível, atualize-a:
                    populateUserTable();
                }

                // 3. Atualiza Tabela de Logs na tela
                filteredLogList = [...simulatedLogs]; // Reseta filtro
                currentLogPage = 1;
                populateLogTable();

                // 4. ATUALIZA OS GRÁFICOS! (A mágica acontece aqui)
                initAdminCharts();

                // Fecha e Feedback
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
                alert("Coleta registrada com sucesso! Gráficos e pontos atualizados.");
            });
        }
    };

    // ===================================================================
    // NOVA FUNÇÃO: EXPORTAR DADOS PARA CSV (Excel)
    // ===================================================================
    const setupExportButtons = () => {

        // Função Genérica para Converter JSON em CSV e Baixar
        const downloadCSV = (data, filename, headers) => {
            if (!data || data.length === 0) {
                alert("Não há dados para exportar.");
                return;
            }

            // 1. Cria o cabeçalho do CSV
            const csvRows = [];
            // Mapeia as chaves do objeto para o cabeçalho (ex: "Nome;Email;Status")
            const headerKeys = Object.keys(headers);
            const headerLabels = Object.values(headers);
            csvRows.push(headerLabels.join(';')); // Usa ponto-e-vírgula (padrão Excel BR)

            // 2. Preenche as linhas
            data.forEach(row => {
                const values = headerKeys.map(key => {
                    let val = row[key];
                    // Tratamento para evitar quebras se o texto tiver ; ou quebra de linha
                    if (val === null || val === undefined) val = '';
                    val = String(val).replace(/"/g, '""'); // Escapa aspas duplas
                    return `"${val}"`; // Envolve em aspas
                });
                csvRows.push(values.join(';'));
            });

            // 3. Cria o arquivo Blob
            // \ufeff adiciona o BOM para o Excel reconhecer acentos (UTF-8)
            const csvString = '\ufeff' + csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

            // 4. Dispara o download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // --- BOTÃO 1: EXPORTAR USUÁRIOS ---
        const btnExportUsers = document.getElementById('btnExportUsers');
        if (btnExportUsers) {
            btnExportUsers.addEventListener('click', () => {
                // Define quais colunas queremos exportar e o nome bonito delas
                const headers = {
                    id: 'ID',
                    name: 'Nome Completo',
                    email: 'Email',
                    points: 'Pontos',
                    status: 'Status'
                };
                // Exporta a lista filtrada atual (se quiser exportar tudo, use simulatedUsers)
                const dataToExport = filteredUserList.length > 0 ? filteredUserList : simulatedUsers;
                downloadCSV(dataToExport, 'relatorio_usuarios.csv', headers);
            });
        }

        // --- BOTÃO 2: EXPORTAR LOGS ---
        const btnExportLogs = document.getElementById('btnExportLogs');
        if (btnExportLogs) {
            btnExportLogs.addEventListener('click', () => {
                const headers = {
                    timestamp: 'Data/Hora',
                    user: 'Usuário',
                    action: 'Ação',
                    details: 'Detalhes',
                    points: 'Pontos',
                    company: 'Empresa Envolvida'
                };
                // Exporta a lista filtrada atual
                const dataToExport = filteredLogList.length > 0 ? filteredLogList : simulatedLogs;
                downloadCSV(dataToExport, 'relatorio_logs_reciclagem.csv', headers);
            });
        }

        // --- BOTÃO 3: EXPORTAR EMPRESAS (Merged) ---
        const btnExportCompanies = document.getElementById('btnExportCompanies');
        if (btnExportCompanies) {
            btnExportCompanies.addEventListener('click', () => {
                // Junta as duas listas e adiciona um campo "Categoria"
                const recyclers = simulatedRecyclers.map(c => ({ ...c, category: 'Recicladora' }));
                const supporters = simulatedSupporters.map(c => ({ ...c, category: 'Apoiadora' }));
                const allCompanies = [...recyclers, ...supporters];

                const headers = {
                    id: 'ID',
                    name: 'Razão Social / Nome',
                    category: 'Tipo',
                    email: 'Email',
                    phone: 'Telefone',
                    cnpj: 'CNPJ',
                    address: 'Endereço'
                };

                downloadCSV(allCompanies, 'relatorio_empresas_parceiras.csv', headers);
            });
        }
    };

    // ===================================================================
    // CHAMADAS DE INICIALIZAÇÃO (Atualizado com Logs)
    // ===================================================================

    handleAdminProfileModal();
    initAdminCharts();

    // Usuários
    handleUserForm();
    populateUserTable(); // Popula usuários (página 1 de todos)
    handleUserSearchAndFilter(); // Configura filtros/busca/ações de usuários
    handlePagination(); // Configura paginação de usuários

    // Logs
    handleLogForm();
    populateLogTable(); // Popula logs (página 1 de todos)
    handleLogSearchAndFilter(); // Configura filtros de logs
    handleLogPagination(); // Configura paginação de logs

    // Campanhas
    handleCampaignForm();

    // Configurações Sidebar
    handlePointsSystemForm();
    handleSiteSettingsForm();

    // Anúncios
    handleAnnouncementForm();
    handleAdBannerForm();

    // Empresas
    handleModalCompanyForms();
    setupCNPJMasks();
    setupPhoneMasks();
    renderCompanyList(recyclerListSelector, simulatedRecyclers);
    renderCompanyList(supporterListSelector, simulatedSupporters);

    // Pontos de Coleta
    renderPointsList();
    handleMapEditorButton();

    // *** NOVO: Anexar o Listener para Ações na Lista Lateral ***
    document.querySelector('.collection-points-management-section .list-group-flush')
        .addEventListener('click', handlePointsListClick);
    // *** FIM NOVO ***

    // Inicializações Finais
    setupExportButtons();


    // Chama a inicialização dos mapas
    initAdminMaps();
    handleMapEditorModal();
    handleMapEditorActions();

    // *** NOVO LISTENER: Lidar com a edição DENTRO do Modal ***
    document.querySelector('#mapEditorModal .modal-points-list-scrollable')
        .addEventListener('click', handleModalPointEdit);

    // *** NOVO LISTENER: Lidar com a edição DENTRO do Modal ***
    document.querySelector('#mapEditorModal .modal-points-list-scrollable')
        .addEventListener('click', handleModalPointEdit);

    // *** NOVO: CHAMA O HANDLER DO MODAL DE EMPRESAS ***
    handleViewAllCompaniesModal();


    // Chamar outras funções de inicialização aqui

}); // Fim do DOMContentLoaded