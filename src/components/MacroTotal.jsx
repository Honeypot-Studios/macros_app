import React from 'react'

export default function MacroTotal({ items} ) {
    if (!items) {
        return (
            <div>
                <p>calculating...</p>
            </div>
        )
    }

    const totals = items.reduce((acc, item) => ({
        calories: acc.calories + Number(item.calories),
        fat: acc.fat + Number(item.fat),
        carbs: acc.carbs + Number(item.carbs),
        protein: acc.protein + Number(item.protein),
    }), {calories: 0, fat: 0, carbs: 0, protein: 0})

    return (
        <>
        <div>
            <h2>Macro Totals</h2>
            <p>Calories: {totals.calories}</p>
            <p>Fat: {totals.fat}g</p>
            <p>Carbs {totals.carbs}g:</p>
            <p>Protein: {totals.protein}g</p>
        </div>
        </>
    )
}