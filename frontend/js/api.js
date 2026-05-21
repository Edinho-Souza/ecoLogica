function resolveApiBaseUrl() {
    if (window.API_BASE_URL) {
        return window.API_BASE_URL.replace(/\/$/, '');
    }

    const hostname = window.location.hostname || 'localhost';
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${hostname}:8080/api`;
}

const API_BASE_URL = resolveApiBaseUrl();
window.API_BASE_URL = API_BASE_URL;

async function apiFetch(endpoint, method = 'GET', body = null, options = {}) {
    const token = localStorage.getItem('user_token');
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

    if (token && !options.skipAuth) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body !== null && body !== undefined) {
        config.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch (error) {
        throw new Error(`Nao foi possivel conectar ao backend em ${API_BASE_URL}. Inicie a API Spring Boot e confira se a URL configurada esta correta.`);
    }
    const text = await response.text();
    const data = text ? safeJson(text) : {};

    if (response.status === 401 || response.status === 403) {
        if (!options.skipAuthRedirect) {
            logout();
        }
        throw new Error(data.message || 'Sessao expirada ou acesso negado.');
    }

    if (!response.ok) {
        throw new Error(data.message || `Erro HTTP ${response.status}`);
    }

    return data;
}

function safeJson(text) {
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

function saveSession(loginResponse) {
    localStorage.setItem('user_token', loginResponse.token);
    localStorage.setItem('user_id', loginResponse.id);
    localStorage.setItem('username', loginResponse.nome || loginResponse.email);
    localStorage.setItem('user_email', loginResponse.email);
    localStorage.setItem('user_role', loginResponse.tipoUsuario);
    localStorage.setItem('isLoggedIn', 'true');
}

function getSession() {
    return {
        token: localStorage.getItem('user_token'),
        id: localStorage.getItem('user_id'),
        name: localStorage.getItem('username'),
        email: localStorage.getItem('user_email'),
        role: localStorage.getItem('user_role')
    };
}

function requireLogin() {
    const session = getSession();
    if (!session.token || !session.id) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage !== 'index.html') {
            window.location.href = 'index.html';
        }
        return null;
    }
    return session;
}

function redirectByRole(role) {
    if (role === 'admin') {
        window.location.href = 'admin.html';
        return;
    }
    if (role === 'recicladora') {
        window.location.href = 'empRecicladora.html';
        return;
    }
    window.location.href = 'usuario.html';
}

function logout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage !== 'index.html') {
        window.location.href = 'index.html';
    }
}
