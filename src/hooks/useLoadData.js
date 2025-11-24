// import { useEffect } from "react";
// import { getUserData } from "../https";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setUser, removeUser } from "../redux/slice/userSlice";



// const useLoadData = () => {

//     useEffect(() => {

//         const fetchUser = async () => {

//             const dispatch = useDispatch();
//             const navigate = useNavigate();

//             try {

//                 const { data } = await getUserData();
//                 console.log(data);
//                 const { _id, name, email, phone, role } = data.data;
//                 dispatch(setUser({ _id, name, email, phone, role }));

//             } catch (error) {
//                 dispatch(removeUser());
//                 navigate("/auth");
//                 console.log(error);

//             }
//         }
//         fetchUser();

//     }, [dispatch,navigate]);

// }

// export default useLoadData;

// import { useEffect, useState } from "react";
// import { getUserData } from "../https";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setUser, removeUser } from "../redux/slice/userSlice"; // Import setUser and removeUser

// const useLoadData = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isLoading, setIsloading] = useState(true);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const { data } = await getUserData();
//                 console.log(data);
//                 const { _id, name, email, phone, role } = data.data;
//                 dispatch(setUser({ _id, name, email, phone, role }));
//             } catch (error) {
//                 dispatch(removeUser());
//                 navigate("/auth");
//                 console.log(error);
//             }
//             finally{
//                 setIsloading(false);
//             }
//         };
//         fetchUser();
//     }, [dispatch, navigate]); // Correct dependency array
// return isLoading;
// };

// export default useLoadData;


// Modified useLoadData.js
// to handle offline user data loading


import { useEffect, useState } from "react";
import { getUserData } from "../https";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Assuming your userSlice has a selector that returns the user object or a boolean isAuthenticated field
// I will check if state.user._id exists to determine authentication status.
import { setUser, removeUser } from "../redux/slice/userSlice"; 

const useLoadData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => !!state.user._id); // Check if a user ID exists in Redux state
    const [isLoading, setIsloading] = useState(true);

    const fetchUser = async () => {
        // --- OFFLINE CHECK TO PREVENT IMMEDIATE LOGOUT ---
        if (isAuthenticated && !navigator.onLine) {
            console.log("🛰️ Offline mode detected. Trusting Redux state from offline login.");
            setIsloading(false);
            return; 
        }

        // --- ONLINE CHECK (Or initial load where isAuthenticated is false) ---
        if (navigator.onLine) {
            try {
                const { data } = await getUserData();
                console.log("Online user check successful:", data);

                const { _id, name, email, phone, role } = data.data;
                // Update Redux state with fresh data
                dispatch(setUser({ _id, name, email, phone, role })); 
            } catch (error) {
                // This block runs if: 
                // 1. The token expired (401), or
                // 2. The network failed for another reason while trying to check online status.
                console.log("Online session check failed:", error.response?.status || error.message);

                // We only remove the user if we failed while being online 
                // (meaning the online session is definitely invalid).
                if (navigator.onLine) {
                    dispatch(removeUser());
                    // Navigate only if the check failed while online
                    navigate("/auth");
                }
            }
        }
        
        setIsloading(false);
    };

    useEffect(() => {
        // Run once on mount
        fetchUser();

        // Add listeners to trigger a re-fetch when the network status changes
        // This ensures the offline user session is validated as soon as connectivity returns.
        window.addEventListener('online', fetchUser);
        window.addEventListener('offline', fetchUser);

        return () => {
            window.removeEventListener('online', fetchUser);
            window.removeEventListener('offline', fetchUser);
        };
    }, [dispatch, navigate]);

    return isLoading;
};

export default useLoadData;
