// Endereço do seu Backend Spring Boot
const API_BASE_URL = "http://localhost:8080/api";

// Função genérica para fazer requisições
async function apiFetch(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('user_token');
    
    const headers = {
        'Content-Type': 'application/json'
    };

    // Se tiver token salvo, adiciona no cabeçalho
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Se der erro de autenticação (403/401), desloga o usuário
        if (response.status === 403 || response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            logout();
            return null;
        }

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        // Se a resposta não tiver conteúdo (ex: delete), não tenta converter json
        const text = await response.text();
        return text ? JSON.parse(text) : {};

    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
}

// Função para decodificar o JWT e pegar o tipo de usuário (role)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function logout() {
    localStorage.removeItem('user_token');
    window.location.href = 'index.html'; // Ou sua tela de login
}