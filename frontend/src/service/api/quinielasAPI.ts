import type { 
    CrearQuinielaRequest, 
    QuinielaResponse, 
    UnirseQuinielaRequest,
    HacerPrediccionesRequest 
} from '../../types/QuinielaType';

const API_BASE_URL = 'http://localhost:8080/cc/quinielas';

// Función auxiliar para manejar las respuestas
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
};

// Función auxiliar para obtener headers con autenticación
const getHeaders = () => {
    const token = localStorage.getItem('authToken') || 'Bearer test-token';
    return {
        'Content-Type': 'application/json',
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
    };
};

export const quinielasAPI = {
    // Crear una nueva quiniela
    crear: async (request: CrearQuinielaRequest): Promise<QuinielaResponse> => {
        const response = await fetch(`${API_BASE_URL}/crear`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });
        return handleResponse(response);
    },

    // Obtener quinielas públicas
    obtenerPublicas: async (): Promise<QuinielaResponse[]> => {
        const response = await fetch(`${API_BASE_URL}/publicas`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Obtener mis quinielas creadas
    obtenerMisQuinielas: async (): Promise<QuinielaResponse[]> => {
        const response = await fetch(`${API_BASE_URL}/mis-quinielas`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Obtener mis participaciones
    obtenerMisParticipaciones: async (): Promise<QuinielaResponse[]> => {
        const response = await fetch(`${API_BASE_URL}/mis-participaciones`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // Obtener una quiniela por ID
    obtenerPorId: async (id: number): Promise<QuinielaResponse> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },    // Unirse a una quiniela
    unirse: async (request: UnirseQuinielaRequest): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/unirse`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });
        return handleResponse(response);
    },

    // Hacer predicciones
    hacerPredicciones: async (request: HacerPrediccionesRequest): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/predicciones`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
        });
        return handleResponse(response);
    },

    // Distribuir premios (solo para creadores)
    distribuirPremios: async (quinielaId: number): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/distribuir-premios/${quinielaId}`, {
            method: 'POST',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};
