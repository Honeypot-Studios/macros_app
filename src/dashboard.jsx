import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'

import MacroTotal from './components/MacroTotal'
import CalculateDailyGoal from './components/CalculateDailyGoal'
import FoodLogPopUp from './components/FoodLogPopUp'
import './dashboard.css'

function Dashboard() {
    const navigate = useNavigate();
    const [userDataLoading, setUserDataLoading] = useState(true)
    const [isPopUpOpen, setIsPopUpOpen] = useState(false)    
    
    const [uid, setUID] = useState(null)
    const [userData, setUserData] = useState(null)

    const [foodLibrary, setFoodLibrary] = useState([])
    const [dailyEntries, setDailyEntries] = useState([])

    useEffect(() => {
        document.title = "MacrosApp | Dashboard"
        
        const getSession = async () => {
            try {
                const { data: {session} , sessionError } = await supabase.auth.getSession()
                if (!session) {
                    console.error('Error fetching session:', sessionError)
                    navigate('/')
                }
                setUID(session.user.id)
                fetchUserData(session.user.id)
                fetchUserFoodData(session.user.id)
            } catch (error) {
                console.error('Error encountered:', error)
                navigate('/')
            } finally {
                setUserDataLoading(false)
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

        if (userError) {
            console.log('Invalid User', userError)
            return
        }

        console.log('Retrieved User Data', user)
        setUserData(user)
    }
    
    const fetchUserFoodData = async (uid) => {
        const { data: foodLog, foodError } = await supabase
        .from('Food Log')
        .select('*')
        .eq('user_id', uid)

        if (foodError) {
            console.log('Error retrieving Food Log', foodError)
            return
        }

        const standardizedLog = foodLog.map(food => ({...food, 'Food Log': food}))
        console.log('Fetched Food Log:', standardizedLog)
        setFoodLibrary(standardizedLog)
        fetchUserFoodToday(uid)
    }

    const fetchUserFoodToday = async (uid) => {
        const { data: foodLogToday, foodLogTodayError } = await supabase
        .from('Daily Food Log')
        .select('*, "Food Log"(*)') // Left join Food Log with Daily Food Log
        .eq('user_id', uid)

        if (foodLogTodayError) {
            console.log('Error retrieving daily Food Log', foodLogTodayError)
            return
        }

        // DEPRECATED, pass foodLog from fetchUserFoodData() function as parameter if using this
        /*const today = new Date().toISOString().split('T')[0]
        const filteredToday = foodLogToday.filter(food => food.logged_at.startsWith(today))
        const todayFoodIDs = filteredToday.map((food) => food.food_id)
        const todayFoods = foodLog.filter((food) => todayFoodIDs.includes(food.id))
        console.log("Fetched today's food:", todayFoods)*/

        console.log("Fetched today's food log:", foodLogToday)
        setDailyEntries(foodLogToday)
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) console.error('Error signing out:', error)
        else {
            console.log('Signed out successfully')
            setUID(null)
            navigate('/')
        }
    }
    
    if (userDataLoading) {
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
                //foodLibrary={foodLibrary}
                userData={userData}
        />
        {/*<MacroTotal foodEntries={dailyEntries}/>*/}

        <div>
            <button onClick={() => setIsPopUpOpen(true)}>Add Food</button>
            <FoodLogPopUp
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                uid={uid}
                foodLibrary={foodLibrary}
                dailyEntries={dailyEntries}
                setFoodLibrary={setFoodLibrary}
                setDailyEntries={setDailyEntries}
            />
        </div>
        </>
    )
}

export default Dashboard