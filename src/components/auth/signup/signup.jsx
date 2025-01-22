// 'use client';
// import React, { useState, useEffect } from "react";
// import '@styles/auth/Signup.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import Link from "next/link";
// import { useRouter } from 'next/navigation';
// import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, onAuthStateChanged } from "firebase/auth";
// import { ref, set, get } from 'firebase/database';
// import { auth, database } from '@firebase'; // Adjust this path based on your actual file structure
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import validator from 'email-validator';

// const Signup = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [generalError, setGeneralError] = useState('');
//     const [loading, setLoading] = useState(true); // Add loading state

//     const router = useRouter();

//     useEffect(() => {
//         // Check if user is already logged in
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 // Redirect if user is already logged in
//                 router.push('/'); // Redirect to home or another page
//             } else {
//                 setLoading(false); // Set loading to false when done
//             }
//         });

//         return () => unsubscribe(); // Cleanup subscription on unmount
//     }, [router]);

//     const validateEmail = (value) => {
//         if (!validator.validate(value)) {
//             return "Please enter a valid email address.";
//         }

//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailRegex.test(value)) {
//             return "Please enter a proper email address.";
//         }

//         return '';
//     };

//     const validatePassword = (value) => {
//         if (value.length < 8) {
//             return "Password should be at least 8 characters long.";
//         }
//         return '';
//     };

//     const checkEmailExists = async (email) => {
//         try {
//             const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//             return signInMethods.length > 0;
//         } catch (error) {
//             console.error("Error checking email existence:", error);
//             return false;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setGeneralError('');
//         setEmailError('');
//         setPasswordError('');

//         let emailErrorMessage = validateEmail(email);
//         let passwordErrorMessage = validatePassword(password);

//         if (emailErrorMessage || passwordErrorMessage) {
//             setEmailError(emailErrorMessage);
//             setPasswordError(passwordErrorMessage);
//             return;
//         }

//         // Check if email already exists
//         const emailExists = await checkEmailExists(email);
//         if (emailExists) {
//             setGeneralError('An account with this email already exists. Please log in.');
//             return;
//         }

//         // Create new user account
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;

//             const userRef = ref(database, 'usersData/' + user.uid);
//             await set(userRef, {
//                 uid: user.uid,
//                 email: user.email,
//                 firstName: email.split('@')[0],
//             });

//             router.push('/');
//         } catch (error) {
//             if (error.code === 'auth/email-already-in-use') {
//                 setGeneralError('An account with this email already exists. Please log in.');
//             } else {
//                 setGeneralError('An error occurred. Please try again.');
//             }
//             console.error('Error during signup:', error);
//         }
//     };

//     const handleGoogleSignIn = async () => {
//         try {
//             const provider = new GoogleAuthProvider();
//             const result = await signInWithPopup(auth, provider);
//             const user = result.user;
    
//             // Check if the user data already exists in the Firebase Realtime Database
//             const userRef = ref(database, 'usersData/' + user.uid);
//             const snapshot = await get(userRef);
            
//             if (snapshot.exists()) {
//                 // User already exists, so fetch their data
//                 const existingData = snapshot.val();
                
//                 // Load existing profile data (e.g., profile picture, phone number)
//                 // You can set the data in your component state if needed
//                 // setUserProfile(existingData); // Example: You might set this in a state
    
//             } else {
//                 // If the user doesn't exist, create a new entry
//                 await set(userRef, {
//                     uid: user.uid,
//                     email: user.email,
//                     firstName: user.email.split('@')[0],
//                     // Add any default values like profile pic or phone number if needed
//                     profilePic: null,
//                     phoneNumber: null,
//                 });
//             }
    
//             // Redirect user after successful sign-in
//             router.push('/');
//         } catch (error) {
//             if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//                 setGeneralError("Email or password is incorrect. Please try again.");
//             } else {
//                 setGeneralError("An error occurred. Please try again.");
//             }
//             console.error('Google Sign-In error:', error);
//         }
//     };
//     const togglePasswordVisibility = () => {
//         setShowPassword(prevShowPassword => !prevShowPassword);
//     };

//     // if (loading) {
//     //     return <p>Loading...</p>; // Display loading state while checking authentication
//     // }

