import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { getEntry, changeObject, checkForDelete } from '../utils/FoodUtils.js'
import useFoodStore from '../utils/useFoodStore.js'
import AddNewFood from './AddNewFood.jsx'
import useUserStore from '../utils/useUserStore.js'

/*===================================================================*/
//  TO DO(s):
//      - implement is_public, user can make their food public
//          - Could have user pick individual food to be public OR
//          - Have setting in profile if they want every food made to
//            be public
/*===================================================================*/

export default function ViewFood() {
    const navigate = useNavigate()

    // Daily entries are 0 (curView default 0), entire food library is 1
    const [curView, setCurView] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const userID = useUserStore((state) => state.userID)
    const getSession = useUserStore((state) => state.getSession)

    const fetchFood = useFoodStore((state) => state.fetchFood)
    const foodLibrary = useFoodStore((state) => state.foodLibrary)
    const dailyEntries = useFoodStore((state) => state.dailyEntries)
    const deleteFood = useFoodStore((state) => state.deleteFood)
    const addEntry = useFoodStore((state) => state.addEntry)
    
    useEffect(() => {
        document.title = "Macros App | ViewFood"

        const handleDataFetch = async() => {
            try {
                const userID = await getSession(navigate)

                if (!userID) {
                    console.warn('Issue with fetching userID')
                    return
                }
                fetchFood(userID)
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

    return (
        <>
        <div>
            <h3>This is the Food Library!</h3>
            {/*<button onClick={() => navigate('/Dashboard')}>Back to Dashboard</button>*/}
        </div>
        <div>
            <button onClick={() => setCurView(0)}>View Daily Log</button>
            <button onClick={() => setCurView(1)}>View Food Library</button>
        </div>
        <div>
        <div>
            <ul>
                {changeObject(curView, foodLibrary, dailyEntries).map((food) => {
                    //console.log('curView:', curView)
                    const entry = getEntry(curView, food, foodMap)
                    const targetID = (curView === 0) ? 'food_id' : 'id'
                    return (
                        <li key={food.id} className={{ marginBottom: '10px' }}>
                            Food: {entry.foodName}
                            - Calories: {entry.calories}
                            - Fat: {entry.fat}
                            - Carbs: {entry.carbs}
                            - Protein: {entry.protein}
                            <button
                                onClick={() => addEntry(userID, food[targetID])}
                                className={{ marginLeft: '10px' }}
                            >
                                Add
                            </button>
                            {checkForDelete(userID, curView, food) ? 
                                <button
                                    onClick={() => deleteFood(userID, curView, food.id)}
                                    className={{ marginLeft: '10px' }}
                                >
                                    Delete
                                </button> : <></>
                            }
                            {/* Developer button */}
                            <button
                                onClick={() => console.log("food:", food)}
                                className={{ marginLeft: '10px' }}
                            >
                                Create console log
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
        </div>
        <div>
            <button onClick={() => setIsOpen(true)}>Add New Food</button>
        </div>
        <AddNewFood 
            userID={userID}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        />
        <div>
            <button onClick={() => navigate(-1)}>Back to Dashboard</button>
        </div>
        </>
    )
}

/*
*/