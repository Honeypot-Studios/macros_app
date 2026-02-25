import { supabase } from "../supabaseClient";

export default function PublicBoolPopUp( {uid, food, isOpen, onClose} ) {
    if (!isOpen) return null
    
    const changePublicBool = async (changeBool = false) => {
        const { error: changeBoolError } = await supabase
        .from('Food Log')
        .update( {'is_public': changeBool} )
        .eq('user_id', uid)
        .eq('id', food.id)
        
        if (changeBoolError) {
            console.error(`Failed to change "is_public" bool to ${changeBool} for ${food.food_name}`, food)
            return
        }

        console.log(`Successfully change "is_public" bool to ${changeBool} for ${food.food_name}`, food)
    }

    return (
        <>
        <div className="overlay">
            <div className="modal">
                <button className='closeBtn' onClick={onClose}>X</button>
                <h3>Make public?</h3>
                <button onClick={() => changePublicBool(true)}>Set Public</button>
                <button onClick={() => changePublicBool(false)}>Set Private</button>
            </div>
        </div>
        </>
    )
}