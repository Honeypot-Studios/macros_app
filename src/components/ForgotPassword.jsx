import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../utils/supabaseClient"


export default function ForgotPassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const [email, setEmail] = useState('')

    useEffect(() => {
        document.title = 'Macros App | Forgot Password'
    }, [navigate])

    const sendResetEmail = async (userEmail) => {
        setLoading(true)
        if (!userEmail) {
            console.warn('Issue with userEmail')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
            redirectTo: 'http://localhost:5173/ResetPassword',
        })
        
        if (error) {
            console.error('Error when sending reset email!', error.message)
            setLoading(false)
            return
        }
        console.log('Password reset email sent!')
        setLoading(false)
        setEmailSent(true)
        setEmail('')
    }

    return (
        <>
        <div>
            <h2>Forgot Password?</h2>
            {emailSent ? 
            <h3>Email has been sent! Please exit out of page.</h3> : (
                <>
                <p>Please enter email for account so we can send a reset link.</p>
                <form
                onSubmit={(e) => {
                    e.preventDefault()
                    sendResetEmail(email)
                }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div>
                        <button type='submit' disabled={loading}>
                            {loading ? 'Sending Email...' : 'Send Email'}
                        </button>
                    </div>
                </form>
                </>
            )}
        </div>
        <div>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        </>
    )
}