import { useEffect, useState } from 'react';
import {fetchTodos, createTodo, updateTodo, toggleTodo, deleteTodo} from './api'

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');


  async function load(){
    setLoading(true);
    try {
      const data = await fetchTodos();
      console.log('Fetched todos:', data); // Debug log
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setTodos([]);
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

  console.log(todos)

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
      const res = await fetch(`http://localhost:3000/api/todos?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      // Filter todos on the client side as well, in case the backend doesn't filter
      const filtered = Array.isArray(data)
      ? data.filter(todo => todo.text.toLowerCase().includes(q.toLowerCase()))
      : [];
      setTodos(filtered);
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleSearch} style={{display: 'flex', gap:8, marginBottom: 16}}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder='Search todos...'
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 8}}
        />
        <button type="submit" style={{ padding: '10px 14px', borderRadius: 8 }}>Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ): todos.length === 0 ? (
        <p>No todos yet</p>
      ): (
        <ul style={{ listStyle: 'none', padding: 0}}>
          {todos.map((t) => {
          
            return ( 
              <li key={t._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 10, 
                border: '1px solid #eee',
                borderRadius: 8,
                marginBottom: 8

                }}>
                  <input 
                    type="checkbox" 
                    checked={t.completed}
                    onChange={() => handleToggle(t._id)}
                  />
                  <span
                    style={{
                      flex : 1,
                      textDecoration: t.completed ? 'line-through': 'none', color : t.completed ? '#888' : '#000'
                    }}
                  >
                    {t.text}
                  </span>
                  <button onClick={() => handleEdit(t._id)}>Edit</button>
                  <button onClick={() => handleDelete(t._id)}>Delete</button>
              </li>
            )}
          )}
        </ul>
      )}
    </div>
  )
}


export default App