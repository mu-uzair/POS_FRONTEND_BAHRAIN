// import { useMutation } from '@tanstack/react-query';
// import React, { useState } from 'react'
// import { login } from "../../https/index"
// import { enqueueSnackbar } from "notistack"
// import { useDispatch } from "react-redux"
// import { setUser } from "../../redux/slice/userSlice"
// import { useNavigate } from "react-router-dom"

// const Login = () => {

//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const [formData, setFormData] = useState({


//         email: "",
//         password: "",

//     });

//     const handleChange = (e) => {

//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     }




//     const handleSubmit = (e) => {
//         e.preventDefault();
//         loginMutation.mutate(formData);

//     }

//     const loginMutation = useMutation({

//         mutationFn: (reqData) => login(reqData),
//         onSuccess: (res) => {
//             const { data } = res;
//             document.cookie = `accessToken=${data.token}; path=/; max-age=86400; Secure; SameSite=Strict`;

//             console.log(data);
//             console.log("Cookies in JavaScript:", document.cookie);
//             const { _id, name, email, phone, role } = data.data;
//             dispatch(setUser({ _id, name, email, phone, role }));
//             navigate("/");
//         },
//         onError: (error) => {
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error" });
//         }
//     })


//     return (
//         <div>
//             <form onSubmit={handleSubmit}>



//                 <div className="classname">
//                     <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
//                         Employee Email
//                     </label>
//                     <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
//                         <input
//                             type="text"
//                             name='email'
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder='Enter employee email'
//                             className='bg-transparent flex-1 text-white focus:outline-none'
//                             required
//                         />

//                     </div>

//                 </div>



//                 <div className="classname">
//                     <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
//                         Password
//                     </label>
//                     <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
//                         <input
//                             type="password"
//                             name='password'
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder='Enter password'
//                             className='bg-transparent flex-1 text-white focus:outline-none'
//                             required
//                         />

//                     </div>

//                 </div>



//                 <button type='submit' className='w-full rounded mt-6 py-3 text-lg bg-yellow-400 text-grey-900 font-bold'>
//                     Sign in</button>
//             </form>
//         </div>
//     )
// }

// export default Login


// import { useMutation } from '@tanstack/react-query';
// import React, { useState } from 'react'
// import { login } from "../../https/index"
// import { enqueueSnackbar } from "notistack"
// import { useDispatch } from "react-redux"
// import { setUser } from "../../redux/slice/userSlice"
// import { useNavigate } from "react-router-dom"

// const Login = () => {

//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         loginMutation.mutate(formData);
//     }

//     const loginMutation = useMutation({
//         mutationFn: (reqData) => login(reqData),
//         onSuccess: (res) => {
//             const { data } = res;
//             document.cookie = `accessToken=${data.token}; path=/; max-age=86400; Secure; SameSite=Strict`;

//             console.log(data);
//             console.log("Cookies in JavaScript:", document.cookie);
            
//             const { _id, name, email, phone, role } = data.data;
            
//             // ✅ Save to Redux
//             dispatch(setUser({ _id, name, email, phone, role }));
            
//             // ✅ Save to localStorage for password-protected actions
//             const userData = { _id, name, email, phone, role };
//             localStorage.setItem("user", JSON.stringify(userData));
//             console.log("✅ User data saved to localStorage:", userData);
            
//             navigate("/");
//         },
//         onError: (error) => {
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error" });
//         }
//     })

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <div className="classname">
//                     <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
//                         Employee Email
//                     </label>
//                     <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
//                         <input
//                             type="text"
//                             name='email'
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder='Enter employee email'
//                             className='bg-transparent flex-1 text-white focus:outline-none'
//                             required
//                         />
//                     </div>
//                 </div>

//                 <div className="classname">
//                     <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
//                         Password
//                     </label>
//                     <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
//                         <input
//                             type="password"
//                             name='password'
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder='Enter password'
//                             className='bg-transparent flex-1 text-white focus:outline-none'
//                             required
//                         />
//                     </div>
//                 </div>

