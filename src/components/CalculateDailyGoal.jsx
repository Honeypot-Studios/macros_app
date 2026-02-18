import React from "react";
import {convert, calculatedBMR, calculatedTDEE, proteinPercentage} from '../utils/macroCalculations'

export default function CalculateDailyGoal({items, userData}) {
    // Don't calculate if userData or items hasn't been retrieved yet
    if (!userData || !items) {
        return (
            <div>
                <p>calculating...</p>
            </div>
        )
    }
    /*
    const [goals, setGoal] = useState({
        totalCalories: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalProtein: 0
    })
    */
    const {heightcm, weightKg} = convert(userData.height_feet, userData.height_inches, userData.weight_lbs);
    const bmr = calculatedBMR(userData.gender, userData.age, heightcm, weightKg)
    const tdee = calculatedTDEE(bmr)
    const proteingrams = proteinPercentage(userData.weight_lbs, tdee)

    return (
        <>
        <div>
            <h3>Daily Goal</h3>
            <p>Calories: {parseInt(tdee)}</p>
            <p>Fat: {parseInt((tdee * (1 - (proteingrams + 0.4))) / 9)}g</p>
            <p>Carbs: {parseInt((tdee * 0.4) / 4)}g</p>
            <p>Protein: {parseInt((tdee * proteingrams) / 4)}g</p>
        </div>
        </>
    )    
}