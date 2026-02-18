import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'

import MacroTotal from './components/MacroTotal'
import CalculateDailyGoal from './components/CalculateDailyGoal'
import FoodLogPopUp from './components/FoodLogPopUp'
import './dashboard.css'

function Dashboard() {
    const navigate = useNavigate();
    
    const [userID, setUserID] = useState(null)
    const [userData, setUserData] = useState(null)
    const [items, setItems] = useState([])  // User's food log
    const [todayItems, setTodayItems] = useState([])

    const [loading, setLoading] = useState(true)
    const [isPopUpOpen, setIsPopUpOpen] = useState(false)

    useEffect(() => {
        document.title = "MacrosApp | Dashboard"
        
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (session) {
                    setUserID(session.user.id)
                    fetchUserData(session.user.id)
                    fetchUserFoodData(session.user.id)
                }
                else {
                    if (error) console.error('Error fetching session:', error)
                    navigate('/')                
                }
            } catch (error) {
                console.error('Error encountered:', error)
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        getSession()

    }, [navigate])

    const fetchUserData = async (uid) => {
        const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', uid)
        .single()

        if (userError) console.log('Invalid User', userError)
        else {
            console.log('Retrieved User Data', user)
            setUserData(user)
        }
    }
    
    const fetchUserFoodData = async (uid) => {
        const { data: foodLog, foodError } = await supabase
        .from('Food Log')
        .select('*')
        .eq('user_id', uid)

        if (foodError) console.log('Error retrieving Food Log', foodError)
        else {
            console.log('Retrieved Food Log', foodLog)
            setItems(foodLog)
            console.log(foodLog)

            const today = new Date().toISOString().split('T')[0]
            const filteredToday = foodLog.filter(item => item.created_at.startsWith(today))
            setTodayItems(filteredToday)
        }
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) console.error('Error signing out:', error)
        else {
            console.log('Signed out successfully')
            setUserID(null)
            navigate('/')
        }
    }

    if (loading) {
        return (
            console.log('Loading session...'),
            <div>Loading...</div>
        )
    }

    return (
        <>
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleSignOut}>Go Back to log in</button>
        </div>
        <CalculateDailyGoal
            items={items}
            userData={userData}
        />

        <div>
            <button onClick={() => setIsPopUpOpen(true)}>Add Food</button>
            <FoodLogPopUp
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                userID={userID}
                items={items}
                todayItems={todayItems}
                setItems={setItems}
                setTodayItems={setTodayItems}
            />
        </div>
        <MacroTotal items={todayItems}/>
        </>
    )
}

export default Dashboard