// function Auth() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const handleSignUp = async () => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     })
//     if (error) console.error('Error:', error.message)
//     else console.log('User created:', data)
//   }

//   const handleSignIn = async () => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     if (error) console.error('Error:', error.message)
//     else console.log('Logged in:', data)
//   }

//   const handleSignOut = async () => {
//     await supabase.auth.signOut()
//   }

//   return (
//     <div>
//       <h2>Auth</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleSignUp}>Sign Up</button>
//       <button onClick={handleSignIn}>Sign In</button>
//       <button onClick={handleSignOut}>Sign Out</button>
//     </div>
//   )
// }
