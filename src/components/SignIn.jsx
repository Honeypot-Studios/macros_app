import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient.js'
import { useNavigate } from 'react-router-dom'

import useUserStore from '../utils/useUserStore.js'


export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const checkDelete = useUserStore((state) => state.checkDelete)

    useEffect(() => {
        document.title = "Macros App | Sign In"
    }, [navigate])

  const handleSignIn = async (email, password) => {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (signInError) {
      console.error('Error signing in:', signInError.message)
      return
    }

    if (await checkDelete(signInData.user.id)) {
      alert('Account is inactive.')
      setEmail('')
      setPassword('')
      return
    }

    navigate('/Dashboard')
    setEmail('')
    setPassword('')
  }

  return (
    <>
      <div>
        <h3>Macros App</h3>
        <h2>Please sign in or sign up</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSignIn(email, password)
          }}
          className={{
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
          <div className={{ display: 'flex', gap: '10px', margin: '10px',
            placeContent: 'center' }}> 
            <button type="submit">Sign In</button>
            <button type="button" onClick={() => navigate('/SignUp')}>Sign Up</button>
          </div>
        </form>
        <div>
            <button type="button" onClick={() => navigate(-1)}>Go Back</button>
        </div>
        <div>
          <p onClick={() => navigate('/ForgotPassword')} className={{ cursor: 'pointer', color: 'blue' }}>
            Forgot Password
          </p>
        </div>
      </div>
    </>
  )
}
