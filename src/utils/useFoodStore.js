import { create } from 'zustand'
import { supabase } from './supabaseClient.js'

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
        //console.log('tomorrow:', tomorrow)

        const startDateISO = startDate.toISOString()
        const endDateISO = endDate.toISOString()
        //console.log('todayISO:', startDateISO)
        //console.log('tomorrowISO:', endDateISO)

        try {
            const foodLibPromise = supabase
            .from('Food Library')
            .select('*')
            .or(`user_id.eq.${userID},is_public.eq.true`)

            const dailyEntPromise = supabase
            .from('Daily Entries')
            .select('*')
            .eq('user_id', userID)
            .gt('logged_at', startDateISO)
            .lt('logged_at', endDateISO)

            const [foodLibResolution, dailyEntResolution] = await Promise.all([foodLibPromise, dailyEntPromise])
            
            if (foodLibResolution.error) {
                console.error('issue fetching food lib:', foodLibResolution.error.message)
            }
            //console.log('fetched food lib:', foodLibResolution.data)
            set({ foodLibrary: foodLibResolution.data || []})
            
            if (dailyEntResolution.error) {
                console.error('issue fetching daily entries:', dailyEntResolution.error.message)
            }
            //console.log('fetched food lib:', dailyEntResolution.data)
            
            set({ dailyEntries: dailyEntResolution.data || []})
        }
        catch (error) {
            console.error('issue fetching user food data:', error.message)
        }
    },

    addNewFood: async (userID, foodName, calroies, fat, carbs, protein, isPublic) => {
        const { data: newFood, error: newFoodError } = await supabase
        .from('Food Library')
        .insert([
            {
                user_id: userID,
                food_name: foodName,
                calories: calroies,
                fat: fat,
                carbs: carbs,
                protein: protein,
                is_public: isPublic
            }
        ])
        .select()

        if (newFoodError) {
            console.error('Error adding new food:', newFoodError.message)
            return
        }
        
        const curFoodLib = get().foodLibrary
        set({ foodLibrary: [...curFoodLib, newFood[0] ]})
        return newFood[0].id
    },

    addEntry: async (userID, targetID) => {
        const { data: addedFood, error: insertError } = await supabase
        .from('Daily Entries')
        .insert([
            {
                user_id: userID,
                food_id: targetID
            }
        ])
        .select()

        if (insertError) {
            console.error('Error adding new food:', insertError.message)
            return
        }
        
        const curEntries = get().dailyEntries
        set({ dailyEntries: [...curEntries, addedFood[0]] })
    },

    deleteFood: async (userID, curView, targetID) => {
        let table = null
        if (curView === 0) table = 'Daily Entries'
        else table = 'Food Library'

        //console.log('targetID:', targetID)
        //console.log('table:', table)
        //return
        const { error: deleteFoodError } = await supabase
        .from(table)
        .delete()   
        .eq('user_id', userID)
        .eq('id', targetID)
        .single()

        if (deleteFoodError) {
            console.error('Error deleting food:', deleteFoodError)
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
    }
}))

export default useFoodStore


/* Code Graveyard
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
*/
