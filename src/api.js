import axios from 'axios';


const api = axios.create({
    baseURL: '/api',
    headers: {'Content-Type': 'application/json'}
})


export const fetchTodos = () => api.get('/todos').then(res => res.data)
export const createTodo = (text) => api.post('/todos', {text}).then(res => res.data) 
export const updateTodo = (id, payload) => api.patch(`/todos/${id}`, payload).then(res => res.data)
export const toggleTodo = (id) => api.patch(`/todos/${id}/toggle`).then(res => res.data);
export const deleteTodo = (id) => api.delete(`/todos/${id}`).then(res => res.data);
