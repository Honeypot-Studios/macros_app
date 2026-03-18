//import { checkForDelete } from '../utils/FoodUtils.js'
import useFoodStore from '../utils/useFoodStore.js'


export default function ModFood ({ userID, food, activeView }) {

    const deleteFood = useFoodStore((state) => state.deleteFood)
    const addEntry = useFoodStore((state) => state.addEntry)
    const curView = useFoodStore((state) => state.curView)

    const debug = (food) => {
        console.log("food:", food)
        console.log('food food_id:', food.food_id)
    }

    const checkForDelete = () => {
        if (food.is_public && (food.user_id === userID)) return true
        if (!food.is_public && (food.user_id === userID)) return true
        return false
    }

    return (
        <>
        <button
            onClick={() => addEntry(userID, food)}
            style={{ margin: '10px' }}
        >
            Add
        </button>
        {checkForDelete && curView !== 'Food Library' ? 
            <button
                onClick={() => deleteFood(userID, activeView, food.id)}
                style={{ margin: '10px' }}
            >
                Delete
            </button> : <></>
        }
        {/* Developer button */}
        <button
            onClick={() => debug(food)}
            style={{ margin: '10px' }}
        >
            Create console log
        </button>
        </>
    )
}