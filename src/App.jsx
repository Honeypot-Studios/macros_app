import { useState } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'
import './App.css'

function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) console.error('Error:', error.message)
    else {
      console.log('User created:', data)
      navigate('/dashboard')
    }
  }

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) console.error('Error:', error.message)
    else {
      console.log('Logged in:', data)
      navigate('/dashboard')
    }
  }

  return (
    <>
    <div>
      <h1>MacrosApp</h1>
      <h2>Please sign in or sign up</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSignIn()
        }}
        style={{
          display: 'flex',
          gap: '10px',
          margin: '10px',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      <div style={{ display: 'flex', gap: '10px', margin: '10px',
        placeContent: 'center' }}> 
        <button type="submit" onClick={handleSignIn}>Sign In</button> 
        <button type="button" onClick={handleSignUp}>Sign Up</button>
      </div>
      </form>
    </div>
    </>
  )
}

function App() {

  return (
    <>
    <Auth />
    </>
  )
}

export default App


/*
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
}*/
