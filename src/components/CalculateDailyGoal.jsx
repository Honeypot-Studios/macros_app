import React, { useState } from "react";
import {convert, calculatedBMR, calculatedTDEE, proteinPercentage} from '../utils/macroCalculations'

export default function CalculateDailyGoal( {userData} ) {
    if (!userData) return <p>Loading Daily Goals...</p>

    const goals = useState({
        calorieGoal: 0,
        fatGoal: 0,
        carbGoal: 0,
        proteinGoal: 0
    })

    const setGoals = () => {
        const {heightcm, weightKg} = convert(userData.height_feet, userData.height_inches, userData.weight_lbs);
        const bmr = calculatedBMR(userData.gender, userData.age, heightcm, weightKg)
        const tdee = calculatedTDEE(bmr)
        const proteingrams = proteinPercentage(userData.weight_lbs, tdee)       
        
        goals.calorieGoal = parseInt(tdee)
        goals.fatGoal = parseInt((tdee * (1 - (proteingrams + 0.4))) / 9)
        goals.carbGoal = parseInt((tdee * 0.4) / 4)
        goals.proteinGoal = parseInt((tdee * proteingrams) / 4)
    }

    return (
        <>
        {setGoals()}
        <div>
            <h3>Daily Goal</h3>
            <p>Calories: {goals.calorieGoal}</p>
            <p>Fat: {goals.fatGoal}g</p>
            <p>Carbs: {goals.carbGoal}g</p>
            <p>Protein: {goals.proteinGoal}g</p>
        </div>
        </>
    )    
}
