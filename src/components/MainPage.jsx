import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../assets/App.css'


export default function MainPage() {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Macros App | Main Page"
    }, [])

    return (
        <>
        <div>
            <button onClick={() => navigate('/SignIn')}>Go To Sign In</button>
            <button onClick={() => navigate('/SignUp')}>Go To Sign Up</button>
        </div>
        </>
    )
}