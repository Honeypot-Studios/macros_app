import { useNavigate, Link } from 'react-router-dom'

import useUserStore from '../utils/useUserStore.js'

import '../assets/TopBar.css'

/*=========================================================*/
//  TODO(s):
//      - Implement this shit
/*=========================================================*/

export default function TopBar() {
    const navigate = useNavigate()

    const userID = useUserStore((state) => state.userID)
    const setUserID = useUserStore((state) => state.setUserID)

    const handleSignOut = async () => {
        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) console.error('Error signing out:', signOutError.message)
        else {
            console.log('Signed out successfully')
            setUserID(null)
            navigate('/')
        }
    }

    return (
        <nav className='navbar'>
            <div className='navbar-left'>
                <h2 onClick={() => navigate('/Dashboard')} className='logo'>
                    MacroApp
                </h2>
                <ul className='nav-links'>
                    <li><Link to='/Dashboard' className='nav-links'>Dashboard</Link></li>
                    <li><Link to='/ViewFood' className='nav-links'>Food Library</Link></li>
                </ul>
            </div>
            <div className='navbar-right'>
                {userID ? (
                    <button onClick={handleSignOut} className='login-btn'>Sign Out</button>
                ) : (
                    <button onClick={() => navigate('/SignIn')} className='login-btn'>Sign In</button>
                )}
            </div>
        </nav>
    )
}
