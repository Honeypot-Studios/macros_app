import React, { useState } from "react"
import { supabase } from "../supabaseClient"
import { getProperties, changeItemsObject } from "../utils/LogFoodUtils"
import PublicBoolPopUp from "./PublicBoolPopUp"

export default function LogFood( {uid, foodLibrary, dailyEntries, setFoodLibrary, setDailyEntries} ) {
    const [foodLogView, setFoodLogView] = useState(0)
    const [boolPopUp, setBoolPopUp] = useState(false)

    const [foodName, setFoodName] = useState('')
    const [foodcalories, setCalories] = useState('')
    const [foodfat, setFat] = useState('')
    const [foodcarbs, setCarbs] = useState('')
    const [foodprotein, setProtein] = useState('')
    
    const addNewFood = async () => {
        let logView = 1
        const { data: newFoodEntry, error: newFoodError } = await supabase
        .from('Food Log')
        .insert([
            {
                user_id: uid,
                food_name: foodName,
                calories: foodcalories,
                fat: foodfat,
                carbs:foodcarbs,
                protein: foodprotein,
            }
        ])
        .select()
        
        if (newFoodError) {
            console.error('Error adding new food:', newFoodError)
            return
        }

        const newFood = {...newFoodEntry[0], 'Food Log': newFoodEntry[0]}
        console.log('Added new food:', newFood)
        setFoodLibrary(prev => [...prev, newFood])
        addFoodToDaily(uid, newFoodEntry[0], logView)
        
        setFoodName('')
        setCalories('')
        setFat('')
        setCarbs('')
        setProtein('')
    }

    const addFoodToDaily = async (uid, food, logView) => {
        let idName = null
        let foodData = null
        if (logView === 0) {
            idName = 'food_id'
            foodData = food['Food Log']
        }
        else {
            idName = 'id'
            foodData = food
        }

        const { data: dailyFoodEntry, error: DailyFoodEntryError } = await supabase
        .from('Daily Food Log')
        .insert([
            {
                user_id: uid,
                food_id: food[idName]
            }
        ])
        .select()

        if (DailyFoodEntryError) {
            console.error('Error adding logged food:', DailyFoodEntryError)
            return
        }

        const newDailyEntry = {...dailyFoodEntry[0], 'Food Log': foodData}
        console.log("Added logged food to today's food log:", newDailyEntry)
        setDailyEntries(prevToday => [...prevToday, newDailyEntry])
    }

    const deleteFood = async (uid, targetID, logView) => {
        let table = null
        if (logView === 0) table = 'Daily Food Log'
        else table = 'Food Log'

        const { error: deleteFoodError } = await supabase
        .from(table)
        .delete()
        .eq('user_id', uid)
        .eq('id', targetID)
        .single()

        if (deleteFoodError) {
            console.error('Error deleting food:', deleteFoodError)
            return
        }
        
        if (logView === 1) {
            setFoodLibrary(prevItems => prevItems.filter(food => food.id !== targetID))
            setDailyEntries(prevTodayFood => prevTodayFood.filter(food => food.food_id !== targetID))
            console.log('Deleted food from library')            
        }
        else {
            setDailyEntries(prevTodayFood => prevTodayFood.filter(food => food.id !== targetID))
            console.log("Deleted food today's log")            
        }
    }
    
    return (
        <>
        <div className='popUpWrapper'>
            <div className='leftSection'>
                <h3 className='popUpText'>Log Food</h3>
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
                        {changeItemsObject(foodLogView, dailyEntries, foodLibrary).map((food) => (
                            <li key={food.id} className='popUpText' style={{ marginBottom: '10px' }}>
                            Food: {getProperties(food, 'food_name') || 'N/A '}
                            - Calories: {getProperties(food, 'calories') || '0 '}
                            - Fat: {getProperties(food, 'fat') || '0 '}
                            - Carbs: {getProperties(food, 'carbs') || '0 '}
                            - Protein: {getProperties(food, 'protein') || '0'}
                            <button
                                onClick={() => addFoodToDaily(uid, food, foodLogView)}
                                style={{ marginLeft: '10px' }}
                            >
                                Add
                            </button>
                            <button
                                onClick={() => deleteFood(uid, food.id, foodLogView)}
                                style={{ marginLeft: '10px' }}
                            >
                                Delete
                            </button>


                            {/* WORK ON THIS */}
                            {(foodLogView === 1) ? (
                            <button
                                onClick={() => setBoolPopUp(true)}
                                style={{ marginLeft: '10px' }}
                            >
                                Share Food
                            </button>) : <></>}
                            <PublicBoolPopUp
                                uid={uid}
                                food={food}
                                isOpen={boolPopUp}
                                onClose={() => setBoolPopUp(false)}
                            />

                            {/* Developer button*/}
                            <button
                                onClick={() => console.log("food:", food)}
                                style={{ marginLeft: '10px' }}
                            >
                                Create console log
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

