//! Deprecated
// export function getEntry (curView, food, foodMap) {
//     const view = (curView === 0) ? 'food_id' : 'id'
//     const savedFood = foodMap.get(food[view])

//      //console.log('view in getEntry:', view)
//     if (!savedFood) {
//         return {
//             food_name: 'N/A',
//             calories: 0,
//             fat: 0,
//             carbs: 0,
//             protein: 0
//         }
//     }

//     return {
//             food_name: savedFood.food_name,
//             calories: savedFood.calories,
//             fat: savedFood.fat,
//             carbs: savedFood.carbs,
//             protein: savedFood.protein
//     }
// }

export function changeObject(curView, userEntries, dailyEntries) {
    if (curView === 0) return dailyEntries || []
    return userEntries || []
}

// check if a food item was logged by the current user
export function checkForDelete(userID, food) {
    //if (curView === 0) return true
    if (food.is_public && (food.user_id === userID)) return true
    if (!food.is_public && (food.user_id === userID)) return true
    return false
}