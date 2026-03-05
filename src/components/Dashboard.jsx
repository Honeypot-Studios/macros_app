import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient.js'

import useFoodStore from '../utils/useFoodStore.js'
import useUserStore from '../utils/useUserStore.js'
import { getEntry } from '../utils/FoodUtils.js'

export default function Dashboard() {
    const navigate = useNavigate()
    // Show casing daily entries on users dashboard, need curView = 0
    // when using getEntry() to get correct food entry data
    const curView = 0
    const loading = useUserStore((state) => state.loading)

    //const userID = useUserStore((state) => state.userID)
    const setUserID = useUserStore((state) => state.setUserID)
    const getSession = useUserStore((state) => state.getSession)

    const fetchFood = useFoodStore((state) => state.fetchFood)
    const foodLibrary = useFoodStore((state) => state.foodLibrary)
    const dailyEntries = useFoodStore((state) => state.dailyEntries)

    useEffect(() => {
        document.title = "Macros App | Dashboard"

        const handleDataFetch = async() => {
            try {
                const userID = await getSession(navigate)

                if (!userID) {
                    console.warn('Issue with fetching userID')
                    return
                }
                fetchFood(userID)
                //console.log('dailyEntries in dashbord:', dailyEntries)
            }
            catch (error) {
                console.error('Error encountered:', error.message)
                return
            }
        }
        handleDataFetch()
    }, [navigate])

    const foodMap = useMemo(() => {
        const savedFoodMap = new Map(foodLibrary.map(food => [food.id, food]))
        //console.log('savedFoodMap:', savedFoodMap)
        return savedFoodMap
    }, [foodLibrary])

    const dailyTotal = useMemo(() => {
        const total = dailyEntries.reduce((acc, entry) => {
            const foodData = foodMap.get(entry.food_id)

            if (foodData) {
                acc.calories += (foodData.calories || 0)
                acc.fat += (foodData.fat || 0)
                acc.carbs += (foodData.carbs || 0)
                acc.protein += (foodData.protein || 0)
            }

            return acc
        }, { calories: 0, fat: 0, carbs: 0, protein: 0 })
        return total
     }, [dailyEntries, foodMap])

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
            <p>Calories: {dailyTotal.calories}</p>
            <p>fat: {dailyTotal.fat}</p>
            <p>carbs: {dailyTotal.carbs}</p>
            <p>protein: {dailyTotal.protein}</p>
        </div>
        <div>
            <h3>Daily Entries</h3>
            <ul>
                {dailyEntries.map((food) => {
                    const entry = getEntry(curView, food, foodMap)
                    return (
                        <li key={food.id} style={{ marginBottom: '10px' }}>
                        Food: {entry.foodName}
                        - Calories: {entry.calories}
                        - Fat: {entry.fat}
                        - Carbs: {entry.carbs}
                        - Protein: {entry.protein}
                        </li>
                    )
                })}
            </ul>
        </div>
        <div>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={() => navigate('/UserProfile')}>Profile</button>
        </div>
        </>
    )
}