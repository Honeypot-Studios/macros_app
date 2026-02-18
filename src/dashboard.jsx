import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate();
    const [items, setItems] = useState([])
    const [userID, setUserID] = useState(null)
    const [loading, setLoading] = useState(true)    
    
    useEffect(() => {
        document.title = "MacrosApp | Dashboard"
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (session) setUserID(session.user.id)
                else {
                    if (error) console.error('Error fetching session:', error)
                    navigate('/')                
                }
            } catch (error) {
                console.error('Error encountered:', error)
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        getSession()
    }, [navigate])

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) console.error('Error signing out:', error)
        else {
            console.log('Signed out successfully')
            setUserID(null)
            navigate('/')
        }
    }

    if (loading) {
        return (
            console.log('Loading session...'),
            <div>Loading...</div>
        )
    }

    return (
        <>
        <div>
            <h1>Dashboard</h1>
            <p>Put stuff here</p>
            <button onClick={handleSignOut}>Go Back to log in</button>
        </div>
        <MacroTotal items={items}/>
        <LogFood userID={userID} items={items} setItems={setItems}/>
        </>
    )
}

function MacroTotal({items}) {
    const totals = items.reduce((acc, item) => ({
        calories: acc.calories + Number(item.calories),
        fat: acc.fat + Number(item.fat),
        carbs: acc.carbs + Number(item.carbs),
        protein: acc.protein + Number(item.protein),
    }), {calories: 0, fat: 0, carbs: 0, protein: 0})

    return (
        <>
        <div>
            <h2>Macro Totals</h2>
            <p>Calories: {totals.calories}</p>
            <p>Fat: {totals.fat}g</p>
            <p>Carbs {totals.carbs}g:</p>
            <p>Protein: {totals.protein}g</p>
        </div>
        </>
    )
}

function LogFood({ userID, items, setItems }) {
    const [foodName, setFoodName] = useState('')
    const [foodcalories, setCalories] = useState('')
    const [foodfat, setFat] = useState('')
    const [foodcarbs, setCarbs] = useState('')
    const [foodprotein, setProtein] = useState('')

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
            setCalories('')
            setFat('')
            setCarbs('')
            setProtein('')
            fetchTodayFoods()
            //fetchFoods()
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
            //fetchTodayFoods()
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

    const fetchTodayFoods = async () => {
        const date = new Date();
        const formatted = date.toISOString().split('T')[0];

        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextDay = tomorrow.toISOString().split('T')[0];
        const { data, error} = await supabase
        .from('Food Log')
        .select('*')
        .eq('user_id', userID)
        .gte('created_at', `${formatted}T00:00:00`)
        .lt('created_at', `${nextDay}T00:00:00`)
        if (error) console.error('Error:', error)
        else {
            console.log('Fetched:', data)
            setItems(data)
        }
    }

    useEffect(() => {
        if (userID) fetchTodayFoods()       
    }, [userID])

    return (
        <>
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                addFood()
                }}>
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
                    <button type="submit">Log New Food</button>     
                </div>
            </form>
            <button onClick={fetchFoods}>Fetch All Foods</button>
            <button onClick={fetchTodayFoods}>Fetch Todays Foods</button>
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
