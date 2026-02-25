export function getProperties(food, prop) {
    const food_prop = food['Food Log']?.[prop]  
    if (food_prop === undefined)
        console.warn(`Issue getting property: ${prop}, from food object: ${food['Food Log'].food_name}, ${food}`)
    return food_prop
}

export function changeItemsObject(foodLogView, dailyEntries, foodLibrary) {
    if (foodLogView === 0) return dailyEntries
    return foodLibrary
}
