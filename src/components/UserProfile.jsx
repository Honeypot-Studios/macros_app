// Implement profile component
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../utils/supabaseClient"

import useUserStore from "../utils/useUserStore"
import { ErrorLogger } from "../utils/Debug"

/*=======================================================*/
//   ToDo
//*     - App Settings
//          - unit preference (e.g. metric or imperial)
//      - Profile pic (maybe)
//*     - Account Management
//          - Delete Account option
//          - Display and change username
//          - Change email (send confirmation to new email)
/*=======================================================*/
export default function UserProfile() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const userID = useUserStore((state) => state.userID)
    const setUserID = useUserStore((state) => state.setUserID)
    const userData = useUserStore((state) => state.userData)
    const fetchUserData = useUserStore((state) => state.fetchUserData)
    const getSession = useUserStore((state) => state.getSession)

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [accountDelBool, setAccountDelBool] = useState(false)

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
                ErrorLogger('UserProfile.jsx - handleDataFetch', error)
                return
            }
        }
        handleDataFetch()
        //console.log('userData:', userData)
    }, [navigate])

    const handleUpdatePassword = async () => {
        
        setLoading(true)
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match')
            setLoading(false)
            setNewPassword('')
            setConfirmPassword('')
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        setNewPassword('')
        setConfirmPassword('')
        if (error) {
            ErrorLogger('UserProfile.jsx - handleUpdatePassword', error)
            setLoading(false)
            return
        }
        setLoading(false)

    }

    // Soft delete
    const handleAccountDelete = async () => {

        if (!accountDelBool || !userID) {
            console.warn('Issue encountered when deleting.')
            return
        }

        const todayDateISO = new Date().toISOString()
        const { error: deleteError } = await supabase
        .from('User Profiles')
        .update([
            {
                deleted_at: todayDateISO
            }
        ])
        .eq('user_id', userID)
        .select()
        
        if (deleteError) {
            ErrorLogger('UserProfile.jsx - handleAccountDelete', deleteError)
            return
        }

        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) {
            ErrorLogger("UserProfile.jsx - handleAccountDelete", signOutError)
            return
        }
        setUserID(null)
        navigate('/')

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
                handleUpdatePassword()
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
            {(!accountDelBool) ? 
                <button onClick={() => setAccountDelBool(true)}>
                    Delete Account
                </button> : 
                <>
                    <p>Are you sure?</p>
                    <button onClick={() => handleAccountDelete()}>Yes</button>
                    <button onClick={() => setAccountDelBool(false)}>No</button>
                </>
            }
        </div>
        <div>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        </>
    )
}
