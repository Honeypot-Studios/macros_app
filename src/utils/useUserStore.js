import { create } from 'zustand'
import { supabase } from './supabaseClient.js'

import { ErrorLogger } from './Debug.js'

const useUserStore = create((set, get) => ({
    loading: false,
    userID: null,
    userData: [],

    setUserID: (id) => set({ userID: id }),
    setUserData: (uData) => set({ userData: uData }),
    setLoading: (load) => set({ loading: load }),

    getSession: async (navigate) => {
        set({ loading: true })

        try {
            const { data: { session } , error: sessionError } = await supabase.auth.getSession()

            if (!session || sessionError) {
                ErrorLogger('useUserStore.js - getSession', sessionError)
                navigate('/')
                return
            }

            set({ userID: session.user.id })
        } catch (error) {
            ErrorLogger('useUserStore.js - getSession', error)
            navigate('/')
            return
        } finally {
            set({ loading: false })
        }

        return get().userID
    },

    fetchUserData: async (userID) => {
        const { data: fetchedUserData, error: fetchError } = await supabase
        .from('User Profiles')
        .select('*')
        .eq('user_id', userID)
        .single()

        if (fetchError) {
            ErrorLogger('useUserStore.js - fetchUserData', fetchError)
            return
        }

        //console.log('Retrieved User Data', fetchedUserData)
        set({ userData: fetchedUserData})
    },

    checkDelete: async(userID) => {
        const { data: profile, error: fetchError } = await supabase
        .from('User Profiles')
        .select('deleted_at')
        .eq('user_id', userID)
        .single()

        if (fetchError) {
            ErrorLogger('useUserStore.js - checkDelete', fetchError)
            return
        }
        
        if (profile.deleted_at) {
            return true
        }
        return false
    }
}))

export default useUserStore