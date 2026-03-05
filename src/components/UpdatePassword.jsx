import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import useUserStore from '../utils/useUserStore'


export default function UpdatePassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    
    const userID = useUserStore((state) => state.userID)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        document.title = 'Macros App | Update Password'
    }, [navigate])
    
    const handlePasswordReset = async (newPassword, confirmPassword) => {
        setLoading(true)
        setMessage('')
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            console.error('Error reseting password', error.message)
            setMessage(`Error reseting password. Error: ${error.message}`)
            setLoading(false)
            return
        }

        setMessage('Updated passsword! Redirecting...')
        setLoading(false)
        navigate('/')
        setNewPassword('')
        setConfirmPassword('')
    }

    return (
        <>
            <div>
                <h2>Reset Password</h2>
                <p>Enter new password below</p>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handlePasswordReset(newPassword, confirmPassword)
                }}>
                    <input 
                        type='password'
                        placeholder='New password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <div>
                        <input 
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button type='submit' disabled={loading}>
                            {loading ? 'Updating...' : 'Confirm'}
                        </button>
                    </div>
                </form>
                <div>
                    {message && <p>{message}</p>}
                </div>
                <div>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        </>
    )
}