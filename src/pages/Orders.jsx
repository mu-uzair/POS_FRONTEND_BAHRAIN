// pages/Orders.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/Orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { enqueueSnackbar } from "notistack";
import socket from "../socket";
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, WifiOff, Wifi, Printer } from 'lucide-react';
import { initializeOfflineCache, fetchAndCacheRecentOrders, startAutoRefresh, stopAutoRefresh } from "../utils/getOrdersOffline";
import { printSalesReport } from "../https/printBridge";
import { useInfiniteOrders } from "../hooks/orderData API optimization hooks/useInfiniteOrders";
import { useOrderStats, usePaymentTotals } from "../hooks/orderData API optimization hooks/useOrderFilters";
import { useTodayAnalytics } from "../hooks/orderData API optimization hooks/useAnalytics";
import { completeAllOrders } from '../https/index';
import { useQueryClient } from "@tanstack/react-query";
import { useOfflineMode } from '../constants/OfflineModeContext';
import { updateOrdersCache, getCachedOrders } from "../utils/offlineStore";

const Orders = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // ✅ Use offline context
    const { isOfflineMode, actualOnlineStatus } = useOfflineMode();

    const [isBulkCompleting, setIsBulkCompleting] = useState(false);
    /* --------------  FILTER STATES  -------------- */
    const [status, setStatus] = useState("In Progress");
    const [dateFilter, setDateFilter] = useState("Today");
    const [selectedDate, setSelectedDate] = useState("");
    const [orderType, setOrderType] = useState("All");
    const [paymentMethod, setPaymentMethod] = useState("All");

    /* --------------  UI / MODAL STATES  -------------- */
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
    const [showBulkCompleteModal, setShowBulkCompleteModal] = useState(false);
    const [isPrintingReport, setIsPrintingReport] = useState(false);

    /* --------------  OFFLINE STATES  -------------- */
    const [offlineOrders, setOfflineOrders] = useState([]);
    const [isLoadingOffline, setIsLoadingOffline] = useState(false);

    /* --------------  FILTERS FOR HOOKS  -------------- */
   const filters = useMemo(() => ({
    status: status === "All" ? undefined : status,
    dateFilter,
    startDate: dateFilter === "Custom" && selectedDate ? selectedDate : undefined,
    endDate: dateFilter === "Custom" && selectedDate ? selectedDate : undefined,
    // ✅ startDate and endDate can be same string — backend will handle 00:00 to 23:59
    orderType: orderType === "All" ? undefined : orderType,
    paymentMethod: paymentMethod === "All" ? undefined : paymentMethod
}), [status, dateFilter, selectedDate, orderType, paymentMethod]);




    /* --------------  DATA HOOKS (ONLINE ONLY)  -------------- */
    const {
        orders: infiniteOrders,
        isLoading: isLoadingOrders,
        isError: isOrdersError,
        isFetchingNextPage,
        hasNextPage,
        lastOrderRef,
        refetch: refetchOrders,
    } = useInfiniteOrders(filters, !isOfflineMode);

    const { stats: orderStats, isLoading: isLoadingStats, refetch: refetchStats } = useOrderStats(filters, !isOfflineMode);
    const { totals: paymentTotals, isLoading: isLoadingPaymentTotals, refetch: refetchPaymentTotals } = usePaymentTotals(filters, !isOfflineMode);
    const { todayData, isLoading: isLoadingToday } = useTodayAnalytics();

    /* --------------  EXTRA STATS FOR BULK BUTTON  -------------- */
    const { stats: bulkStats } = useOrderStats(
        {
            status: undefined,
            dateFilter,
            startDate: dateFilter === "Custom" && selectedDate ? selectedDate : undefined,
            endDate: dateFilter === "Custom" && selectedDate ? selectedDate : undefined,
            orderType: orderType === "All" ? undefined : orderType,
            paymentMethod: paymentMethod === "All" ? undefined : paymentMethod
        },
        !isOfflineMode
    );

    const [localBulkStats, setLocalBulkStats] = useState(bulkStats);

    useEffect(() => {
        setLocalBulkStats(bulkStats);
    }, [bulkStats]);

    // ✅ Initialize offline cache with queryClient
    useEffect(() => {
        initializeOfflineCache(queryClient);
        // console.log('✅ Offline cache initialized with queryClient');
    }, [queryClient]);

    /* --------------  HANDLE MODE CHANGES  -------------- */
    useEffect(() => {
        if (!isOfflineMode && actualOnlineStatus) {
            // console.log('🌐 Online mode - Refetching data...');
            refetchOrders();
            refetchStats();
            refetchPaymentTotals();
            fetchAndCacheRecentOrders();
        }
    }, [isOfflineMode, actualOnlineStatus]);

    /* --------------  LOAD OFFLINE DATA  -------------- */
    useEffect(() => {
        async function loadOfflineData() {
            if (isOfflineMode) {
                setIsLoadingOffline(true);
                try {
                    const cached = await getCachedOrders();
                    setOfflineOrders(cached);
                    console.log(`📦 Loaded ${cached.length} cached orders (${cached.filter(o => o.isOffline).length} pending sync)`);
                } catch (error) {
                    console.error("Error loading offline orders:", error);
                    enqueueSnackbar("Failed to load offline orders", { variant: "error" });
                } finally {
                    setIsLoadingOffline(false);
                }
            }
        }
        loadOfflineData();
    }, [isOfflineMode]);

    /* --------------  SOCKET REAL-TIME (ONLINE ONLY)  -------------- */
    useEffect(() => {
        if (isOfflineMode) return;



        const handleOrderUpdate = (data) => {
            const relevant = ['new_order', 'items_ready', 'status_changed', 'order_modified', 'order_deleted'];
            if (relevant.includes(data.action)) {
                // Refetch queries
                refetchOrders();
                refetchStats();
                refetchPaymentTotals();

                // Invalidate tables
                queryClient.invalidateQueries({ queryKey: ['tables'] });

                // ✅ ADD THIS: Update cache after socket event
                setTimeout(async () => {
                    try {
                        await fetchAndCacheRecentOrders(true); // Force refresh = true
                        console.log('✅ [SOCKET] Cache updated after order change');
                    } catch (err) {
                        console.warn("Failed to cache after socket update:", err);
                    }
                }, 1000);

                const msg = {
                    new_order: 'New order received',
                    items_ready: 'Order items marked ready',
                    status_changed: 'Order status updated',
                    order_modified: 'Order modified',
                    order_deleted: 'Order deleted'
                };
                enqueueSnackbar(msg[data.action] || 'Order updated', {
                    variant: data.action === 'new_order' ? 'success' : 'info',
                    autoHideDuration: 3000
                });
            }
        };

        socket.on('orderUpdate', handleOrderUpdate);
        return () => socket.off('orderUpdate', handleOrderUpdate);
    }, [isOfflineMode, refetchOrders, refetchStats, refetchPaymentTotals, queryClient]);

    /* --------------  AUTO REFRESH (ONLINE ONLY)  -------------- */
    useEffect(() => {
        if (!isOfflineMode && actualOnlineStatus) {
            startAutoRefresh();
            return () => stopAutoRefresh();
        }
    }, [isOfflineMode, actualOnlineStatus]);

    /* --------------  CLIENT-SIDE FILTERING FOR OFFLINE MODE  -------------- */
    const applyOfflineFilters = useCallback((orders) => {
        let filtered = [...orders];

        // 1. Filter by Status
        if (status !== "All") {
            filtered = filtered.filter(order => order.orderStatus === status);
        }

        // 2. Filter by Date
        if (dateFilter === "Today") {
            const today = new Date().toDateString();
            filtered = filtered.filter(order =>
                new Date(order.createdAt).toDateString() === today
            );
        } else if (dateFilter === "Yesterday") {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            filtered = filtered.filter(order =>
                new Date(order.createdAt).toDateString() === yesterdayStr
            );
        } else if (dateFilter === "Custom" && selectedDate) {
            const customDate = new Date(selectedDate).toDateString();
            filtered = filtered.filter(order =>
                new Date(order.createdAt).toDateString() === customDate
            );
        }

        // 3. Filter by Order Type
        if (orderType !== "All") {
            filtered = filtered.filter(order => {
                const type = order.customerDetails?.orderType || "Dine-in";
                return type === orderType;
            });
        }

        // 4. Filter by Payment Method
        if (paymentMethod !== "All") {
            filtered = filtered.filter(order => {
                const method = (order.paymentMethod || "cash").toLowerCase();
                return method === paymentMethod.toLowerCase();
            });
        }

        return filtered;
    }, [status, dateFilter, selectedDate, orderType, paymentMethod]);

    /* --------------  CALCULATE OFFLINE STATS  -------------- */
    const offlineStats = useMemo(() => {
        if (!isOfflineMode) return null;

        const filtered = applyOfflineFilters(offlineOrders);

        // Calculate totals
        let cashTotal = 0;
        let onlineTotal = 0;
        let benefitTotal = 0;

        filtered.forEach(order => {
            const amount = parseFloat(order.bills?.totalWithTax || 0);
            const method = (order.paymentMethod || 'cash').toLowerCase();

            if (method === 'cash') cashTotal += amount;
            else if (method === 'online') onlineTotal += amount;
            else if (method === 'benefit') benefitTotal += amount;
        });

        const total = cashTotal + onlineTotal + benefitTotal;

        return {
            Cash: cashTotal.toFixed(3),
            Online: onlineTotal.toFixed(3),
            Benefit: benefitTotal.toFixed(3),
            Total: total.toFixed(3)
        };
    }, [isOfflineMode, offlineOrders, applyOfflineFilters]);

    /* --------------  DERIVED LISTS  -------------- */
    const ordersArray = useMemo(() => {
        if (!isOfflineMode) {
            return infiniteOrders;
        }

        // In offline mode, apply client-side filters
        return applyOfflineFilters(offlineOrders);
    }, [isOfflineMode, infiniteOrders, offlineOrders, applyOfflineFilters]);

    const sortedFilteredOrders = useMemo(() =>
        [...ordersArray].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        , [ordersArray]);

    /* --------------  PRINT SALES REPORT  -------------- */
    const handlePrintSalesReport = useCallback(async () => {
        setIsPrintingReport(true);

        try {
            const today = new Date().toDateString();
            let ordersToProcess = [];

            if (!isOfflineMode && todayData?.recentOrders?.length > 0) {
                console.log("📊 Using recentOrders from todayData");
                ordersToProcess = todayData.recentOrders.filter(
                    o => o.orderStatus === "Completed" &&
                        new Date(o.createdAt).toDateString() === today
                );
            } else {
                console.log("📊 Using sortedFilteredOrders");
                ordersToProcess = sortedFilteredOrders.filter(
                    o => o.orderStatus === "Completed" &&
                        new Date(o.createdAt).toDateString() === today
                );
            }

            console.log(`📊 Processing ${ordersToProcess.length} completed orders`);

            const orderTypes = {
                dinein: 0, dineinCount: 0,
                takeaway: 0, takeawayCount: 0,
                delivery: 0, deliveryCount: 0,
                total: 0
            };

            const paymentMethods = {
                cash: 0, cashCount: 0,
                online: 0, onlineCount: 0,
                benefit: 0, benefitCount: 0,
                total: 0
            };

            let totalTax = 0;
            let totalDiscount = 0;

            ordersToProcess.forEach(order => {
                const amt = parseFloat(order.bills?.totalWithTax || 0);
                const tax = parseFloat(order.bills?.tax || 0);
                const disc = parseFloat(order.bills?.discountAmount || 0);

                totalTax += tax;
                totalDiscount += disc;

                const orderType = (order.customerDetails?.orderType || 'Dine-in').toLowerCase();
                if (orderType.includes('dine')) {
                    orderTypes.dinein += amt;
                    orderTypes.dineinCount++;
                } else if (orderType.includes('take')) {
                    orderTypes.takeaway += amt;
                    orderTypes.takeawayCount++;
                } else if (orderType.includes('delivery')) {
                    orderTypes.delivery += amt;
                    orderTypes.deliveryCount++;
                }

                const pm = (order.paymentMethod || 'cash').toLowerCase();
                if (pm === 'cash') {
                    paymentMethods.cash += amt;
                    paymentMethods.cashCount++;
                } else if (pm === 'online') {
                    paymentMethods.online += amt;
                    paymentMethods.onlineCount++;
                } else if (pm === 'benefit') {
                    paymentMethods.benefit += amt;
                    paymentMethods.benefitCount++;
                }
            });

            orderTypes.total = orderTypes.dinein + orderTypes.takeaway + orderTypes.delivery;
            paymentMethods.total = paymentMethods.cash + paymentMethods.online + paymentMethods.benefit;
            const totalSales = orderTypes.total;
            const totalOrders = ordersToProcess.length;
            const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

            const reportData = {
                date: new Date().toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                timeRange: 'Full Day',
                totalOrders,
                totalSales: totalSales.toFixed(3),
                averageOrderValue: averageOrderValue.toFixed(3),
                orderTypes: {
                    dinein: orderTypes.dinein.toFixed(3),
                    dineinCount: orderTypes.dineinCount,
                    takeaway: orderTypes.takeaway.toFixed(3),
                    takeawayCount: orderTypes.takeawayCount,
                    delivery: orderTypes.delivery.toFixed(3),
                    deliveryCount: orderTypes.deliveryCount,
                    total: orderTypes.total.toFixed(3)
                },
                paymentMethods: {
                    cash: paymentMethods.cash.toFixed(3),
                    cashCount: paymentMethods.cashCount,
                    online: paymentMethods.online.toFixed(3),
                    onlineCount: paymentMethods.onlineCount,
                    benefit: paymentMethods.benefit.toFixed(3),
                    benefitCount: paymentMethods.benefitCount,
                    total: paymentMethods.total.toFixed(3)
                },
                taxSummary: {
                    total: totalTax.toFixed(3)
                },
                discountSummary: {
                    total: totalDiscount.toFixed(3)
                }
            };

            console.log("📄 Final report data being sent:", reportData);

            await printSalesReport(reportData);
            enqueueSnackbar("Sales report printed successfully!", { variant: "success" });
        } catch (error) {
            console.error("❌ Error printing sales report:", error);
            enqueueSnackbar(
                error?.response?.data?.message || error?.message || "Failed to print sales report!",
                { variant: "error" }
            );
        } finally {
            setIsPrintingReport(false);
        }
    }, [isOfflineMode, todayData, sortedFilteredOrders]);

    const getUserRole = useCallback(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            return user?.role?.toLowerCase().trim() || null;
        } catch { return null; }
    }, []);

    const handleViewDetails = useCallback(() => {
        getUserRole() === "admin" ? setShowDetailedBreakdown(true) : setShowPasswordModal(true);
    }, [getUserRole]);

    // ✅ Use offline stats when in offline mode
    const displayTotals = isOfflineMode ? offlineStats : paymentTotals;

    /* --------------  LOADING STATE  -------------- */
    if ((isLoadingOrders && !isOfflineMode) || isLoadingOffline) {
        return (
            <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
                    <p className="text-[#f5f5f5] text-lg">
                        {isOfflineMode ? 'Loading cached orders...' : 'Loading orders...'}
                    </p>
                </div>
            </section>
        );
    }

    /* --------------  RENDER  -------------- */
    return (
        <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
            {/* -------  HEADER  ------- */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#1a1a1a] shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                    <BackButton />
                    <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">Orders History</h1>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isOfflineMode ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                        {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                        {isOfflineMode ? 'Offline' : 'Online'}
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 bg-[#333333] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg">
                        <span className="text-[#f5f5f5] text-sm sm:text-base font-semibold">Total Amount:</span>
                        <button onClick={handleViewDetails} className="bg-[#444444] hover:bg-[#555555] text-[#02ca3a] p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex-shrink-0" title="View detailed breakdown">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                    {(getUserRole() === "admin" || showDetailedBreakdown) && (
                        <div className="bg-[#02ca3a] text-black font-bold px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg">
                            <div className="text-left">
                                <p className="text-[10px] sm:text-xs uppercase tracking-wide opacity-90">Total Amount</p>
                                <p className="text-base sm:text-lg lg:text-xl font-extrabold">{displayTotals?.Total || "0.000"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* -------  OFFLINE BANNER  ------- */}
            {isOfflineMode && (
                <div className="bg-orange-500/20 border-l-4 border-orange-500 px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-3">
                        <WifiOff className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-orange-400">
                                {actualOnlineStatus ? 'Manual Offline Mode' : 'Network Disconnected'}
                            </p>
                            <p className="text-xs text-orange-300">
                                Showing {offlineOrders.length} cached orders
                                ({offlineOrders.filter(o => o.isOffline).length} pending sync).
                                {actualOnlineStatus && ' Switch to online mode to sync data.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* -------  FILTER BAR  ------- */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#333333] gap-3">
                <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md min-w-max">
                        {["All", "In Progress", "Ready", "Completed"].map((s) => (
                            <button key={s} onClick={() => setStatus(s)} className={`text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap ${status === s ? "bg-[#02ca3a] text-black shadow-lg" : "text-[#ababab] hover:bg-[#444444]"}`} aria-pressed={status === s}>{s}</button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto overflow-x-auto scrollbar-hide">
                    <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
                            {["All", "Today", "Yesterday", "Custom"].map((d) => (
                                <button key={d} onClick={() => { setDateFilter(d); if (d !== "Custom") setSelectedDate(""); }} className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${dateFilter === d ? "bg-[#444444] text-[#f5f5f5] shadow-inner" : "text-[#ababab] hover:bg-[#444444]"}`} aria-pressed={dateFilter === d}>{d === "All" ? "All Dates" : d}</button>
                            ))}
                            {dateFilter === "Custom" && (
                                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-[#444444] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-[#02ca3a] outline-none" aria-label="Select custom date" />
                            )}
                        </div>
                    </div>
                    <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
                            {["All", "Dine-in", "Delivery", "Take Away"].map((type) => (
                                <button key={type} onClick={() => setOrderType(type)} className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${orderType === type ? "bg-[#444444] text-[#f5f5f5] shadow-inner" : "text-[#ababab] hover:bg-[#444444]"}`} aria-pressed={orderType === type}>{type}</button>
                            ))}
                            <button className="bg-[#02ca3a] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200 text-xs sm:text-sm whitespace-nowrap" onClick={() => navigate("/DeliveryMetrics")} aria-label="View delivery metrics">Delivery Metrics</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* -------  BULK-COMPLETE BUTTON (ONLINE ONLY)  ------- */}
            {localBulkStats?.byStatus?.["In Progress"] > 0 && !isOfflineMode && (
                <div className="px-4 sm:px-6 lg:px-8 py-3 bg-[#262626] border-b border-[#333333]">
                    <button onClick={() => setShowBulkCompleteModal(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">
                        <CheckCircle className="w-5 h-5" />
                        Complete All Orders
                    </button>
                </div>
            )}

            {/* -------  BULK-COMPLETE MODAL  ------- */}

            {showBulkCompleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-[#2e2c2c] p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700">
                        <h3 className="text-lg font-semibold mb-2 text-gray-50">Complete All Orders</h3>
                        <p className="text-sm text-gray-400 mb-4">This will mark every <span className="text-green-400 font-medium">In-Progress</span> order as <span className="text-green-400 font-medium">Completed</span>.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowBulkCompleteModal(false)} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600">Cancel</button>

                           

                            <button onClick={async () => {
                                setIsBulkCompleting(true); // Disable print button during bulk complete

                                try {
                                    const payload = {
                                        status: status === 'All' ? undefined : status,
                                        dateFilter,
                                        startDate: dateFilter === 'Custom' && selectedDate ? selectedDate : undefined,
                                        endDate: dateFilter === 'Custom' && selectedDate ? selectedDate : undefined,
                                        orderType: orderType === 'All' ? undefined : orderType,
                                        paymentMethod: paymentMethod === 'All' ? undefined : paymentMethod,
                                    };

                                    const { success, modifiedCount, message } = await completeAllOrders(payload);

                                    if (success) {
                                        setLocalBulkStats(prev => ({
                                            ...prev,
                                            byStatus: {
                                                ...prev.byStatus,
                                                "In Progress": 0
                                            }
                                        }));

                                        // ✅ Show success message
                                        enqueueSnackbar(`${modifiedCount} orders completed successfully! Refreshing data...`, {
                                            variant: 'success',
                                            autoHideDuration: 3000
                                        });

                                        // ✅ STEP 1: Update React Query cache immediately
                                        queryClient.setQueryData(['orders'], (old) => {
                                            if (old?.pages) {
                                                const newPages = old.pages.map(page => ({
                                                    ...page,
                                                    data: page.data?.map(order => {
                                                        if (order.orderStatus === 'In Progress') {
                                                            return {
                                                                ...order,
                                                                orderStatus: 'Completed',
                                                                completedAt: new Date().toISOString()
                                                            };
                                                        }
                                                        return order;
                                                    }) || []
                                                }));
                                                return { ...old, pages: newPages };
                                            }
                                            return old;
                                        });

                                        // ✅ STEP 2: Update offline cache
                                        const cachedOrders = await getCachedOrders();
                                        const updatedCachedOrders = cachedOrders.map(order => {
                                            if (order.orderStatus === 'In Progress') {
                                                return {
                                                    ...order,
                                                    orderStatus: 'Completed',
                                                    completedAt: new Date().toISOString()
                                                };
                                            }
                                            return order;
                                        });
                                        await updateOrdersCache(updatedCachedOrders);
                                        console.log('✅ [BULK COMPLETE] Offline cache updated');

                                        // ✅ STEP 3: Invalidate queries
                                        await Promise.all([
                                            queryClient.invalidateQueries({ queryKey: ['orders'] }),
                                            queryClient.invalidateQueries({ queryKey: ['tables'] }),
                                            queryClient.invalidateQueries({ queryKey: ['orderStats'] }),
                                            queryClient.invalidateQueries({ queryKey: ['paymentTotals'] }),
                                            queryClient.invalidateQueries({ queryKey: ['analytics', 'today'] }) // ✅ Add this
                                        ]);

                                        // ✅ STEP 4: Refetch everything
                                        await Promise.all([
                                            refetchOrders(),
                                            refetchStats(),
                                            refetchPaymentTotals()
                                        ]);

                                        // ✅ STEP 5: Fetch fresh data from server with delay
                                        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds

                                        await fetchAndCacheRecentOrders(true);
                                        console.log('✅ [BULK COMPLETE] All data refreshed');

                                       
                                    }
                                } catch (err) {
                                    console.error('❌ Bulk complete error:', err);
                                    enqueueSnackbar(err?.response?.data?.message || 'Bulk complete failed', {
                                        variant: 'error'
                                    });
                                } finally {
                                    setShowBulkCompleteModal(false);
                                    setIsBulkCompleting(false); // Re-enable print button
                                }
                            }} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isBulkCompleting}>
                                {isBulkCompleting ? 'Completing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* -------  ORDERS GRID  ------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 md:pb-28 overflow-y-auto scrollbar-hide">
                {sortedFilteredOrders.length ? (
                    sortedFilteredOrders.map((order, index) => (
                        <div key={order._id} className="relative" ref={index === sortedFilteredOrders.length - 1 ? lastOrderRef : null}>
                            <OrderCard order={order} />
                            {order._isPending && (
                                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">Pending Sync</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col justify-center items-center h-full min-h-[300px] sm:min-h-[400px]">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        <p className="text-base sm:text-xl text-gray-500 font-medium text-center px-4">No orders match the current filters</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center px-4">Try adjusting your filter settings</p>
                    </div>
                )}
            </div>

            {isFetchingNextPage && (
                <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02ca3a]"></div></div>
            )}

            {/* -------  PASSWORD MODAL  ------- */}
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">View Total Details - Admin Password Required</h3>
                        <input type="password" className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter admin password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && setShowDetailedBreakdown(true) && setShowPasswordModal(false)} />
                        <div className="flex justify-end gap-2 sm:gap-3">
                            <button onClick={() => { setShowPasswordModal(false); setAdminPassword(""); }} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base">Cancel</button>
                            <button onClick={() => { setShowDetailedBreakdown(true); setShowPasswordModal(false); }} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* -------  DETAIL BREAKDOWN MODAL  ------- */}
            {showDetailedBreakdown && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[450px] border border-gray-700">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-50 text-center">Payment Breakdown</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Cash Payments</span></div><span className="text-base sm:text-lg font-bold text-[#02ca3a]">{displayTotals?.Cash || "0.000"}</span></div>
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Online Payments</span></div><span className="text-base sm:text-lg font-bold text-[#02ca3a]">{displayTotals?.Online || "0.000"}</span></div>
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Benefit Payments</span></div><span className="text-base sm:text-lg font-bold text-[#02ca3a]">{displayTotals?.Benefit || "0.000"}</span></div>
                            <div className="flex items-center justify-between p-4 bg-[#02ca3a] rounded-lg mt-4"><span className="text-base sm:text-lg font-bold text-black">Total Amount</span><span className="text-lg sm:text-xl font-extrabold text-black">{displayTotals?.Total || "0.000"}</span></div>
                            {/* <button onClick={handlePrintSalesReport} disabled={isPrintingReport} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-200 flex justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed" title="Print Today's Sales Report"><Printer className="w-5 h-5" />{isPrintingReport ? 'Printing...' : 'Sales Report'}</button> */}
                            <button
                                onClick={handlePrintSalesReport}
                                disabled={isPrintingReport || isBulkCompleting} // ✅ Disable during bulk complete
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-200 flex justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                title={isBulkCompleting ? "Please wait for bulk complete to finish" : "Print Today's Sales Report"}>
                                <Printer className="w-5 h-5" />
                                {isBulkCompleting ? 'Refreshing data...' : isPrintingReport ? 'Printing...' : 'Sales Report'}
                            </button>

                        </div>
                        <button onClick={() => setShowDetailedBreakdown(false)} className="w-full px-4 py-2.5 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base font-semibold transition-colors">Close</button>
                    </div>
                </div>
            )}

            <BottomNav />
        </section>
    );
};
export default Orders;