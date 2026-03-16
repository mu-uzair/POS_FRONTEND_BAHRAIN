import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { login } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { saveOfflineSession, tryOfflineLogin } from '../../utils/authOffline';
import { getPendingSync } from '../../utils/offlineStore';
import { useOfflineMode } from '../../constants/OfflineModeContext';
import { OfflineError, NetworkError } from '../../utils/smartRequest';
import { WifiOff, Wifi, AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { isOfflineMode, actualOnlineStatus, manualOfflineMode } = useOfflineMode();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [offlineOrdersCount, setOfflineOrdersCount] = useState(0);
    const [isCheckingOfflineOrders, setIsCheckingOfflineOrders] = useState(false);

    useEffect(() => {
        const checkOfflineOrders = async () => {
            if (isOfflineMode) {
                setIsCheckingOfflineOrders(true);
                try {
                    const pendingSync = await getPendingSync();
                    setOfflineOrdersCount(pendingSync.length);
                    console.log(`📦 Found ${pendingSync.length} orders pending sync`);
                } catch (error) {
                    console.error("Failed to check offline orders:", error);
                } finally {
                    setIsCheckingOfflineOrders(false);
                }
            } else {
                setOfflineOrdersCount(0);
            }
        };
        checkOfflineOrders();
    }, [isOfflineMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!isOfflineMode) {
            console.log("🌐 Attempting online login...");
            loginMutation.mutate({ email, password });
        } else {
            console.log("📴 Attempting offline login...");
            try {
                const user = await tryOfflineLogin(email, password);
                dispatch(setUser(user));
                localStorage.setItem("user", JSON.stringify(user));
                enqueueSnackbar("🛰️ Offline login successful! Limited functionality available.", { variant: "info", autoHideDuration: 5000 });
                console.log("✅ Offline login successful for:", user.email);
                navigate("/");
            } catch (error) {
                console.error("❌ Offline Login Failed:", error);
                enqueueSnackbar(error.message || "Offline login failed. Please try again when online.", { variant: "error", autoHideDuration: 8000 });
            }
        }
    };

    const loginMutation = useMutation({
        mutationFn: (reqData) => login(reqData),
        onSuccess: async (res) => {
            try {
                console.log("📥 Login response received:", res);
                const { data } = res;
                const token = data.token;
                const userData = data.data;
                const { _id, name, email, phone, role } = userData;
                
                dispatch(setUser({ _id, name, email, phone, role }));
                localStorage.setItem("user", JSON.stringify(userData));
                await saveOfflineSession(userData, formData.password, token);

                console.log("✅ Online login successful for:", email);
                enqueueSnackbar("Login successful!", { variant: "success" });
                navigate("/");
            } catch (error) {
                console.error("❌ Error processing login success:", error);
                enqueueSnackbar("Login succeeded but session setup failed. Please try again.", { variant: "error" });
            }
        },
        onError: (error) => {
            console.error("❌ Login mutation error:", error);
            
            if (error instanceof OfflineError || error?.isOffline) {
                enqueueSnackbar("You are offline. Please use offline login or wait for connection.", { variant: "warning", autoHideDuration: 5000 });
                return;
            }

            if (error instanceof NetworkError || error?.isNetworkError) {
                enqueueSnackbar("Network error. Please check your connection and try again.", { variant: "error", autoHideDuration: 5000 });
                return;
            }

            if (error.response) {
                const { status, data } = error.response;
                console.error(`❌ Server error ${status}:`, data);
                const message = data?.message || data?.error || "Login failed. Please check your credentials.";
                enqueueSnackbar(message, { variant: "error", autoHideDuration: 5000 });
                return;
            }

            console.error("❌ Unknown error:", error);
            enqueueSnackbar(error.message || "An unexpected error occurred. Please try again.", { variant: "error", autoHideDuration: 5000 });
        }
    });

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Connection Status Card */}
                <div className="mb-6">
                    <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                        isOfflineMode 
                            ? 'bg-orange-500/10 border-orange-500/30' 
                            : 'bg-green-500/10 border-green-500/30'
                    }`}>
                        {isOfflineMode ? (
                            <WifiOff className="w-6 h-6 text-orange-400 flex-shrink-0" />
                        ) : (
                            <Wifi className="w-6 h-6 text-green-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <p className={`font-semibold text-sm ${
                                isOfflineMode ? 'text-orange-400' : 'text-green-400'
                            }`}>
                                {isOfflineMode ? 'Offline Mode Active' : 'Online Mode'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {isOfflineMode 
                                    ? manualOfflineMode 
                                        ? 'Manual offline mode - Limited functionality' 
                                        : 'Network disconnected - Working offline'
                                    : 'Connected to server'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Offline Warning Banner */}
                {isOfflineMode && (
                    <div className="mb-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-yellow-400 font-semibold text-sm mb-1">
                                    Offline Login Available
                                </p>
                                <p className="text-yellow-300 text-xs leading-relaxed">
                                    You can login with your last used credentials (valid for 3 days from last online login).
                                </p>
                                {isCheckingOfflineOrders && (
                                    <p className="text-yellow-300 text-xs mt-2">
                                        Checking pending orders...
                                    </p>
                                )}
                                {!isCheckingOfflineOrders && offlineOrdersCount > 0 && (
                                    <p className="text-yellow-300 text-xs mt-2 font-medium">
                                        📦 {offlineOrdersCount} order(s) pending sync
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Form Card */}
                <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Sign in to access your POS system
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">
                                Employee Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-[#02ca3a] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter employee email"
                                    className="w-full pl-12 pr-4 py-3 sm:py-4 bg-[#1f1f1f] border-2 border-[#333333] rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:border-[#02ca3a] focus:outline-none focus:ring-2 focus:ring-[#02ca3a]/20 transition-all"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-[#02ca3a] transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="w-full pl-12 pr-12 py-3 sm:py-4 bg-[#1f1f1f] border-2 border-[#333333] rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:border-[#02ca3a] focus:outline-none focus:ring-2 focus:ring-[#02ca3a]/20 transition-all"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#02ca3a] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full rounded-xl py-4 text-base font-bold transition-all duration-200 shadow-lg ${
                                loginMutation.isPending
                                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                    : isOfflineMode
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                    : 'bg-[#02ca3a] hover:bg-[#03e94a] text-black'
                            }`}
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Logging In...
                                </span>
                            ) : isOfflineMode ? (
                                <span className="flex items-center justify-center gap-2">
                                    <WifiOff className="w-5 h-5" />
                                    Sign in Offline
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Wifi className="w-5 h-5" />
                                    Sign in
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-6 pt-6 border-t border-[#333333]">
                        <p className="text-center text-xs text-gray-500">
                            {isOfflineMode 
                                ? 'Offline credentials expire 3 days after last online login'
                                : 'Your session is secure and encrypted'
                            }
                        </p>
                    </div>
                </div>

                {/* Additional Info for Offline Mode */}
                {isOfflineMode && (
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            Switch to online mode in the header to sync pending data
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;