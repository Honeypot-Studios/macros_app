import { useState } from 'react'
import { supabase } from './supabaseClient.js'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) console.error('Error:', error.message)
    else console.log('User created:', data)
  }

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) console.error('Error:', error.message)
    else console.log('Logged in:', data)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <h2>Auth</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

function DataTest() {
  const [items, setItems] = useState([])

  const addItem = async () => {
    const { data, error } = await supabase
      .from('Testing')
      .insert([
        { working: true }
      ])
      .select()
    
    if (error) console.error('Error:', error)
    else console.log('Added:', data)
  }

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('Testing')
      .select('*')
    
    if (error) console.error('Error:', error)
    else {
      console.log('Fetched:', data)
      setItems(data)
    }
  }

  return (
    <div>
      <h2>Test Database</h2>
      <button onClick={addItem}>Add Item (working=true)</button>
      <button onClick={fetchItems}>Fetch All Items</button>
      
      <h3>Items:</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            ID: {item.id} - Working: {item.working ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <Auth />
      <DataTest />
    </>
  )
}

export default App
