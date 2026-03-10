import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { checkForDelete } from '../utils/FoodUtils.js'
import useFoodStore from '../utils/useFoodStore.js'
import AddNewFood from './AddNewFood.jsx'
import useUserStore from '../utils/useUserStore.js'
import { ErrorLogger } from '../utils/Debug.js'

/*=========================================================*/
//  TODO(s):
//      - (Implement later) Have setting in profile
//        if they want every food made to be public?
//*     - (Partially done) Need to get specific entries
//*       for daily entires as foodLib and foodMap only
//*       hold a few entries at a time.
//      - (Done) replace curView with better code for view
//      - Move whole food library to different component?
/*=========================================================*/

export default function ViewFood() {
    const navigate = useNavigate()

    const [curView, setCurView] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [searchParam, setSearchParam] = useState(0)

    const userID = useUserStore((state) => state.userID)
    const getSession = useUserStore((state) => state.getSession)

    const fetchFood = useFoodStore((state) => state.fetchFood)
    const foodLibrary = useFoodStore((state) => state.foodLibrary)
    const userEntries = useFoodStore((state) => state.userEntries)
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
                fetchFood(userID, searchParam)
            }
            catch (error) {
                ErrorLogger('ViewFood.jsx - handleDataFetch', error)
                //console.error('Error encountered:', error.message)
                return
            }
        }
        handleDataFetch()
    }, [navigate, searchParam])

    //! Deprecated
    // const foodMap = useMemo(() => {
    //     const savedFoodMap = new Map(foodLibrary.map(food => [food.id, food]))
    //     //console.log('savedFoodMap:', savedFoodMap)
    //     return savedFoodMap
    // }, [foodLibrary])

    const handleView = (view) => {
        switch (view) {
            case "Daily":
                setCurView(dailyEntries)
                break
            case "User":
                setCurView(userEntries)
                break
            default:
                console.warn('error handling view:', view)
                setCurView([])
                return
        }
    }

    const handlePagination = (searchParam, pageBool) => {
        if (searchParam > 0 && !pageBool) {
            setSearchParam(searchParam - 1)
            return
        }

        if (pageBool) {
            setSearchParam(searchParam + 1)
        }
    }

    const debug = (food) => {
        console.log("food:", food)
        console.log('food food_id:', food.food_id)
    }
    
    return (
        <>
        <div>
            <h3>This is the Food Library!</h3>
        </div>
        <div>
            <button 
                onClick={() => navigate(-1)} 
                style={{margin: '10px'}}
            >
                Back to Dashboard
            </button>
        </div>
        <div>
            <button onClick={() => handleView("Daily")}>Daily Log</button>
            <button onClick={() => handleView("User")}>Your Entries</button>
        </div>
        <div>
            <ul>
                {curView.map((food) => {
                    return (
                        <li key={food.id}>
                            Food: {food.food_name}
                            - Calories: {food.calories}
                            - Fat: {food.fat}
                            - Carbs: {food.carbs}
                            - Protein: {food.protein}
                            <button
                                onClick={() => addEntry(userID, food)}
                                style={{ margin: '10px' }}
                            >
                                Add
                            </button>
                            {checkForDelete(userID, food) && curView !== foodLibrary ? 
                                <button
                                    onClick={() => deleteFood(userID, curView, food.id)}
                                    style={{ margin: '10px' }}
                                >
                                    Delete
                                </button> : <></>
                            }
                            {/* Developer button */}
                            <button
                                onClick={() => debug(food)}
                                style={{ margin: '10px' }}
                            >
                                Create console log
                            </button>
                        </li>
                    )
                })}
            </ul>
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
            <ul>
                {foodLibrary.map((food) => {
                    return (
                        <li key={food.id}>
                            Food: {food.food_name}
                            - Calories: {food.calories}
                            - Fat: {food.fat}
                            - Carbs: {food.carbs}
                            - Protein: {food.protein}
                            <button
                                onClick={() => addEntry(userID, food)}
                                style={{ margin: '10px' }}
                            >
                                Add
                            </button>
                            {/* Developer button */}
                            <button
                                onClick={() => debug(food)}
                                style={{ margin: '10px' }}
                            >
                                Create console log
                            </button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button 
                    onClick={() => handlePagination(searchParam, false)} 
                    style={{ margin: '10px' }}
                >
                    Prev
                </button>
                <button 
                    onClick={() => handlePagination(searchParam, true)} 
                    style={{ margin: '10px' }}
                >
                    Next
                </button>
            </div>
        </div>
        </>
    )
}
