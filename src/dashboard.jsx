import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'
import './dashboard.css'

function Dashboard() {
    const navigate = useNavigate();
    
    const [userID, setUserID] = useState(null)
    const [userData, setUserData] = useState(null)
    const [items, setItems] = useState([])  // User's food log
    const [todayItems, setTodayItems] = useState([])

    const [loading, setLoading] = useState(true)
    const [isPopUpOpen, setIsPopUpOpen] = useState(false)

    useEffect(() => {
        document.title = "MacrosApp | Dashboard"
        
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (session) {
                    setUserID(session.user.id)
                    fetchUserData(session.user.id)
                    fetchUserFoodData(session.user.id)
                }
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

    const fetchUserData = async (uid) => {
        const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', uid)
        .single()

        if (userError) console.log('Invalid User', userError)
        else {
            console.log('Retrieved User Data', user)
            setUserData(user)
        }
    }
    
    const fetchUserFoodData = async (uid) => {
        const { data: foodLog, foodError } = await supabase
        .from('Food Log')
        .select('*')
        .eq('user_id', uid)

        if (foodError) console.log('Error retrieving Food Log', foodError)
        else {
            console.log('Retrieved Food Log', foodLog)
            setItems(foodLog)

            const today = new Date().toISOString().split('T')[0]
            const filteredToday = foodLog.filter(item => item.created_at.startsWith(today))
            setTodayItems(filteredToday)
        }
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
            <button onClick={handleSignOut}>Go Back to log in</button>
        </div>
        <CalculateDailyGoal
            items={items}
            userData={userData}
        />

        <div>
            <button onClick={() => setIsPopUpOpen(true)}>Add Food</button>
            <FoodLogPopUp
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                userID={userID}
                items={items}
                todayItems={todayItems}
                setItems={setItems}
                setTodayItems={setTodayItems}
            />
        </div>
        <MacroTotal items={todayItems}/>
        </>
    )
}

function MacroTotal({items}) {
    if (!items) {
        return (
            <div>
                <p>calculating...</p>
            </div>
        )
    }

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

function LogFood({ userID, items, todayItems, setItems, setTodayItems }) {
    const [loading, setLoading] = useState(false)
    const [foodLogView, setFoodLogView] = useState(0)

    const [foodName, setFoodName] = useState('')
    const [foodcalories, setCalories] = useState('')
    const [foodfat, setFat] = useState('')
    const [foodcarbs, setCarbs] = useState('')
    const [foodprotein, setProtein] = useState('')

    const addFood = async () => {
        setLoading(true)
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

            setItems(prevToday => [...prevToday, data[0]])
            setTodayItems(prevToday => [...prevToday, data[0]])

            setFoodName('')
            setCalories('')
            setFat('')
            setCarbs('')
            setProtein('')
        }
        setLoading(false)
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
            // updating both food object arrays, upadting UI
            setItems(prevItems => prevItems.filter(item => item.id !== targetID))
            setTodayItems(prevTodayItems => prevTodayItems.filter(item => item.id !== targetID))
        }
    }

    const changeView = (setFoodLogView) => {
        if (setFoodLogView === 0) return todayItems
        return items
    }

    return (
        <>
        <div className='popUpWrapper'>
            <div className='leftSection'>
                <h3 className='popUpText' >Log Food</h3>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    addFood()
                }}>
                    <p className='popUpText'>Food Name:</p>
                    <input
                        type="text"
                        placeholder="e.g. Chicken Breast"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        required
                    />

                    <p className='popUpText'>Calories:</p>
                    <input
                        type="number"
                        placeholder="e.g. 250"
                        value={foodcalories}
                        onChange={(e) => setCalories(e.target.value)}
                        required
                    />

                    <p className='popUpText'>Grams of Fat:</p>
                    <input
                        type="number"
                        placeholder="e.g. 11"
                        value={foodfat}
                        onChange={(e) => setFat(e.target.value)}
                        required
                    />

                    <p className='popUpText'>Grams of Carbs:</p>
                    <input
                        type="number"
                        placeholder="e.g. 67"
                        value={foodcarbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        required
                    />
                    
                    <p className='popUpText'>Grams of Proetin:</p>
                    <input
                        type="number"
                        placeholder="e.g. 21"
                        value={foodprotein}
                        onChange={(e) => setProtein(e.target.value)}
                        required
                    />
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Log New Food'}
                        </button>   
                    </div>
                </form>
                <button onClick={ () => setFoodLogView(1) }>Fetch All Foods</button>
                <button onClick={ () => setFoodLogView(0) }>Fetch Todays Foods</button>
            </div>
            <div className='rightSection'>
                <h3 className='popUpText'>Log History</h3>
                <div className='foodListContainer'>
                    <ul>
                    {changeView(foodLogView).map((item) => (
                        <li key={item.id} className='popUpText' style={{ marginBottom: '10px' }}>
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
            </div>
        </div>
        </>
    )
}

function CalculateDailyGoal( { items, userData }) {
    // Don't calculate if userData or items hasn't been retrieved yet
    if (!userData || !items) {
        return (
            <div>
                <p>calculating...</p>
            </div>
        )
    }
    /*
    const [goals, setGoal] = useState({
        totalCalories: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalProtein: 0
    })
    */
    const convert = () => {
        const heightcm = ((userData.height_feet * 12) + userData.height_inches)*2.54
        const weightKg = userData.weight_lbs * 0.453592
        return { heightcm, weightKg }
    }

    const calculatedBMR = () => {
        const { heightcm, weightKg } = convert()
        
        if (userData.gender === 'male') {
            const bmr = (10 * weightKg) + (6.25 * heightcm) - (5 * userData.age) + 5
            return bmr
        } else if (userData.gender === 'female') {
            const bmr = (10 * weightKg) + (6.25 * heightcm) - (5 * userData.age) - 161
            return bmr
        } else {
            console.log('Invalid gender value', userData.gender)
            return
        }
    }

    const calculatedTDEE = () => {
        const bmr = calculatedBMR()
        const tdee = bmr * 1.55 // for now testing with moderate activity multiplier
        return tdee
    }

    const proteinPercentage = () => {
        const tdee = calculatedTDEE()
        const proteinGrams = (userData.weight_lbs * 4) / tdee
        return proteinGrams
    }

    const tdee = calculatedTDEE()
    const proteingrams = proteinPercentage()

    return (
        <>
        <div>
            <h3>Daily Goal</h3>
            <p>Calories: {parseInt(tdee)}</p>
            <p>Fat: {parseInt((tdee * (1 - (proteingrams + 0.4))) / 9)}g</p>
            <p>Carbs: {parseInt((tdee * 0.4) / 4)}g</p>
            <p>Protein: {parseInt((tdee * proteingrams) / 4)}g</p>
        </div>
        </>
    )
}

const FoodLogPopUp = ( { isOpen, onClose, userID, items, todayItems, setItems, setTodayItems } ) => {
    if (!isOpen) return

    return (
        <>
        <div className='overlay'>
            <div className='modal'>
                <button className='closeBtn' onClick={onClose}>X</button>
                <LogFood
                    userID={userID}
                    items={items}
                    todayItems={todayItems}
                    setItems={setItems}
                    setTodayItems={setTodayItems}
                />
            </div>
        </div>
        </>
    )
}

export default Dashboard


// CODE GRAVEYARD
    /*
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
        const { data, error } = await supabase
        .from('Food Log')
        .select('*')
        .eq('user_id', userID)
        .gte('created_at', `${formatted}T00:00:00`)
        .lt('created_at', `${nextDay}T00:00:00`)

        if (error) console.error("Error fetching today's food:", error)
        else {
            console.log("Fetched today's food:", data)
            setItems(data)
        }
    }
    */