//                 <button type='submit' className='w-full rounded mt-6 py-3 text-lg bg-yellow-400 text-grey-900 font-bold'>
//                     Sign in
//                 </button>
//             </form>
//         </div>
//     )
// }

// export default Login

// edit for offline support


import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { login } from "../../https/index"
import { enqueueSnackbar } from "notistack"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux/slice/userSlice"
import { useNavigate } from "react-router-dom"
import { saveOfflineSession, tryOfflineLogin } from '../../utils/authOffline'; // ⬅️ NEW IMPORTS
import { getOfflineOrders } from '../../utils/offlineOrders'; // ⬅️ NEW IMPORT

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // 📌 UI STATE FOR OFFLINE ORDERS
    const [offlineOrdersCount, setOfflineOrdersCount] = useState(0);

    React.useEffect(() => {
        // Check for offline orders when the component mounts (for informational message)
        const checkOfflineOrders = async () => {
            if (!navigator.onLine) {
                const orders = await getOfflineOrders();
                setOfflineOrdersCount(orders.length);
            }
        };
        checkOfflineOrders();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // 📌 NEW ASYNC SUBMIT HANDLER
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;
        
        if (navigator.onLine) {
            // --- ONLINE LOGIN ---
            loginMutation.mutate({ email, password });
        } else {
            // --- OFFLINE LOGIN ---
            try {
                // Try to authenticate against local storage
                const user = await tryOfflineLogin(email, password);

                // Restore session: Redux and LocalStorage
                dispatch(setUser(user));
                localStorage.setItem("user", JSON.stringify(user));
                
                enqueueSnackbar("🛰️ Offline login successful! Limited functionality available.", { variant: "info" });
                navigate("/");

            } catch (error) {
                // tryOfflineLogin throws specific errors for 'No session' or 'Expired'
                enqueueSnackbar(error.message, { variant: "error", autoHideDuration: 8000 });
                console.error("Offline Login Failed:", error);
            }
        }
    }

    // 📌 MUTATION FUNCTION DEFINED OUTSIDE SUBMIT
    const loginMutation = useMutation({
        mutationFn: (reqData) => login(reqData),
        onSuccess: async (res) => { // ⬅️ Made async to allow local storage save
            const { data } = res;
            
            // NOTE: Token is set via HttpOnly cookie by backend, but we store it locally 
            // and in localStorage for redundancy and potential offline use.
            const token = data.token; 
            const userData = data.data;

            // 1. Save Redux state
            const { _id, name, email, phone, role } = userData;
            dispatch(setUser({ _id, name, email, phone, role }));
            
            // 2. Save user profile to client localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            
            // 3. Save credentials for OFFLINE LOGIN (3-DAY POLICY)
            await saveOfflineSession(userData, formData.password, token); 

            enqueueSnackbar("Login successful!", { variant: "success" });
            navigate("/");
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message || "Login failed.", { variant: "error" });
        }
    })

    return (
        <div>
            {/* 📌 OFFLINE WARNING BANNER */}
            {!navigator.onLine && (
                <div className="bg-red-600 text-white p-2 mb-4 rounded-lg text-center font-medium">
                    You are **OFFLINE**. Limited mode (3-day expiry).
                    {offlineOrdersCount > 0 && (
                        <span className="block text-sm mt-1">
                            {offlineOrdersCount} order(s) pending sync.
                        </span>
                    )}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="classname">
                    <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                        Employee Email
                    </label>
                    <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                        <input
                            type="text"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Enter employee email'
                            className='bg-transparent flex-1 text-white focus:outline-none'
                            required
                        />
                    </div>
                </div>

                <div className="classname">
                    <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                        Password
                    </label>
                    <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                        <input
                            type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Enter password'
                            className='bg-transparent flex-1 text-white focus:outline-none'
                            required
                        />
                    </div>
                </div>

                <button 
                    type='submit' 
                    className='w-full rounded mt-6 py-3 text-lg bg-yellow-400 text-grey-900 font-bold'
                    disabled={loginMutation.isPending} // Disable button while trying online login
                >
                    {loginMutation.isPending ? 'Logging In...' : 'Sign in'}
                </button>
            </form>
        </div>
    )
}

export default Login

