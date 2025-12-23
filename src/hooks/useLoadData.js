// // // ============================================
// // // FILE 6: hooks/useLoadData.js (UPDATED - MINIMAL CHANGES)
// // // ============================================
// // import { useEffect, useState } from "react";
// // import { getUserData } from "../https";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import { setUser, removeUser } from "../redux/slice/userSlice";

// // const useLoadData = () => {
// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();
// //     const isAuthenticated = useSelector(state => !!state.user._id);
// //     const [isLoading, setIsloading] = useState(true);

// //     const fetchUser = async () => {
// //         // --- OFFLINE CHECK TO PREVENT IMMEDIATE LOGOUT ---
// //         if (isAuthenticated && !navigator.onLine) {
// //             console.log("🛰️ Offline mode detected. Trusting Redux state from offline login.");
// //             setIsloading(false);
// //             return; 
// //         }

// //         // --- ONLINE CHECK ---
// //         if (navigator.onLine) {
// //             try {
// //                 const { data } = await getUserData();
// //                 console.log("✅ Online user check successful:", data);

// //                 const { _id, name, email, phone, role } = data.data;
// //                 dispatch(setUser({ _id, name, email, phone, role })); 
// //             } catch (error) {
// //                 console.log("❌ Online session check failed:", error.response?.status || error.message);

// //                 if (navigator.onLine) {
// //                     dispatch(removeUser());
// //                     navigate("/auth");
// //                 }
// //             }
// //         }
        
// //         setIsloading(false);
// //     };

// //     useEffect(() => {
// //         fetchUser();

// //         window.addEventListener('online', fetchUser);
// //         window.addEventListener('offline', fetchUser);

// //         return () => {
// //             window.removeEventListener('online', fetchUser);
// //             window.removeEventListener('offline', fetchUser);
// //         };
// //     }, [dispatch, navigate]);

// //     return isLoading;
// // };

// // export default useLoadData;



// // hooks/useLoadData.js - FIXED: Use offline context instead of navigator.onLine
// import { useEffect, useState } from "react";
// import { getUserData } from "../https";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setUser, removeUser } from "../redux/slice/userSlice";
// import { useOfflineMode } from "../constants/OfflineModeContext";

// const useLoadData = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const isAuthenticated = useSelector(state => !!state.user._id);
//     const [isLoading, setIsloading] = useState(true);
    
//     // ✅ FIX: Use offline context instead of navigator.onLine
//     const { isOfflineMode, hasInternetConnection } = useOfflineMode();

//     const fetchUser = async () => {
//         // ✅ FIX: Check isOfflineMode instead of !navigator.onLine
//         if (isAuthenticated && isOfflineMode) {
//             console.log("🛰️ Offline mode detected. Trusting Redux state from offline login.");
//             setIsloading(false);
//             return; 
//         }

//         // ✅ FIX: Check hasInternetConnection instead of navigator.onLine
//         if (hasInternetConnection && !isOfflineMode) {
//             try {
//                 const { data } = await getUserData();
//                 console.log("✅ Online user check successful:", data);

//                 const { _id, name, email, phone, role } = data.data;
//                 dispatch(setUser({ _id, name, email, phone, role })); 
//             } catch (error) {
//                 console.log("❌ Online session check failed:", error.response?.status || error.message);

//                 // Only logout if we're truly online (not if it's a network error)
//                 if (hasInternetConnection && !isOfflineMode) {
//                     dispatch(removeUser());
//                     navigate("/auth");
//                 }
//             }
//         }
        
//         setIsloading(false);
//     };

//     useEffect(() => {
//         fetchUser();
//     }, [dispatch, navigate, isOfflineMode, hasInternetConnection]);

//     return isLoading;
// };

// export default useLoadData;

// // hooks/useLoadData.js - FIXED: Show login page when offline
// import { useEffect, useState } from "react";
// import { getUserData } from "../https";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setUser, removeUser } from "../redux/slice/userSlice";
// import { useOfflineMode } from "../constants/OfflineModeContext";

// const useLoadData = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const isAuthenticated = useSelector(state => !!state.user._id);
//     const [isLoading, setIsloading] = useState(true);
    
//     // ✅ FIX: Use offline context instead of navigator.onLine
//     const { isOfflineMode, hasInternetConnection } = useOfflineMode();

