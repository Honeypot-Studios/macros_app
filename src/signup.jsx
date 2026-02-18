import { useState } from 'react'
import { supabase } from './supabaseClient.js'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)

    const [signUpFormData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        heightFeet: '',
        heightInches: '',
        weight: '',
        age: '',
        gender: ''
    })

    const handleSignUp = async () => {
        setLoading(true)    // Prevent multiple submissions
        
        const { data, error } = await supabase.auth.signUp({
        email: signUpFormData.email,
        password: signUpFormData.password,
        options: {
            data: {
                // When adding new data match string to left of ":"
                // in the "Handle new user trigger" in SQL Editor
                name: signUpFormData.name,
                height_feet: signUpFormData.heightFeet,
                height_inches: signUpFormData.heightInches,
                weight_lbs: signUpFormData.weight,
                age: signUpFormData.age, 
                gender: signUpFormData.gender
                }
            }
    })

        if (error) {
            console.error('Error signing up:', error.message)
            setLoading(false)
            return
        }
        console.log('Signed up:', data)
        navigate('/dashboard')
    }

    const prevStep = () => setStep((prev) => prev - 1)
    const handleNext = () => {
        // MAKE SURE A USER FILLS OUT ALL FIELDS BEFORE MOVING TO NEXT STEP
        if (step === 1) {
            if (!signUpFormData.name) {
                alert('Please enter your name')
                return
            }
        } else if (step === 2) {
            if (!signUpFormData.heightFeet ||
                !signUpFormData.heightInches ||
                !signUpFormData.weight ||
                !signUpFormData.age ||
                !signUpFormData.gender)
            {
                alert('Please fill out all fields')
                return
            }
        } else if (step === 3) {
            if (!signUpFormData.email) {
                alert('Please enter your email')
                return
            }
        } else if (step === 4) {
            if (!signUpFormData.password) {
                alert('Please enter a password')
                return
            }
        }
        
        setStep((prev) => prev + 1)
    }

    // CONFIRM IF A USER WANTS TO LEAVE SIGN UP BEFORE COMPLETING
    const handleExit = () => {
        if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
            navigate('/')
        }
    }

    return (
        <>
        <form onSubmit={(e) => {
            e.preventDefault()
            handleSignUp()
        }}>

            {step === 1 && (
                <div>
                <h2>First name?</h2>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={signUpFormData.name}
                        onChange={(e) => setFormData({ ...signUpFormData, name: e.target.value })}
                        required
                    />
                    <button type="button"onClick={handleNext}>Next</button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>User info</h2>
                    <p>please provide some information about yourself</p>
                    <input
                        type="number"
                        placeholder="Height (feet)"
                        value={signUpFormData.heightFeet}
                        onChange={(e) => setFormData({ ...signUpFormData, heightFeet: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Height (inches)"
                        value={signUpFormData.heightInches}
                        onChange={(e) => setFormData({ ...signUpFormData, heightInches: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="weight (lbs)"
                        value={signUpFormData.weight}
                        onChange={(e) => setFormData({ ...signUpFormData, weight: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={signUpFormData.age}
                        onChange={(e) => setFormData({ ...signUpFormData, age: e.target.value })}
                        required
                    />
                    <select
                        value={signUpFormData.gender}
                        onChange={(e) => setFormData({ ...signUpFormData, gender: e.target.value })}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
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
                        value={signUpFormData.email}
                        onChange={(e) => setFormData({ ...signUpFormData, email: e.target.value })}
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
                        value={signUpFormData.password}
                        onChange={(e) => setFormData({ ...signUpFormData, password: e.target.value })}
                        required
                    />
                    <button type="button"onClick={prevStep}>Back</button>
                    <button type="button" onClick={handleNext}>Next</button>
                </div>
            )}

            {step === 5 && (
                <div>
                    <h2>Verify info</h2>
                    <p>Name: {signUpFormData.name}</p>
                    <button type="button" onClick={() => setStep(1)}>Edit</button>

                    <p>Height, feet: {signUpFormData.heightFeet} ft</p>
                    <p>Height, inches:{signUpFormData.heightInches} inches</p>
                    <p>Weight: {signUpFormData.weight} lbs</p>
                    <p>Age: {signUpFormData.age}</p>
                    <p>Gender: {signUpFormData.gender}</p>
                    <button type="button" onClick={() => setStep(2)}>Edit</button>

                    <p>Email: {signUpFormData.email}</p>
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
            <button type="button" onClick={handleExit}>Back to Login</button>
        </div>
        </>
    )
}

export default SignUp
