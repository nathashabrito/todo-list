const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('Fazendo requisição para:', url);
    console.log('Config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log('Resposta recebida:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Autenticação (simulada localmente)
  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const token = 'fake-token-' + Date.now();
    localStorage.setItem('authToken', token);
    
    return {
      user: { email, name: email.split('@')[0] },
      token
    };
  }

  async register(name, email, password) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const token = 'fake-token-' + Date.now();
    localStorage.setItem('authToken', token);
    
    return {
      user: { email, name },
      token
    };
  }

  async logout() {
    localStorage.removeItem('authToken');
    return { success: true };
  }

  // Tarefas
  async getTasks() {
    const response = await this.request('/api/todos'); // <-- corrigido
    return response.todos || [];
  }

  async createTask(title) {
    return await this.request('/api/todos', { // <-- corrigido
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async updateTask(id, updates) {
    return await this.request(`/api/todos/${id}`, { // <-- corrigido
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id) {
    return await this.request(`/api/todos/${id}`, { // <-- corrigido
      method: 'DELETE',
    });
  }
}

const apiService = new ApiService();
export default apiService;