//     const fetchUser = async () => {
//         console.log('🔍 [useLoadData] Checking user session...', {
//             isAuthenticated,
//             isOfflineMode,
//             hasInternetConnection
//         });

//         // ✅ FIX: If offline and NOT authenticated, allow login page to show
//         if (isOfflineMode && !isAuthenticated) {
//             console.log("📴 Offline & not authenticated - showing login page");
//             setIsloading(false);
//             return;
//         }

//         // ✅ If offline and authenticated, trust the Redux state
//         if (isAuthenticated && isOfflineMode) {
//             console.log("🛰️ Offline mode detected. Trusting Redux state from offline login.");
//             setIsloading(false);
//             return; 
//         }

//         // ✅ If online, verify session with server
//         if (hasInternetConnection && !isOfflineMode) {
//             try {
//                 console.log("🌐 Online - verifying session with server...");
//                 const { data } = await getUserData();
//                 console.log("✅ Online user check successful:", data);

//                 const { _id, name, email, phone, role } = data.data;
//                 dispatch(setUser({ _id, name, email, phone, role })); 
//             } catch (error) {
//                 console.log("❌ Online session check failed:", error.response?.status || error.message);

//                 // Only logout if we're truly online (not if it's a network error)
//                 if (hasInternetConnection && !isOfflineMode) {
//                     console.log("🚪 Logging out - invalid session");
//                     dispatch(removeUser());
//                     navigate("/auth");
//                 }
//             }
//         }
        
//         setIsloading(false);
//     };

//     useEffect(() => {
//         fetchUser();
//     }, [dispatch, navigate, isOfflineMode, hasInternetConnection]);

//     return isLoading;
// };

// export default useLoadData;


// ===========================================
// FILE 1: hooks/useLoadData.js - COMPLETE FIX
// ============================================
import { useEffect, useState } from "react";
import { getUserData } from "../https";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, removeUser } from "../redux/slice/userSlice";
import { useOfflineMode } from "../constants/OfflineModeContext";

const useLoadData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => !!state.user._id);
    const [isLoading, setIsloading] = useState(true);
    
    const { isOfflineMode, hasInternetConnection, actualOnlineStatus, isCheckingConnectivity } = useOfflineMode();

    const fetchUser = async () => {
        // ✅ Wait for connectivity check to complete
        if (isCheckingConnectivity) {
            console.log('⏳ [useLoadData] Waiting for connectivity check...');
            return;
        }

        console.log('🔍 [useLoadData] Checking session...', {
            isAuthenticated,
            isOfflineMode,
            hasInternetConnection,
            actualOnlineStatus
        });

        // ✅ CASE 1: Offline and NOT authenticated → Show login page
        if (isOfflineMode && !isAuthenticated) {
            console.log("📴 [useLoadData] Offline & unauthenticated → Login page");
            setIsloading(false);
            return;
        }

        // ✅ CASE 2: Offline and authenticated → Trust Redux state
        if (isOfflineMode && isAuthenticated) {
            console.log("🛰️ [useLoadData] Offline & authenticated → Trust Redux");
            setIsloading(false);
            return; 
        }

        // ✅ CASE 3: Online → Verify with server
        if (hasInternetConnection && actualOnlineStatus && !isOfflineMode) {
            try {
                console.log("🌐 [useLoadData] Online → Verifying with server...");
                const { data } = await getUserData();
                console.log("✅ [useLoadData] Session valid:", data.data.email);

                const { _id, name, email, phone, role } = data.data;
                dispatch(setUser({ _id, name, email, phone, role })); 
            } catch (error) {
                console.log("❌ [useLoadData] Session check failed:", error.response?.status || error.message);

                // Only logout if it's a real auth error (not network issue)
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log("🚪 [useLoadData] Invalid session → Logout");
                    dispatch(removeUser());
                    navigate("/auth");
                } else {
                    console.log("⚠️ [useLoadData] Network error, keeping session");
                }
            }
        }
        
        setIsloading(false);
    };

    useEffect(() => {
        fetchUser();
    }, [isOfflineMode, hasInternetConnection, actualOnlineStatus, isCheckingConnectivity]);

    return isLoading;
};

export default useLoadData;