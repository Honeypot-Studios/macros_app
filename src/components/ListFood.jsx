import ModFood from "./ModTable"


export default function ListFood ({ userID, activeView }) {
    
    return (
        <>
        <div>
            {activeView.length > 0 ? (
                <ul>
                {activeView.map((food) => (
                    <li key={food.id}>
                        Food: {food.food_name}
                        - Calories: {food.calories}
                        - Fat: {food.fat}
                        - Carbs: {food.carbs}
                        - Protein: {food.protein}
                        <ModFood 
                            userID={userID}
                            food={food}
                            activeView={activeView}
                        />                                
                    </li>
                ))} </ul>
            ) : 
                <p>No food yet!</p>
            }
        </div>
        </>
    )
}