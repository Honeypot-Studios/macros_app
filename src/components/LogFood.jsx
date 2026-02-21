import React from "react";
import { useState} from 'react'
import { supabase } from "../supabaseClient";

export default function LogFood({ userID, items, todayItems, setItems, setTodayItems}) {
    const [foodLogView, setFoodLogView] = useState(0)

    const [foodName, setFoodName] = useState('')
    const [foodcalories, setCalories] = useState('')
    const [foodfat, setFat] = useState('')
    const [foodcarbs, setCarbs] = useState('')
    const [foodprotein, setProtein] = useState('')

    const addNewFood = async () => {
        const { data: newFood, error } = await supabase
        .from('Food Log')
        .insert([
            {
                user_id: userID,
                food_name: foodName,
                calories: foodcalories,
                fat: foodfat,
                carbs:foodcarbs,
                protein: foodprotein,
            }
        ])
        .select()
        
        if (error) {
            console.error('Error adding new food:', error)
            return
        }

        console.log('Added new food:', newFood)
        addFood(userID, newFood[0]) // as of now new food gets auto log to "Daily Food Log"
                                    // thus addFood() saves new food into item and todatItems
        
        setFoodName('')
        setCalories('')
        setFat('')
        setCarbs('')
        setProtein('')
    }

    const addFood = async (userID, item) => {
        const { data: logFoodToday, error: logFoodTodayError } = await supabase
        .from('Daily Food Log')
        .insert([
            {
                user_id: userID,
                food_id: item.id
            }
        ])
        .select()

        if (logFoodTodayError) {
            console.error('Error adding logged food:', logFoodTodayError)
            return
        }

        // ...item, id: logFoodToday[0].id, avoids duplicate key error in items array by
        // replace id of the item in array with id from "Daily Food Log"
        setItems(prevToday => [...prevToday, { ...item, id: logFoodToday[0].id }])
        setTodayItems(prevToday => [...prevToday, { ...item, id: logFoodToday[0].id }])
    }

    const deleteFood = async (targetID) => {
        const { data, error } = await supabase
        .from('Food Log')
        .delete()
        .eq('user_id', userID)
        .eq('id', targetID)
        .single()

        if (error) {
            console.error('Error:', error)
            return
        }

        console.log('Deleted food item')
        // updating both food object arrays, upadting UI
        setItems(prevItems => prevItems.filter(item => item.id !== targetID))
        setTodayItems(prevTodayItems => prevTodayItems.filter(item => item.id !== targetID))

        // deleteFood only deletes logged food in the "Food Log"
        // NEED to make seperate delete component to delete food logged in "Daily Food Log" table
    }

    const changeView = (setFoodLogView) => {
        if (setFoodLogView === 0) return todayItems
        return items
    }

    return (
        <>
        <div className='popUpWrapper'>
            <div className='leftSection'>
                <h3 className='popUpText' >Log Food</h3>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    addNewFood()
                }}>
                    <p className='popUpText'>Food Name:</p>
                    <input
                        type="text"
                        placeholder="e.g. Chicken Breast"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        required
                    />

                    <p className='popUpText'>Calories:</p>
                    <input
                        type="number"
                        placeholder="e.g. 250"
                        value={foodcalories}
                        onChange={(e) => setCalories(e.target.value)}
                        required
                    />

                    <p className='popUpText'>Grams of Fat:</p>
                    <input
                        type="number"
                        placeholder="e.g. 11"
                        value={foodfat}
                        onChange={(e) => setFat(e.target.value)}
                        required
                    />

                    <p className='popUpText'>Grams of Carbs:</p>
                    <input
                        type="number"
                        placeholder="e.g. 67"
                        value={foodcarbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        required
                    />
                    
                    <p className='popUpText'>Grams of Proetin:</p>
                    <input
                        type="number"
                        placeholder="e.g. 21"
                        value={foodprotein}
                        onChange={(e) => setProtein(e.target.value)}
                        required
                    />
                    <div>
                        <button type="submit">Log New Food</button>
                    </div>
                </form>
                <button onClick={ () => setFoodLogView(1) }>Fetch All Foods</button>
                <button onClick={ () => setFoodLogView(0) }>Fetch Todays Foods</button>
            </div>
            <div className='rightSection'>
                <h3 className='popUpText'>Log History</h3>
                <div className='foodListContainer'>
                    <ul>
                        {changeView(foodLogView).map((item) => (
                            <li key={item.id} className='popUpText' style={{ marginBottom: '10px' }}>
                            Food: {item.food_name ? `${item.food_name} ` : `N/A `}
                            - Calories: {item.calories ? `${item.calories} ` : `${0} `}
                            - Fat: {item.fat ? `${item.fat} ` : `${0} `}
                            - Carbs: {item.carbs ? `${item.carbs} ` : `${0} `}
                            - Protein: {item.protein ? `${item.protein}` : `${0}`}
                            <button
                                onClick={() => addLoggedFood(userID,item)}
                                style={{ marginLeft: '10px' }}
                            >
                                Add
                            </button>
                            <button
                                onClick={() => deleteFood(item.id)}
                                style={{ marginLeft: '10px' }}
                            >
                                Delete
                            </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>                
        </div>
        </>
    )
}
