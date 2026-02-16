import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate();
    const [userID, setUserID] = useState(null)
    const [loading, setLoading] = useState(true)    
    
    useEffect(() => {
        document.title = "MacrosApp | Dashboard"
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (session) setUserID(session.user.id)
            else {
                console.error('Error fetching session:', error)
                navigate('/')                
            }
            setLoading(false)
        }
        getSession()
    })

    if (loading) {
        return (
            console.log('Loading session...'),
            <div>Loading...</div>
        )
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) console.error('Error signing out:', error)
        else {
            console.log('Signed out successfully')
            setUserID(null)
            navigate('/')
        }
    }

    return (
        <>
        <div>
            <h1>Dashboard</h1>
            <p>Put stuff here</p>
            <button onClick={handleSignOut}>Go Back to log in</button>
        </div>
        <LogFood userID={userID} />
        </>
    )
}


function LogFood({ userID }) {
    const [items, setItems] = useState([])

    const [foodName, setFoodName] = useState('')
    const [foodcalories, setCalories] = useState(0)
    const [foodfat, setFat] = useState(0)
    const [foodcarbs, setCarbs] = useState(0)
    const [foodprotein, setProtein] = useState(0)

    const addFood = async () => {
        const { data, error } = await supabase
        .from('Food Log')
        .insert([
            {
                user_id: userID,
                food_name: foodName,
                calories: foodcalories,
                fat: foodfat,
                carbs:foodcarbs,
                protein: foodprotein,
            }
        ])
        .select()
        
        if (error) console.error('Error:', error)
        else {
            console.log('Added:', data)
            setFoodName('')
            setCalories(0)
            setFat(0)
            setCarbs(0)
            setProtein(0)
            fetchFoods()
        }
    }

    const deleteFood = async (targetID) => {
        const { data, error } = await supabase
        .from('Food Log')
        .delete()
        .eq('user_id', userID)
        .eq('id', targetID)
        .select()
        
        if (error) console.error('Error:', error)
        else {
            console.log('Deleted:', data)
            fetchFoods()
        }
    }

    const fetchFoods = async () => {
        const { data, error } = await supabase
        .from('Food Log')
        .select('*')
        .eq('user_id', userID)
        
        if (error) console.error('Error:', error)
        else {
            console.log('Fetched:', data)
            setItems(data)
        }
    }

    useEffect(() => {
        if (userID) fetchFoods()
    })

    return (
        <>
        <div>
            <form>
            <input
                type="text"
                placeholder="e.g. Chicken Breast"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="e.g. 250"
                value={foodcalories}
                onChange={(e) => setCalories(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="e.g. 11"
                value={foodfat}
                onChange={(e) => setFat(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="e.g. 67"
                value={foodcarbs}
                onChange={(e) => setCarbs(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="e.g. 21"
                value={foodprotein}
                onChange={(e) => setProtein(e.target.value)}
                required
            />

            <div>
                <button onClick={addFood}>Log New Food</button>     
            </div>
            </form>
            <button onClick={fetchFoods}>Fetch All Foods</button>
        </div>
        <div>
            <h3>Log History</h3>
            <ul>
            {items.map((item) => (
                <li key={item.id} style={{ marginBottom: '10px' }}>
                Food: {item.food_name ? `${item.food_name} ` : `${0} `}
                - Calories: {item.calories ? `${item.calories} ` : `${0} `}
                - Fat: {item.fat ? `${item.fat} ` : `${0} `}
                - Carbs: {item.carbs ? `${item.carbs} ` : `${0} `}
                - Protein: {item.protein ? `${item.protein}` : `${0}`}
                <button onClick={() => deleteFood(item.id)} style={{ marginLeft: '10px' }}>
                    Delete
                </button>
                </li>
            ))}
            </ul>
        </div>
        </>
    )
}

export default Dashboard
