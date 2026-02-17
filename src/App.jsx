import { useState } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'
import './App.css'

function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.error('Error signing in:', error.message)
      return
    }
    console.log('Logged in:', data)
    navigate('/dashboard')
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
        <button type="submit">Sign In</button>
        <button type="button" onClick={() => navigate('/signup')}>Sign Up</button> 
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