//     return (
//         <div className="signup">
//             <div className="signup-container">
//                 <div className="signup-heading">
//                     <h1>Sign Up</h1>
//                     {generalError && <p style={{ color: "red", paddingBottom: "6px", textAlign: "center", fontSize: "12px", fontFamily: "var(--p-font)" }}>{generalError}</p>}
//                 </div>
//                 <form className="form" onSubmit={handleSubmit}>
//                     <Box component="div" className="email" noValidate autoComplete="off">
//                         <TextField
//                             id="outlined-email"
//                             label="Email"
//                             variant="outlined"
//                             className="custom-text-field"
//                             error={!!emailError}
//                             helperText={emailError}
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </Box>
//                     <Box component="div" className="password" noValidate autoComplete="off">
//                         <TextField
//                             id="outlined-password"
//                             label="Password"
//                             variant="outlined"
//                             type={showPassword ? "text" : "password"}
//                             className="custom-text-field"
//                             error={!!passwordError}
//                             helperText={passwordError}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             InputProps={{
//                                 endAdornment: (
//                                     <span className="eye" onClick={togglePasswordVisibility}>
//                                         <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//                                     </span>
//                                 ),
//                             }}
//                         />
//                     </Box>
//                     <div className="signup-button">
//                         <button className="signup-btn" type="submit">Sign Up</button>
//                     </div>
//                     <div className="google-signin">
//                         <button
//                             type="button"
//                             className="login-with-google-btn"
//                             onClick={handleGoogleSignIn}
//                         >
//                             Sign up with Google
//                         </button>
//                         <div>
//                             <p className="signup-terms">
//                                 By signing up, you agree to our <Link href="/terms-of-service">Terms of services</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.
//                             </p>
//                             {/* <p style={{ fontSize: "13px", fontFamily: "var(--p-font)", textAlign: "center", paddingTop: "14px" }}>
//                                 Already have an account? <Link href="/login">&nbsp;Login</Link>
//                             </p> */}
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Signup;

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@styles/auth/login.css';
import { auth } from '@firebase';  // Firebase auth import
import { getAuth, signInWithEmailLink } from 'firebase/auth';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import validator from 'email-validator';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isLinkSent, setIsLinkSent] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Handle Sign-In Link on initial page load
    useEffect(() => {
        if (window.location.search) {
            const queryParams = new URLSearchParams(window.location.search);
            const emailFromQuery = queryParams.get('email');
            const oobCode = queryParams.get('oobCode');
    
            console.log('Email:', emailFromQuery, 'oobCode:', oobCode); // Debugging log
    
            if (emailFromQuery && oobCode) {
                const auth = getAuth();
                setLoading(true);
    
                // Firebase requires the email to be saved in localStorage for link sign-in
                localStorage.setItem('emailForSignIn', emailFromQuery);
    
                signInWithEmailLink(auth, emailFromQuery, window.location.href)
                    .then(() => {
                        console.log('User signed in successfully');
                        router.push('/'); // Redirect after successful sign-in
                    })
                    .catch((error) => {
                        console.error('Error signing in:', error.message, error.code);
                        setGeneralError('Authentication failed. Please try again.');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setLoading(false);
                console.error('Error: Missing email or oobCode in URL.');
            }
        } else {
            setLoading(false);
        }
    }, [router]);
    

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
        setGeneralError('');
    };

    const validateEmail = (email) => {
        if (!validator.validate(email)) {
            return { valid: false, error: 'Invalid email format. Please use a proper email address.' };
        }

        const disposableEmailProviders = ['mailinator.com', 'guerrillamail.com', 'tempmail.com'];
        const emailDomain = email.split('@')[1];
        if (disposableEmailProviders.includes(emailDomain)) {
            return { valid: false, error: 'Disposable email addresses are not allowed. Please use a valid email address.' };
        }

        return { valid: true };
    };

    const storeUserData = async (email, method) => {
        // Extract the first name from the email
        const firstName = email.split('@')[0];
    
        try {
            // Store the data in the Firebase Realtime Database
            await axios.put(`https://prfecai-auth-default-rtdb.firebaseio.com/usersData/${firstName}.json`, {
                email,
                firstName,
                method,
            });
            console.log('User data stored successfully');
        } catch (error) {
            console.error('Error storing user data:', error);
            setGeneralError('Failed to store user data. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setEmailError('Email is required.');
            return;
        }

        const validation = validateEmail(email);
        if (!validation.valid) {
            setEmailError(validation.error);
            return;
        }

        try {
            const actionCodeSettings = {
                url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`,
                handleCodeInApp: true,
            };
            console.log(actionCodeSettings)

            // Call the backend to send the sign-in link
            await axios.post('http://localhost:5000/api/sendSignInEmail', {
                email,
                link: actionCodeSettings.url,
            });

            setIsLinkSent(true);
            await storeUserData(email, 'email');
        } catch (error) {
            console.error('Error sending link:', error);
            setGeneralError('Failed to send the verification link. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const email = user.email;

        // Store user data in Firebase
        await storeUserData(email, 'google');

        router.push('/');
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        setGeneralError('Failed to sign in with Google. Please try again.');
    }
    };

    // if (loading) return <div>Loading...</div>;

    return (
        <div className="login">
            <div className="login-container">
                <div className="login-heading">
                    <h1>Signup</h1>
                    {generalError && <div className="error-message">{generalError}</div>}
                </div>
                {isLinkSent ? (
                    <div className="success-message">
                        ✅ A verification link has been sent to <strong>{email}</strong>. Please check your inbox.
                    </div>
                ) : (
                    <form className="form" onSubmit={handleSubmit}>
                        <Box component="div" noValidate autoComplete="off" className="email">
                            <TextField
                                id="outlined-email"
                                label="Enter your Email"
                                variant="outlined"
                                className="custom-text-field"
                                error={!!emailError}
                                helperText={emailError}
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </Box>
                        <div className="login-button">
                            <button className="login-btn" type="submit">Continue with Email</button>
                        </div>
                        <div className="google-auth" style={{width: "100%", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center",gap:"1.5rem"}}>
                    {/* <h3 style={{ fontSize: "15px", fontFamily: "var(--p-font)", textAlign: "center", paddingTop: "14px", fontWeight:"400" }}>OR</h3> */}
                    <div className='google-signin'>
                        <button className="login-with-google-btn" onClick={handleGoogleSignIn}>
                            Continue with Google
                        </button>
                    </div>
                </div>
                    </form>
                )}

                <p className="signup-terms">
                    By signing up, you agree to our <Link href="https://prfec.ai/terms-of-service">Terms of services</Link> and <Link href="https://prfec.ai/privacy-policy">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
};

export default Login;
