import React from "react";
import { useState} from 'react'
import { supabase } from "../supabaseClient";

export default function LogFood({ userID, items, todayItems, setItems, setTodayItems}) {
    const [loading, setLoading] = useState(false)
    const [foodLogView, setFoodLogView] = useState(0)

    const [foodName, setFoodName] = useState('')
    const [foodcalories, setCalories] = useState('')
    const [foodfat, setFat] = useState('')
    const [foodcarbs, setCarbs] = useState('')
    const [foodprotein, setProtein] = useState('')

    const addFood = async () => {
        setLoading(true)
        const { data, error } = await supabase
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
        
        if (error) console.error('Error:', error)
        else {
            console.log('Added:', data)

            setItems(prevToday => [...prevToday, data[0]])
            setTodayItems(prevToday => [...prevToday, data[0]])

            setFoodName('')
            setCalories('')
            setFat('')
            setCarbs('')
            setProtein('')
        }
        setLoading(false)
    }

    const deleteFood = async (targetID) => {
        const { data, error } = await supabase
        .from('Food Log')
        .delete()
        .eq('user_id', userID)
        .eq('id', targetID)
        .select()
        
        if (error) console.error('Error:', error)
        else {
            console.log('Deleted:', data)
            // updating both food object arrays, upadting UI
            setItems(prevItems => prevItems.filter(item => item.id !== targetID))
            setTodayItems(prevTodayItems => prevTodayItems.filter(item => item.id !== targetID))
        }
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
                    addFood()
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
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Log New Food'}
                        </button>   
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
                        Food: {item.food_name ? `${item.food_name} ` : `${0} `}
                        - Calories: {item.calories ? `${item.calories} ` : `${0} `}
                        - Fat: {item.fat ? `${item.fat} ` : `${0} `}
                        - Carbs: {item.carbs ? `${item.carbs} ` : `${0} `}
                        - Protein: {item.protein ? `${item.protein}` : `${0}`}
                        <button onClick={() => deleteFood(item.id)} style={{ marginLeft: '10px' }}>
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