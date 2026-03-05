import { useState } from 'react'

import useFoodStore from '../utils/useFoodStore.js'

import '../assets/PopUp.css'


export default function AddFoodPopUp( { userID, isOpen, onClose } ) {
    const foodLibrary = useFoodStore((state) => state.foodLibrary)
    const dailyEntries = useFoodStore((state) => state.dailyEntries)
    const addNewFood = useFoodStore((state) => state.addNewFood)
    const addEntry = useFoodStore((state) => state.addEntry)

    const [foodName, setFoodName] = useState('')
    const [foodCalories, setCalories] = useState('')
    const [foodFat, setFat] = useState('')
    const [foodCarbs, setCarbs] = useState('')
    const [foodProtein, setProtein] = useState('')
    const [foodIsPublic, setFoodIsPublic] = useState(false)
    
    if (!isOpen) return

    const handleNewFood = async (userID, name, cals, fat, carbs, protein, isPublic) => {
        const newFoodID = await addNewFood(
            userID,
            name,
            cals,
            fat,
            carbs,
            protein,
            isPublic
        )
        setFoodName('')
        setCalories('')
        setFat('')
        setCarbs('')
        setProtein('')
        setFoodIsPublic(false)

        //console.log('newFoodID from addNewFood:', newFoodID)
        if (!newFoodID) {
            console.error("Issue with getting ID for new food")
            return
        }

        addEntry(userID, newFoodID)
    }

    const debug = () => {
        console.log('foodLibrary:', foodLibrary)
        console.log('dailyEntries:', dailyEntries)
    }
    
    return (
        <>
        <div className='overlay'>
            <div className='modal'>
                <button className='closeBtn' onClick={onClose}>X</button>
                <div>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleNewFood(userID, foodName, foodCalories, foodFat, foodCarbs, foodProtein, foodIsPublic)
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
                            value={foodCalories}
                            onChange={(e) => setCalories(e.target.value)}
                            required
                        />

                        <p className='popUpText'>Grams of Fat:</p>
                        <input
                            type="number"
                            placeholder="e.g. 11"
                            value={foodFat}
                            onChange={(e) => setFat(e.target.value)}
                            required
                        />

                        <p className='popUpText'>Grams of Carbs:</p>
                        <input
                            type="number"
                            placeholder="e.g. 67"
                            value={foodCarbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            required
                        />
                        
                        <p className='popUpText'>Grams of Proetin:</p>
                        <input
                            type="number"
                            placeholder="e.g. 21"
                            value={foodProtein}
                            onChange={(e) => setProtein(e.target.value)}
                            required
                        />

                        <p className='popUpText'>Make Public?</p>
                        <select
                            value={foodIsPublic}
                            onChange={(e) => setFoodIsPublic(e.target.value)}
                        >
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                        </select>
                        <div>
                            <button type="submit">Add Food</button>
                        </div>
                    </form>
                    <div>
                        <button onClick={debug}>Debug</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
