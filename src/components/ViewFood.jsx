import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import ListFood from './ListFood.jsx'
import AddNewFood from './AddNewFood.jsx'
import useFoodStore from '../utils/useFoodStore.js'
import useUserStore from '../utils/useUserStore.js'
import { ErrorLogger } from '../utils/Debug.js'

/*=========================================================*/
//  TODO(s):
//      - (Implement later) Have setting in profile if they
//        want every food made to be public?
/*=========================================================*/

export default function ViewFood() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const userID = useUserStore((state) => state.userID)
    const getSession = useUserStore((state) => state.getSession)
    
    let activeView = []
    const curView = useFoodStore((state) => state.curView)
    const setCurView = useFoodStore((state) => state.setCurView)  
    const [searchParam, setSearchParam] = useState(0)
    
    const fetchDaily = useFoodStore((state) => state.fetchDaily)
    const fetchUserEntries = useFoodStore((state) => state.fetchUserEntries)
    const fetchFoodLib = useFoodStore((state) => state.fetchFoodLib)
    const dailyEntries = useFoodStore((state) => state.dailyEntries)
    const userEntries = useFoodStore((state) => state.userEntries)
    const foodLibrary = useFoodStore((state) => state.foodLibrary)
    
    useEffect(() => {
        document.title = "Macros App | ViewFood"

        const handleDataFetch = async() => {
            try {
                const userID = await getSession(navigate)

                if (!userID) {
                    console.warn('Issue with fetching userID')
                    return
                }
                fetchDaily(userID)
                fetchUserEntries(userID)
                fetchFoodLib(userID, searchParam)
            }
            catch (error) {
                ErrorLogger('ViewFood.jsx - handleDataFetch', error)
                return
            }
        }
        handleDataFetch()
    }, [navigate, searchParam])

    const handlePagination = (searchParam, pageBool) => {

        if (searchParam > 0 && !pageBool) {
            setSearchParam(searchParam - 1)
            return
        }

        if (pageBool) {
            setSearchParam(searchParam + 1)
        }

    }

    if (curView === 'Daily Entries') activeView = dailyEntries
    else if (curView === 'User Entries') activeView = userEntries
    else if (curView === 'Food Library') activeView = foodLibrary
    
    return (
        <>
        <div>
            <h3>This is the Food Library!</h3>
        </div>
        <div>
            <button 
                onClick={() => navigate(-1)} 
                style={{margin: '10px'}}
            >
                Back to Dashboard
            </button>
        </div>
        <div>
            <button onClick={() => setCurView("Daily Entries")}>Daily Entries</button>
            <button onClick={() => setCurView("User Entries")}>Your Entries</button>
            <button onClick={() => setCurView("Food Library")}>Food Library</button>
        </div>

        <ListFood 
            userID={userID}
            activeView={activeView}
        />
        
        <div>
            <button 
                onClick={() => handlePagination(searchParam, false)} 
                style={{ margin: '10px' }}
            >
                Prev
            </button>
            <button 
                onClick={() => handlePagination(searchParam, true)} 
                style={{ margin: '10px' }}
            >
                Next
            </button>
        </div>
        <div>
            <button onClick={() => setIsOpen(true)}>Add New Food</button>
        </div>
        <AddNewFood 
            userID={userID}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        />
        </>
    )
}
