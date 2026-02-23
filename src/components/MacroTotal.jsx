import React from 'react'

export default function MacroTotal({ foodEntries }) {
    if (!foodEntries || foodEntries.length === 0) return <p>Loading Macro Totals...</p>
    
    const totals = foodEntries.reduce((acc, food) => ({
        calories: acc.calories + Number(food?.calories || 0),
        fat: acc.fat + Number(food?.fat || 0),
        carbs: acc.carbs + Number(food?.carbs || 0),
        protein: acc.protein + Number(food?.protein || 0),
    }), {calories: 0, fat: 0, carbs: 0, protein: 0})
    
    return (
        <>
        <div>
            <h2>Macro Totals</h2>
            <p>Calories: {totals.calories}</p>
            <p>Fat: {totals.fat}g</p>
            <p>Carbs: {totals.carbs}g</p>
            <p>Protein: {totals.protein}g</p>
        </div>
        </>
    )
}