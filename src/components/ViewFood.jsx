import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { changeObject, checkForDelete } from '../utils/FoodUtils.js'
import useFoodStore from '../utils/useFoodStore.js'
import AddNewFood from './AddNewFood.jsx'
import useUserStore from '../utils/useUserStore.js'

/*=======================================================*/
//  TODO(s):
//      - (Implement later) )Have setting in profile
//        if they want every food made to be public?
//*      - Need to get specific entries for daily entires
//*        as foodLib and foodMap only hold a few entries
//*        at a time
/*=======================================================*/

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

    //! Deprecated
    // const foodMap = useMemo(() => {
    //     const savedFoodMap = new Map(foodLibrary.map(food => [food.id, food]))
    //     //console.log('savedFoodMap:', savedFoodMap)
    //     return savedFoodMap
    // }, [foodLibrary])

    const debug = (food) => {
        console.log("food:", food)
        console.log('food food_id:', food.food_id)
    }

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
                    //console.log('dailyEntries:', dailyEntries)
                    return (
                        <li key={food.id} style={{ marginBottom: '10px' }}>
                            Food: {food.food_name}
                            - Calories: {food.calories}
                            - Fat: {food.fat}
                            - Carbs: {food.carbs}
                            - Protein: {food.protein}
                            <button
                                onClick={() => addEntry(userID, food)}
                                style={{ marginLeft: '10px' }}
                            >
                                Add
                            </button>
                            {checkForDelete(userID, curView, food) ? 
                                <button
                                    onClick={() => deleteFood(userID, curView, food.id)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Delete
                                </button> : <></>
                            }
                            {/* Developer button */}
                            <button
                                onClick={() => debug(food)}
                                style={{ marginLeft: '10px' }}
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