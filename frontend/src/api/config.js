import axios from 'axios';

// Создаём экземпляр axios с настройками
const api = axios.create({
    baseURL: '/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехватчик для ошибок
api.interceptors.response.use(
    (response) => response.data, // Успешный ответ – возвращаем только данные
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error; // Пробрасываем ошибку дальше
    }
);

export default api;