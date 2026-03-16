import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'


export default function UpdatePassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        document.title = 'Macros App | Update Password'
    }, [navigate])
    
    const handlePasswordChange = async () => {
        
        setLoading(true)
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match')
            setLoading(false)
            setNewPassword('')
            setConfirmPassword('')
            return false
        }
        
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        setNewPassword('')
        setConfirmPassword('')
        if (error) {
            ErrorLogger('useUserStore.jsx - changePassword', error)
            return false
        }

        setLoading(false)
        navigate('/')

    }

    return (
        <>
            <div>
                <p>Enter new password below</p>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handlePasswordChange()
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
            </div>
        </>
    )
}
