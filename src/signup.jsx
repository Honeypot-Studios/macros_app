import { useState } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'

function signUp() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [heightFeet, setHeightFeet] = useState('')
    const [heightInches, setHeightInches] = useState('')
    const [weight, setWeight] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('')

    const handleSignUp = async () => {
        setLoading(true)    // Prevent multiple submissions

        const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                // When adding new data match string to left of ":"
                // in the "Handle new user trigger" in SQL Editor
                height_feet: heightFeet,
                height_inches: heightInches,
                weight_lbs: weight,
                age: age, 
                gender: gender
                }
            }
    })

        if (error) {
            console.error('Error signing up:', error.message)
            setLoading(false)
            return
        }
        console.log('Signed up:', data)
        navigate('/dashboard')
    }

    return (
        <>
        <h2>Sign Up</h2>
        <form onSubmit={(e) => {
        e.preventDefault()
        handleSignUp()
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
        <input
            type="number"
            placeholder="Height (feet)"
            value={heightFeet}
            onChange={(e) => setHeightFeet(e.target.value)}
            required
        />
        <input
            type="number"
            placeholder="Height (inches)"
            value={heightInches}
            onChange={(e) => setHeightInches(e.target.value)}
            required
        />
        <input
            type="number"
            placeholder="weight (lbs)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
        />
        <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
        />
        <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
        >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        <div style={{ display: 'flex', gap: '10px', margin: '10px',
            placeContent: 'center' }}> 
            <button type="submit" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button> 
            <button type="button" onClick={() => navigate('/')} >Go Back</button>
        </div>
        </form>
        </>
    )
}

export default signUp

/* Code Graveyard
    const handleUserData = async (newUserID) => {
        const { data, error } = await supabase
        .from('users')
        .upsert([
            {
            user_id: newUserID,
            height_feet: parseInt(heightFeet),
            height_inches: parseInt(heightInches),
            weight_lbs: parseFloat(weight),
            age: parseInt(age),
            gender: gender
            }
        ], { onConflict: 'user_id' })

        if (error) {
            console.error('Error saving user data:', error.message)
            setLoading(false)
            return
        }
        console.log('User data saved:', data)
        navigate('/dashboard')
    }
*/