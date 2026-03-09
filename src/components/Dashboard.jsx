import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient.js'

import useFoodStore from '../utils/useFoodStore.js'
import useUserStore from '../utils/useUserStore.js'


export default function Dashboard() {
    const navigate = useNavigate()
    // Show casing daily entries on users dashboard, need curView = 0
    // when using getEntry() to get correct food entry data
    const curView = 0
    const loading = useUserStore((state) => state.loading)
    const [searchParam, setSearchParam] = useState(0)

    //const userID = useUserStore((state) => state.userID)
    const setUserID = useUserStore((state) => state.setUserID)
    const getSession = useUserStore((state) => state.getSession)

    const fetchFood = useFoodStore((state) => state.fetchFood)
    const foodLibrary = useFoodStore((state) => state.foodLibrary)
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
                fetchFood(userID, searchParam)
                //console.log('dailyEntries in dashbord:', dailyEntries)
            }
            catch (error) {
                console.error('Error encountered:', error.message)
                return
            }
        }
        handleDataFetch()
    }, [navigate])

    //! Deprecated
    // const foodMap = useMemo(() => {
    //     const savedFoodMap = new Map(foodLibrary.map(food => [food.id, food]))
    //     //console.log('savedFoodMap:', savedFoodMap)
    //     return savedFoodMap
    // }, [foodLibrary])

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

    if (loading) {
        //console.log('Loading Session')
        return <div>Loading...</div>
    }

    return (
        <>
        <div>
            <h2>Dashboard</h2>
            <button onClick={() => navigate('/ViewFood')}>View Food Library</button>
        </div>
        <div>
            <h3>Today's totals</h3>
            <p>Calories: {handleDailyTotal.calories}</p>
            <p>fat: {handleDailyTotal.fat}</p>
            <p>carbs: {handleDailyTotal.carbs}</p>
            <p>protein: {handleDailyTotal.protein}</p>
        </div>
        <div>
            <h3>Daily Entries</h3>
            {dailyEntries.length > 0 ?
            <ul>
                {dailyEntries.map((food) => {
                    return (
                        <li key={food.id} style={{ marginBottom: '10px' }}>
                            Food: {food.food_name}
                            - Calories: {food.calories}
                            - Fat: {food.fat}
                            - Carbs: {food.carbs}
                            - Protein: {food.protein}
                        </li>
                    )
                })}
            </ul> : <p>No Food Yet!</p>
            }
        </div>
        <div>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={() => navigate('/UserProfile')}>Profile</button>
        </div>
        </>
    )
}
