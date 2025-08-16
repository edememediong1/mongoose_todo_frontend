import React from 'react';
import { useEffect, useState } from 'react';
import {fetchTodos, createTodo, updateTodo, toggleTodo, deleteTodo} from './api'

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState('');
  const [q, setQ] = useState('');

  async function load(){
    setLoading(true);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load();}, [])

  async function addTodo(e) {
    e.preventDefault();

    if(!text.trim()) return;

    const newTodo = await createTodo(text.trim());
    setTodos([newTodo, ...todos]);
    setText('');
  }

  async function handleToggle(id) {
    const updated = await toggleTodo(id);
    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  async function handleDelete(id){
    await deleteTodo(id);
    setTodos(todos.filter(t => t._id !== id))
  }

  async function handleEdit(id){
    const current = todos.find(t => t._id === id);
    const newText = prompt('Edit todo text', current.text);

    if (newText == null) return;

    const updated = await updateTodo(id, {text: newText});
    setTodos(todos.map(t => t._id === id ? updated : t))
  }


  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/todos?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setTodos(data);
    } finally {setLoading(false);}
  }

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', fontFamily: 'system-ui, sans-serif'}}>
      <h1 style={{ marginBottom: 16}}>📝 Todos</h1>


      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8, marginBottom: 16}}>
        <input 
          value={text} 
          onChange={ e => setText(e.target.value)}
          placeholder='Add a todo...'
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 8 }}
        />
        <button type='submit' style={{ padding: '10px 14px', borderRadius: 8}}>Add</button>
      </form>
    </div>
  )
}

export default App