import { create } from 'zustand'
import { supabase } from './supabaseClient.js'

import { ErrorLogger } from './Debug.js'

/*=======================================================*/
// ToDo
//!  - Yo MAMA
//*  - Implement pagination
/*=======================================================*/

const useFoodStore = create((set, get) => ({
    foodLibrary: [],
    dailyEntries: [],

    setFoodLibrary: (library) => set({ foodLibrary: library }),
    setDailyEntries: (entries) => set({ dailyEntries: entries }),

    fetchFood: async (userID) => {
        if (!userID) {
            console.warn("Issue with userID, couldn't fetch food:", userID)
            return
        }

        const startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 1)

        const startDateISO = startDate.toISOString()
        const endDateISO = endDate.toISOString()

        try {
            const foodLibPromise = supabase
            .from('Food Library')
            .select('*')
            .limit(15)
            .or(`user_id.eq.${userID},is_public.eq.true`)

            const dailyEntPromise = supabase
            .from('Daily Entries')
            .select('id, food_id, logged_at, "Food Library"(user_id, food_name, calories, fat, carbs, protein, is_public)')
            .eq('user_id', userID)
            .gte('logged_at', startDateISO)
            .lte('logged_at', endDateISO)

            const [foodLibResolution, dailyEntResolution] = await Promise.all([foodLibPromise, dailyEntPromise])
            
            if (foodLibResolution.error) {
                 ErrorLogger('useFoodStore.js - fetchFood', error)
            }
            //console.log('fetched food lib:', foodLibResolution.data)
            set({ foodLibrary: foodLibResolution.data || []})
            
            if (dailyEntResolution.error) {
                 ErrorLogger('useFoodStore.js - fetchFood', error)
            }
            //console.log('fetched daily entries:', dailyEntResolution.data)

            const remapDailyEntRes = dailyEntResolution.data.map(({id, food_id, logged_at, "Food Library": food}) => ({
                id, food_id, logged_at, ...food
            }))
            //console.log('remapped daily entries:', remapDailyEntRes)
            set({ dailyEntries: remapDailyEntRes || []})

        }
        catch (error) {
            ErrorLogger('useFoodStore.js - fetchFood', error)
        }
    },

    addNewFood: async (userID, food_name, calories, fat, carbs, protein, is_public) => {
        const { data: newFood, error: newFoodError } = await supabase
        .from('Food Library')
        .insert([
            {
                user_id: userID,
                food_name: food_name,
                calories: calories,
                fat: fat,
                carbs: carbs,
                protein: protein,
                is_public: is_public
            }
        ])
        .select()

        if (newFoodError) {
            ErrorLogger('useFoodStore.js - addNewFood', error)
            return
        }
        
        const curFoodLib = get().foodLibrary
        set({ foodLibrary: [...curFoodLib, newFood[0] ]})
        return newFood[0]
    },

    addEntry: async (userID, food) => {
        const { data: addedFood, error: insertError } = await supabase
        .from('Daily Entries')
        .insert([
            {
                user_id: userID,
                food_id: food.id
            }
        ])
        .select()

        if (insertError) {
            ErrorLogger('useFoodStore.js - addEntry', insertError)
            return
        }
        
        const newEntry = {
            id: addedFood[0].id,
            food_id: food.id,
            logged_at: addedFood[0].logged_at,
            user_id: userID,
            food_name: food.food_name,
            calories: food.calories,
            fat: food.fat,
            carbs: food.carbs,
            protein: food.protein,
            is_public: food.is_public
        }
        //console.log('newEntry', newEntry)
        const curEntries = get().dailyEntries
        set({ dailyEntries: [...curEntries, newEntry] })
    },

    deleteFood: async (userID, curView, targetID) => {
        let table = null
        if (curView === 0) table = 'Daily Entries'
        else table = 'Food Library'
        
        const { error: deleteFoodError } = await supabase
        .from(table)
        .delete()   
        .eq('user_id', userID)
        .eq('id', targetID)
        .single()

        if (deleteFoodError) {
            ErrorLogger('useFoodStore.js - deleteFood', error)
            return
        }

        const curFoodLib = get().foodLibrary
        const curEntries = get().dailyEntries
        if (curView === 1) {
            set({ foodLibrary: curFoodLib.filter(food => food.id !== targetID)})
            set({ dailyEntries: curEntries.filter(food => food.food_id !== targetID) })
            //console.log('Deleted food from library')
        }
        else {
            set({ dailyEntries: curEntries.filter(food => food.id !== targetID) })
            //console.log("Deleted food today's log")
        }
    },

    calculateDailyTotal: (dailyEntries) => {
        const total = dailyEntries.reduce((acc, entry) => ({
                calories: acc.calories + (entry.calories || 0),
                fat: acc.fat + (entry.fat || 0),
                carbs: acc.carbs + (entry.carbs || 0),
                protein: acc.protein + (entry.protein || 0)
        }), { calories: 0, fat: 0, carbs: 0, protein: 0 })
        return total
     }
}))

export default useFoodStore


//! Code Graveyard
/* 
        const { data: foodLibraryData, error: fetchError } = await supabase
        .from('Food Library')
        .select('*')
        .or(`user_id.eq.${userID},is_public.eq.true`)

        if (fetchError) console.log('Error retrieving Food Log', fetchError.message)
        else set({ foodLibrary: foodLibraryData || []})


        // fetching users daily food entries
        const { data: dailyEntriesData, error: fetchDailyError } = await supabase
        .from('Daily Entries')
        .select('*')
        .eq('user_id', userID)

        if (fetchDailyError) console.log('Error retrieving daily Food Log', fetchDailyError.message)
        else set({ dailyEntries: dailyEntriesData || []})


            const { data: fetchEntries, error: fetchError } = await supabase
            .from('Daily Entries')
            .select('*')
            .eq('user_id', userID)
            .gt('logged_at', startDateISO)
            .lt('logged_at', endDateISO)

            if (fetchError) {
                console.error('issue fetching daily entries:', fetchError.error.message)
            }
            
            const foodLibPromise = supabase
            .from('Food Library')
            .select('*')
            .limit(15)
            .or(`user_id.eq.${userID},is_public.eq.true`)
            
            const dailyFoodIDs = fetchEntries.map(food => food.food_id)
            //console.log('dailyFoodIDs', dailyFoodIDs)
            const bruhProm = supabase
            .from('Food Library')
            .select('*')
            .in('id', dailyFoodIDs)

            const [foodLibResolution, bruhRes] = await Promise.all([foodLibPromise, bruhProm])
            
            if (foodLibResolution.error) {
                console.error('issue fetching food lib:', foodLibResolution.error.message)
            }
            //console.log('fetched food lib:', foodLibResolution.data)
            set({ foodLibrary: foodLibResolution.data || []})

            if (bruhRes.error) {
                console.error('fuck me:', bruhRes.error.message)
            }

            //console.log('bruhRes:', bruhRes.data)
            set({ dailyEntries: bruhRes.data || []})
            console.log(get().dailyEntries)
*/
