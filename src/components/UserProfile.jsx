// Implement profile component
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../utils/supabaseClient"

import useUserStore from "../utils/useUserStore"


export default function UserProfile() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    //const userID = useUserStore((state) => state.userID)
    const userData = useUserStore((state) => state.userData)
    const fetchUserData = useUserStore((state) => state.fetchUserData)
    const getSession = useUserStore((state) => state.getSession)

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        document.title = "Macros App | Profile"

        const handleDataFetch = async() => {
            try {
                const userID = await getSession(navigate)

                if (!userID) {
                    console.warn('Issue with fetching userID')
                    return
                }
                await fetchUserData(userID)
            } 
            catch (error) {
                console.error('Error encountered:', error.message)
                return
            }
        }
        handleDataFetch()
        //console.log('userData:', userData)
    }, [navigate])

    const updatePassword = async (newPassword, confirmPassword) => {
        setLoading(true)

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            console.error('Failed to update password:', error.message)
            setLoading(false)
            return
        }

        //console.log('Password successfully updated')
        setLoading(false)
        setNewPassword('')
        setConfirmPassword('')
    }

    return (
        <>
        <div>
            <h3>This is the User Profile!</h3>
        </div>
        <div>
            <ul>
                <li key={userData.id}>
                    Username: {userData.username}
                    - Age: {userData.age}
                    - Gender: {userData.gender}
                    - Email: {userData.user_email}
                </li>
            </ul>
        </div>
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                updatePassword(newPassword, confirmPassword)
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
                    <button type="submit" disabled={loading}>
                        {loading ? 'Changing...' : 'Change'}
                    </button>
                </div>
            </form>
        </div>
        <div>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        </>
    )
}