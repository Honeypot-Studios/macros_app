import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient.js'
import { useNavigate } from 'react-router-dom'

/*===================================================================*/
//  TO DO(s):
//    - (Implemented) make bfp optional for users to input
//    - (Maybe) make optional to add phone numbers
//      - Need to normalize numbers, use libphonenumber-js
/*===================================================================*/

export default function SignUp() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)

    useEffect(() => {
        document.title = "Macros App | Sign Up"
    }, [])

    const [signUpData, setFormData] = useState({
        name: '',
        //userName: '',
        email: '',
        password: '',
        height: '',
        weight: '',
        age: '',
        gender: '',
        bfp: '',
        activityLevel: 1.2 // Default as sedentary activity level
    })

    const handleSignUp = async (email, password, name, height, weight, age, gender, bfp, activityLevel) => {
        setLoading(true)    // Prevent multiple submissions
        
        const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                // When adding new data match string to left of ":"
                // in the "Handle new user trigger" in SQL Editor
                name: name,

                //username: userName,

                height: height,
                weight: weight,
                age: age, 
                gender: gender,
                bfp: (bfp === '' ? 0 : bfp),
                activity_level: activityLevel
                }
            }
        })
        
        if (signUpError) {
            console.error('Error signing up:', signUpError.message)
            setLoading(false)
            return
        }
        console.log('Signed up:', data)
        setLoading(false)
        navigate('/dashboard')
    }

    const prevStep = () => setStep((prev) => prev - 1)
    const handleNext = () => {
        // MAKE SURE A USER FILLS OUT ALL FIELDS BEFORE MOVING TO NEXT STEP
        if (step === 1) {
            if (!signUpData.name) {
                alert('Please enter a name')
                return
            }
        } else if (step === 2) {
            if (!signUpData.height ||
                !signUpData.weight ||
                !signUpData.age ||
                !signUpData.gender ||
                !signUpData.activityLevel)
            {
                alert('Please fill out all fields')
                return
            }
        } else if (step === 3) {
            if (!signUpData.email) {
                alert('Please enter your email')
                return
            }
        } else if (step === 4) {
            if (!signUpData.password) {
                alert('Please enter a password')
                return
            }
        }
        
        setStep((prev) => prev + 1)
    }

    // CONFIRM IF A USER WANTS TO LEAVE SIGN UP BEFORE COMPLETING
    const handleExit = () => {
        if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
            navigate(-1)
        }
    }

    return (
        <>
        <form onSubmit={(e) => {
            e.preventDefault()
            handleSignUp(
                signUpData.email,
                signUpData.password,
                signUpData.name,
                signUpData.height,
                signUpData.weight,
                signUpData.age,
                signUpData.gender,
                signUpData.bfp,
                signUpData.activityLevel
            )
        }}>
            {step === 1 && (
                <div>
                <h2>First name?</h2>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={signUpData.name}
                        onChange={(e) => setFormData({ ...signUpData, name: e.target.value })}
                        required
                    />
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>User info</h2>
                    <p>please provide some information about yourself</p>
                    <input
                        type="number"
                        placeholder="Height"
                        value={signUpData.height}
                        onChange={(e) => setFormData({ ...signUpData, height: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Weight"
                        value={signUpData.weight}
                        onChange={(e) => setFormData({ ...signUpData, weight: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={signUpData.age}
                        onChange={(e) => setFormData({ ...signUpData, age: e.target.value })}
                        required
                    />
                    <select
                        value={signUpData.gender}
                        onChange={(e) => setFormData({ ...signUpData, gender: e.target.value })}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <div>
                        <input
                            type="number"
                            placeholder="15%"
                            value={signUpData.bfp}
                            onChange={(e) => setFormData({ ...signUpData, bfp: e.target.value })}
                        />
                    </div>
                    <select
                        value={signUpData.activityLevel}
                        onChange={(e) => setFormData({ ...signUpData, activityLevel: e.target.value })}
                        required
                    >
                        <option value={1.2}>Sedentary (Little to no exercise)</option>
                        <option value={1.375}>Lightly Active (light exercise)</option>
                        <option value={1.55}>Moderately active (moderate exercise)</option>
                        <option value={1.725}>Very active (hard exercise)</option>
                        <option value={1.9}>Super active (very hard exercise/physical job)</option>
                    </select>
                    <button type="button" onClick={prevStep}>Back</button>
                    <button type="button" onClick={handleNext}>Next</button>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2>Email</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={signUpData.email}
                        onChange={(e) => setFormData({ ...signUpData, email: e.target.value })}
                        required
                    />
                    <button type="button" onClick={prevStep}>Back</button>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}

            {step === 4 && (
                <div>
                    <h2>Create password</h2>
                    <input
                        type="password"
                        placeholder="Password"
                        value={signUpData.password}
                        onChange={(e) => setFormData({ ...signUpData, password: e.target.value })}
                        required
                    />
                    <button type="button"onClick={prevStep}>Back</button>
                    <button type="button" onClick={handleNext}>Next</button>
                </div>
            )}

            {step === 5 && (
                <div>
                    <h2>Verify info</h2>
                    <p>Name: {signUpData.name}</p>
                    <button type="button" onClick={() => setStep(1)}>Edit</button>

                    <p>Height: {signUpData.height}</p>
                    <p>Weight: {signUpData.weight}</p>
                    <p>Age: {signUpData.age}</p>
                    <p>Gender: {signUpData.gender}</p>
                    <button type="button" onClick={() => setStep(2)}>Edit</button>

                    <p>Email: {signUpData.email}</p>
                    <button type="button" onClick={() => setStep(3)}>Edit</button>
                    
                    <div>
                        <button onClick={prevStep}>Back</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            )}
        </form>
        <div>
            <button type="button" onClick={handleExit}>Go Back</button>
            <button type="button"onClick={handleNext}>Next</button>
        </div>
        </>
    )
}
