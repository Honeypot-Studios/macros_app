import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient.js'

import ListFood from './ListFood.jsx'
import useFoodStore from '../utils/useFoodStore.js'
import useUserStore from '../utils/useUserStore.js'


export default function Dashboard() {
    const navigate = useNavigate()

    const userID = useUserStore((state) => state.userID)
    const setUserID = useUserStore((state) => state.setUserID)
    const getSession = useUserStore((state) => state.getSession)

    const fetchDaily = useFoodStore((state) => state.fetchDaily)
    const dailyEntries = useFoodStore((state) => state.dailyEntries)
    const calculateDailyTotal = useFoodStore((state) => state.calculateDailyTotal)

    useEffect(() => {
        document.title = "Macros App | Dashboard"

        const handleDataFetch = async() => {
            try {
                const userID = await getSession(navigate)

                if (!userID) {
                    console.warn('Issue with fetching userID')
                    return
                }
                fetchDaily(userID)
            }
            catch (error) {
                console.error('Error encountered:', error.message)
                return
            }
        }
        handleDataFetch()
    }, [navigate])

    const handleDailyTotal = useMemo(() => {
        return calculateDailyTotal(dailyEntries)
    }, [dailyEntries])

    const handleSignOut = async () => {
        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) console.error('Error signing out:', signOutError.message)
        else {
            console.log('Signed out successfully')
            setUserID(null)
            navigate('/')
        }
    }
    
    return (
        <>
        <div>
            <h2>Dashboard</h2>
            <button onClick={() => navigate('/ViewFood')}>View Food Library</button>
        </div>
        <ListFood 
            userID={userID}
            activeView={dailyEntries}
        />
        <div>
            <h3>Today's totals</h3>
            <p>Calories: {handleDailyTotal.calories}</p>
            <p>fat: {handleDailyTotal.fat}</p>
            <p>carbs: {handleDailyTotal.carbs}</p>
            <p>protein: {handleDailyTotal.protein}</p>
        </div>
        <div>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={() => navigate('/UserProfile')}>Profile</button>
        </div>
        </>
    )
}
