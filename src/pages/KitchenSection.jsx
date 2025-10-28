import React, { useMemo, useEffect, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import { getOrdersByStatus, markSectionItemsReady } from "../https/index";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import socket from "../socket"; // ✅ import shared socket instance

// 🔔 CONSTANT: URL to your alert sound file
const ALERT_SOUND_URL = "/notification1.mp3";

const KitchenSection = () => {
    const queryClient = useQueryClient();
    const [currentTime, setCurrentTime] = useState(Date.now());
    
    // 🔔 Sound state with localStorage persistence
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('kds_sound_kitchen');
        return saved === 'true';
    });

    // 🔔 Audio ready state to track if audio context is unlocked
    const [isAudioReady, setIsAudioReady] = useState(false);

    // 🔔 Create Audio object once
    const orderAlert = useMemo(() => {
        const audio = new Audio(ALERT_SOUND_URL);
        audio.volume = 0.8; // Set volume to 80%
        
        // Preload the audio
        audio.load();
        
        return audio;
    }, []);

    // 🔔 Initialize audio on first user interaction
    useEffect(() => {
        const unlockAudio = async () => {
            if (!isAudioReady) {
                try {
                    // Attempt to play and immediately pause to unlock audio context
                    await orderAlert.play();
                    orderAlert.pause();
                    orderAlert.currentTime = 0;
                    setIsAudioReady(true);
                    console.log("✅ Audio context unlocked");
                } catch (e) {
                    console.warn("Audio unlock failed (expected on first load):", e.message);
                }
            }
        };

        // Listen for any user interaction
        const events = ['click', 'touchstart', 'keydown'];
        events.forEach(event => {
            document.addEventListener(event, unlockAudio, { once: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, unlockAudio);
            });
        };
    }, [orderAlert, isAudioReady]);

    // Handler to toggle sound
    const handleToggleSound = () => {
        const newState = !isSoundEnabled;
        setIsSoundEnabled(newState);
        localStorage.setItem('kds_sound_kitchen', String(newState));
        
        // Play a test sound when enabling
        if (newState && isAudioReady) {
            playAlertSound();
        }
        
        enqueueSnackbar(
            `Order sound notifications ${newState ? 'enabled' : 'disabled'}`, 
            { variant: newState ? 'success' : 'info' }
        );
    };

    // 🔔 Reliable sound play function
    const playAlertSound = async () => {
        try {
            // Reset audio to start
            orderAlert.currentTime = 0;
            
            // Attempt to play
            const playPromise = orderAlert.play();
            
            if (playPromise !== undefined) {
                await playPromise;
                console.log("🔔 Alert sound played successfully");
            }
        } catch (error) {
            console.warn("⚠️ Could not play alert sound:", error.message);
            
            // Notify user if sound failed
            if (error.name === 'NotAllowedError') {
                enqueueSnackbar(
                    'Sound blocked by browser. Click anywhere to enable sounds.', 
                    { variant: 'warning', autoHideDuration: 5000 }
                );
            }
        }
    };

    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders", "in-progress"],
        queryFn: async () => {
            const response = await getOrdersByStatus("In Progress");
            console.log("Orders API Response:", response);
            return response;
        },
        placeholderData: keepPreviousData,
    });

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    const ordersArray = resData?.data?.data ?? [];

    const kitchenOrders = useMemo(() => {
        return ordersArray
            .map((order) => {
                const kitchenItems = order.items?.filter(
                    (item) =>
                        item.section &&
                        item.section.toLowerCase() === "kitchen" &&
                        item.status !== "Ready"
                        
                );

                if (!kitchenItems || kitchenItems.length === 0) return null;

                return {
                    _id: order._id,
                    tableNo: order.table?.tableNo || null,
                    orderType: order.customerDetails?.orderType || "N/A",
                    createdAt: order.createdAt,
                    status: order.orderStatus,
                    items: kitchenItems,

                };
            })
            .filter(Boolean);
    }, [ordersArray]);

    const getTimeElapsed = (createdAt) => {
        const start = new Date(createdAt).getTime();
        const diffInMinutes = Math.floor((currentTime - start) / 60000);

        if (diffInMinutes < 0) return "Just Now";

        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // 🟢 SOCKET.IO LISTENER (Fixed)
    useEffect(() => {
        const handleOrderUpdate = (data) => {
            console.log("Received real-time order update:", data);

            const isAlertEvent = data.action === 'new_order' || data.action === 'order_modified';

            // 🔔 Play sound if enabled and audio is ready
            if (isAlertEvent && isSoundEnabled && isAudioReady) {
                playAlertSound();
            }

            if (data.action === 'new_order' ||
                data.action === 'items_ready' ||
                data.action === 'status_changed' ||
                data.action === 'order_modified' ||
                data.action === 'order_deleted') {
                queryClient.invalidateQueries({ queryKey: ["orders", "in-progress"] });
                enqueueSnackbar(
                    `Order updated: ${data.action.replace('_', ' ')}`, 
                    { variant: isAlertEvent ? 'warning' : 'info' }
                );
            }
        };

        socket.on('orderUpdate', handleOrderUpdate);

        return () => {
            socket.off('orderUpdate', handleOrderUpdate);
        };
    }, [queryClient, isSoundEnabled, isAudioReady]);

    const handleMarkReady = async (orderId) => {
        try {
            await markSectionItemsReady(orderId, "kitchen");
            enqueueSnackbar("Kitchen items marked ready!", { variant: "success" });
        } catch (error) {
            console.error("Mark Ready Error:", error);
            enqueueSnackbar("Failed to mark items ready", { variant: "error" });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
                <p className="text-lg">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
            <div className="flex flex-col md:flex-row md:justify-between items-center py-6 px-4 bg-[#111827] shadow-lg border-b border-[#334155] sticky top-0 z-10">
                <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">
                        🍳 THE PASS
                    </h1>
                    <div className="flex items-center space-x-3">
                        <span className="text-base font-medium text-gray-400 uppercase">
                            Kitchen Section
                        </span>
                        <span className={`text-xl font-bold px-3 py-1 rounded-full shadow-lg transition-colors ${
                            kitchenOrders.length > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                        }`}>
                            {kitchenOrders.length} {kitchenOrders.length > 0 ? 'Pending' : 'Clear'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleToggleSound}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-full font-bold transition-all duration-300 shadow-md ${
                        isSoundEnabled
                            ? 'bg-green-700 hover:bg-green-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={isSoundEnabled ? "Notifications ON" : "Notifications OFF"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        {isSoundEnabled ? (
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        ) : (
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        )}
                    </svg>
                    <span className="hidden sm:inline">{isSoundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
                </button>
            </div>

            <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
                {kitchenOrders.length === 0 ? (
                    <div className="col-span-full flex flex-col justify-center items-center h-64 bg-[#1e293b] rounded-xl border border-[#334155] shadow-inner p-10">
                        <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <p className="text-gray-300 text-xl font-semibold">All clear!</p>
                        <p className="text-gray-500">No active kitchen prep required.</p>
                    </div>
                ) : (
                    kitchenOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-[#1e293b] p-5 rounded-xl shadow-lg border-2 border-[#F6B100] flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-center mb-3 border-b border-[#334155] pb-3">
                                <div>
                                    <p className="text-gray-300 text-sm">Order Type / Table</p>
                                    <p className="text-xl font-bold text-white">
                                        {order.orderType}
                                        {order.tableNo ? ` • Table ${order.tableNo}` : ""}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Time Elapsed</p>
                                    <p className={`font-semibold text-sm ${
                                        Math.floor((currentTime - new Date(order.createdAt).getTime()) / 60000) > 15 
                                            ? 'text-red-500' 
                                            : 'text-[#F6B100]'
                                    }`}>
                                        {getTimeElapsed(order.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-lg p-3 my-4 flex-grow">
                                {order.items.map((item, index) => (
                                    <div key={index} className="mb-3 p-1 border-b border-gray-700 last:border-b-0">
                                        <p className="text-white text-lg font-bold">
                                            <span className="text-xl text-red-500 mr-2">{item.quantity}x</span>
                                            {item.name}  {item.variationName ? ` (${item.variationName})` : ''}
                                        </p>
                                        {item.notes && (
                                            <p className="text-yellow-400 text-sm italic ml-8 mt-1">
                                                - Notes: {item.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleMarkReady(order._id)}
                                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-4"
                            >
                                ✅ Mark Kitchen Items as READY
                            </button>
                        </div>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default KitchenSection;
