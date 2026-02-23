import React from "react";
import LogFood from './LogFood'

export default function FoodLogPopUp({ isOpen, onClose, uid, foodLibrary, dailyEntries, setFoodLibrary, setDailyEntries}) {
    if (!isOpen) return null

    return (
        <>
        <div className='overlay'>
            <div className='modal'>
                <button className='closeBtn' onClick={onClose}>X</button>
                <LogFood
                    uid={uid}
                    foodLibrary={foodLibrary}
                    dailyEntries={dailyEntries}
                    setFoodLibrary={setFoodLibrary}
                    setDailyEntries={setDailyEntries}
                />
            </div>
        </div>
        </>
    )   
}