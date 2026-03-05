import { create } from 'zustand'
import { supabase } from './supabaseClient.js'

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
                console.error('Error fetching session:', sessionError.message)
                navigate('/')
                return
            }
            set({ userID: session.user.id })
            //fetchUserData(session.user.id)
        } catch (error) {
            console.error('Error encountered:', error.message)
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
            console.error('Invalid User', fetchError.message)
            return
        }

        //console.log('Retrieved User Data', fetchedUserData)
        set({ userData: fetchedUserData})
    }
}))

export default useUserStore