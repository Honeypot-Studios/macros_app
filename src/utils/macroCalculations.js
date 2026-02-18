export function convert(height_feet, height_inches, weight_lbs) {
    const heightcm = ((height_feet * 12) + height_inches)*2.54
    const weightKg = weight_lbs * 0.453592
    return { heightcm, weightKg }
}

export function calculatedBMR(gender, age, heightcm, weightKg) {
    if (gender === 'male') {
        const bmr = (10 * weightKg) + (6.25 * heightcm) - (5 * age) + 5
        return bmr
    } else if (gender === 'female') {
        const bmr = (10 * weightKg) + (6.25 * heightcm) - (5 * age) - 161
        return bmr
    } else {
        console.log('Invalid gender value', gender)
        return null
    }
}

export function calculatedTDEE(bmr) {
    const tdee = bmr * 1.55
    return tdee
}

export function proteinPercentage(weight_lbs, tdee) {
    const proteinGrams = (weight_lbs * 4) / tdee
    return proteinGrams
}