import api from './config';

export function getPet() {
    return api.get('/pet'); // axios сам преобразует ответ в JSON
}

export function savePet(petData) {
    return api.put('/pet', petData); // тело запроса передаётся напрямую
}

export function deletePet() {
    return api.delete('/pet');
}