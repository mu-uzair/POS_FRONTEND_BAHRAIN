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
            // console.log('⏳ [useLoadData] Waiting for connectivity check...');
            return;
        }

        // console.log('🔍 [useLoadData] Checking session...', {
        //     isAuthenticated,
        //     isOfflineMode,
        //     hasInternetConnection,
        //     actualOnlineStatus
        // });

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
                // console.log("🌐 [useLoadData] Online → Verifying with server...");
                const { data } = await getUserData();
                // console.log("✅ [useLoadData] Session valid:", data.data.email);

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