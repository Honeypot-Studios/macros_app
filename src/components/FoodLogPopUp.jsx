import React from "react";
import LogFood from './LogFood'

export default function FoodLogPopUp({ isOpen, onClose, userID, items, todayItems, setItems, setTodayItems}) {
    if (!isOpen) return null

    return (
        <>
        <div className='overlay'>
            <div className='modal'>
                <button className='closeBtn' onClick={onClose}>X</button>
                <LogFood
                    userID={userID}
                    items={items}
                    todayItems={todayItems}
                    setItems={setItems}
                    setTodayItems={setTodayItems}
                />
            </div>
        </div>
        </>
    )   
}