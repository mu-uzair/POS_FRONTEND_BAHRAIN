// import React from "react";
// import { FaSearch } from "react-icons/fa";
// import { FaUserCircle } from "react-icons/fa";
// import { FaBell } from "react-icons/fa";
// import logo from "../../assets/logo.png"
// import { useDispatch, useSelector } from "react-redux";

// import { TbLogout } from "react-icons/tb";
// import { useMutation } from "@tanstack/react-query";
// import { logout } from "../../https";
// import { Navigate, useNavigate } from "react-router-dom";
// import { removeUser } from "../../redux/slice/userSlice"
// import { MdSpaceDashboard, MdOutlineInventory  } from "react-icons/md";


// const Header = () => {

//     const userData = useSelector(state => state.user);
//     const dispatch = useDispatch()
//     const navigate = useNavigate();
//     const logoutMutation = useMutation({
//         mutationFn: () => logout(),
//         onSuccess: (data)=> {
//             console.log(data);
//             dispatch(removeUser());
//             navigate("/auth")
            

//         },
//         onError: (error) => {
//             console.log(error)
//         }
//     })
//     const handleLogout = () =>{
//         logoutMutation.mutate();
//     }

//     return (

//         <header className="flex justify-between items-center py-4 px-8 bg-[#1a1a1a]">


//             {/* LOGO */}
//             <div onClick={()=> navigate('/')} className="flex items-center gap-2 cursor-pointer">
//                 <img src={logo} alt="restaurant logo "
//                 //  className="h-auto w-auto max-h-10 max-w-20 object-contain " />
//                  className="h-16 w- object-contain" />
//                 <h1 className="text-lg font-semibold text-[#f5f5f5] ">AL SAYEDA</h1>
//             </div>


//             {/* SEARCH  */}
//             <div className="flex items-center gap-4  bg-[#302f2f] rounded-[15px] px-5 w-[500px] h-8">
//                 <FaSearch className="text-[#f5f5f5]"/>
//                 <input
//                 type = "text"
//                 placeholder="Search"
//                 className="bg-[#302f2f] outline-none text-[#f5f5f5] "/>
//             </div>


//             {/* LOGGED USER DETAILS  */}
//             <div className="flex items-center gap-4">
//                 { 
//                  userData.role === "Admin" && (
//                      <div onClick={() => navigate("/Inventory")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                      <MdOutlineInventory  className="text-[#f5f5f5] text-2xl" />
 
//                  </div>
//                  )
//                 }
//                { 
//                 userData.role === "Admin" && (
//                     <div onClick={() => navigate("/dashboard")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                     <MdSpaceDashboard className="text-[#f5f5f5] text-2xl" />

//                 </div>
//                 )
//                }
//                 <div className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                     <FaBell className="text-[#f5f5f5] text-2xl" />

//                 </div>
//                 <div className="flex item-center gap-3 cursor-pointer">
//                     <FaUserCircle className="text-[#f5f5f5] text-4xl translate-y-.5" />
//                     <div className="flex flex-col items-start">
//                         <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name || "Test User"}</h1>
//                         <p className="text-xs text-[#ababab] font-medium">{userData.role || "Role"}</p>
//                     </div>

//                     <TbLogout onClick={handleLogout} className="text-[#f5f5f5] ml-2 "size={40}/>
//                 </div>
//             </div>

//         </header>
//     )


// };
// export default Header;


// responsive for mobile and tablet

// import React, { useState } from "react";
// import { FaSearch, FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
// import { TbLogout } from "react-icons/tb";
// import { MdSpaceDashboard, MdOutlineInventory } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { useMutation } from "@tanstack/react-query";
// import { logout } from "../../https";
// import { useNavigate } from "react-router-dom";
// import { removeUser } from "../../redux/slice/userSlice";
// import logo from "../../assets/logo.png";

// const Header = () => {
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isSearchOpen, setIsSearchOpen] = useState(false);
    
//     const userData = useSelector(state => state.user);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     const logoutMutation = useMutation({
//         mutationFn: () => logout(),
//         onSuccess: (data) => {
//             console.log(data);
//              // Clear localStorage
//     localStorage.removeItem("user");
//             dispatch(removeUser());
//             navigate("/auth");
//         },
//         onError: (error) => {
//             console.log(error);
//         }
//     });
    
//     const handleLogout = () => {
//         logoutMutation.mutate();
//     };

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     const toggleSearch = () => {
//         setIsSearchOpen(!isSearchOpen);
//     };

//     return (
//         <header className="bg-[#1a1a1a] relative">
//             {/* Main Header */}
//             <div className="flex justify-between items-center py-4 px-4 md:px-6 lg:px-8">
//                 {/* LOGO */}
//                 <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
//                     <img src={logo} alt="restaurant logo" className="h-12 md:h-16 w-auto object-contain" />
//                     <h1 className="text-base md:text-lg font-semibold text-[#f5f5f5]">AL SAYEDA</h1>
//                 </div>

//                 {/* DESKTOP SEARCH - Hidden on mobile/tablet */}
//                 <div className="hidden lg:flex items-center gap-4 bg-[#302f2f] rounded-[15px] px-5 w-[500px] h-10">
//                     <FaSearch className="text-[#f5f5f5]"/>
//                     <input
//                         type="text"
//                         placeholder="Search"
//                         className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full"
//                     />
//                 </div>

//                 {/* DESKTOP USER DETAILS - Hidden on mobile/tablet */}
//                 <div className="hidden lg:flex items-center gap-4">
//                     {userData.role === "Admin" && (
//                         <div onClick={() => navigate("/Inventory")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
//                             <MdOutlineInventory className="text-[#f5f5f5] text-2xl" />
//                         </div>
//                     )}
//                     {userData.role === "Admin" && (
//                         <div onClick={() => navigate("/dashboard")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
//                             <MdSpaceDashboard className="text-[#f5f5f5] text-2xl" />
//                         </div>
//                     )}
//                     <div className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
//                         <FaBell className="text-[#f5f5f5] text-2xl" />
//                     </div>
//                     <div className="flex items-center gap-3 cursor-pointer">
//                         <FaUserCircle className="text-[#f5f5f5] text-4xl" />
//                         <div className="flex flex-col items-start">
//                             <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name || "Test User"}</h1>
//                             <p className="text-xs text-[#ababab] font-medium">{userData.role || "Role"}</p>
//                         </div>
//                         <TbLogout onClick={handleLogout} className="text-[#f5f5f5] ml-2 hover:text-red-400 transition-colors" size={40}/>
//                     </div>
//                 </div>

//                 {/* MOBILE/TABLET ACTIONS */}
//                 <div className="flex lg:hidden items-center gap-3">
//                     {/* Search Icon for Mobile/Tablet */}
//                     <button onClick={toggleSearch} className="bg-[#302f2f] rounded-[15px] p-2 cursor-pointer">
//                         <FaSearch className="text-[#f5f5f5] text-xl" />
//                     </button>
                    
//                     {/* Hamburger Menu */}
//                     <button onClick={toggleMobileMenu} className="bg-[#302f2f] rounded-[15px] p-2 cursor-pointer">
//                         {isMobileMenuOpen ? (
//                             <FaTimes className="text-[#f5f5f5] text-2xl" />
//                         ) : (
//                             <FaBars className="text-[#f5f5f5] text-2xl" />
//                         )}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile/Tablet Search Bar - Expandable */}
//             {isSearchOpen && (
//                 <div className="lg:hidden px-4 pb-4">
//                     <div className="flex items-center gap-4 bg-[#302f2f] rounded-[15px] px-5 h-10">
//                         <FaSearch className="text-[#f5f5f5]"/>
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full"
//                             autoFocus
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* MOBILE/TABLET MENU DROPDOWN */}
//             {isMobileMenuOpen && (
//                 <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] border-t border-[#302f2f] shadow-lg z-50">
//                     <div className="px-4 py-4 space-y-4">
//                         {/* User Info */}
//                         <div className="flex items-center gap-3 pb-4 border-b border-[#302f2f]">
//                             <FaUserCircle className="text-[#f5f5f5] text-4xl" />
//                             <div className="flex flex-col items-start">
//                                 <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name || "Test User"}</h1>
//                                 <p className="text-xs text-[#ababab] font-medium">{userData.role || "Role"}</p>
//                             </div>
//                         </div>

//                         {/* Menu Items */}
//                         <div className="space-y-2">
//                             <div className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                                 <FaBell className="text-[#f5f5f5] text-xl" />
//                                 <span className="text-[#f5f5f5]">Notifications</span>
//                             </div>

//                             {userData.role === "Admin" && (
//                                 <>
//                                     <div onClick={() => {
//                                         navigate("/dashboard");
//                                         setIsMobileMenuOpen(false);
//                                     }} className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                                         <MdSpaceDashboard className="text-[#f5f5f5] text-xl" />
//                                         <span className="text-[#f5f5f5]">Dashboard</span>
//                                     </div>

//                                     <div onClick={() => {
//                                         navigate("/Inventory");
//                                         setIsMobileMenuOpen(false);
//                                     }} className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                                         <MdOutlineInventory className="text-[#f5f5f5] text-xl" />
//                                         <span className="text-[#f5f5f5]">Inventory</span>
//                                     </div>
//                                 </>
//                             )}

//                             <div onClick={handleLogout} className="flex items-center gap-3 bg-red-600 rounded-[15px] p-3 cursor-pointer hover:bg-red-700 transition-colors">
//                                 <TbLogout className="text-[#f5f5f5] text-xl" />
//                                 <span className="text-[#f5f5f5]">Logout</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </header>
//     );
// };

// export default Header;

// import React, { useState } from "react";
// import { FaSearch, FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
// import { TbLogout } from "react-icons/tb";
// import { MdSpaceDashboard, MdOutlineInventory } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { useMutation } from "@tanstack/react-query";
// import { logout } from "../../https";
// import { useNavigate } from "react-router-dom";
// import { removeUser } from "../../redux/slice/userSlice";
// import logo from "../../assets/logo.png";

// // ✅ NEW IMPORT
// import OfflineToggleButton from "../shared/OfflineToggleButton";

// const Header = () => {
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isSearchOpen, setIsSearchOpen] = useState(false);
    
//     const userData = useSelector(state => state.user);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     const logoutMutation = useMutation({
//         mutationFn: () => logout(),
//         onSuccess: (data) => {
//             localStorage.removeItem("user");
//             dispatch(removeUser());
//             navigate("/auth");
//         },
//         onError: (error) => {
//             console.log(error);
//         }
//     });
    
//     const handleLogout = () => {
//         logoutMutation.mutate();
//     };

//     const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//     const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

//     return (
//         <header className="bg-[#1a1a1a] relative">
//             {/* Main Header */}
//             <div className="flex justify-between items-center py-4 px-4 md:px-6 lg:px-8">

//                 {/* LOGO */}
//                 <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
//                     <img src={logo} alt="restaurant logo" className="h-12 md:h-16 w-auto object-contain" />
//                     <h1 className="text-base md:text-lg font-semibold text-[#f5f5f5]">AL SAYEDA</h1>
//                 </div>

//                 {/* DESKTOP SEARCH */}
//                 <div className="hidden lg:flex items-center gap-4 bg-[#302f2f] rounded-[15px] px-5 w-[500px] h-10">
//                     <FaSearch className="text-[#f5f5f5]"/>
//                     <input
//                         type="text"
//                         placeholder="Search"
//                         className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full"
//                     />
//                 </div>

//                 {/* DESKTOP ACTIONS */}
//                 <div className="hidden lg:flex items-center gap-4">

//                     {/* Inventory */}
//                     {userData.role === "Admin" && (
//                         <div onClick={() => navigate("/Inventory")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
//                             <MdOutlineInventory className="text-[#f5f5f5] text-2xl" />
//                         </div>
//                     )}

//                     {/* Dashboard */}
//                     {userData.role === "Admin" && (
//                         <div onClick={() => navigate("/dashboard")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
//                             <MdSpaceDashboard className="text-[#f5f5f5] text-2xl" />
//                         </div>
//                     )}

//                     {/* Notifications */}
//                     <div className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
//                         <FaBell className="text-[#f5f5f5] text-2xl" />
//                     </div>

//                     {/* ✅ INSERTED OFFLINE TOGGLE BUTTON HERE */}
//                     <OfflineToggleButton />

//                     {/* User + Logout */}
//                     <div className="flex items-center gap-3 cursor-pointer">
//                         <FaUserCircle className="text-[#f5f5f5] text-4xl" />
//                         <div className="flex flex-col items-start">
//                             <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name}</h1>
//                             <p className="text-xs text-[#ababab] font-medium">{userData.role}</p>
//                         </div>
//                         <TbLogout
//                             onClick={handleLogout}
//                             className="text-[#f5f5f5] ml-2 hover:text-red-400 transition-colors"
//                             size={40}
//                         />
//                     </div>
//                 </div>

//                 {/* MOBILE/TABLET ACTIONS */}
//                 <div className="flex lg:hidden items-center gap-3">
//                     <button onClick={toggleSearch} className="bg-[#302f2f] rounded-[15px] p-2 cursor-pointer">
//                         <FaSearch className="text-[#f5f5f5] text-xl" />
//                     </button>

//                     {/* Mobile Menu */}
//                     <button onClick={toggleMobileMenu} className="bg-[#302f2f] rounded-[15px] p-2 cursor-pointer">
//                         {isMobileMenuOpen ? (
//                             <FaTimes className="text-[#f5f5f5] text-2xl" />
//                         ) : (
//                             <FaBars className="text-[#f5f5f5] text-2xl" />
//                         )}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Search */}
//             {isSearchOpen && (
//                 <div className="lg:hidden px-4 pb-4">
//                     <div className="flex items-center gap-4 bg-[#302f2f] rounded-[15px] px-5 h-10">
//                         <FaSearch className="text-[#f5f5f5]" />
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full"
//                             autoFocus
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* MOBILE MENU DROPDOWN */}
//             {isMobileMenuOpen && (
//                 <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] border-t border-[#302f2f] shadow-lg z-50">
//                     <div className="px-4 py-4 space-y-4">

//                         {/* User Info */}
//                         <div className="flex items-center gap-3 pb-4 border-b border-[#302f2f]">
//                             <FaUserCircle className="text-[#f5f5f5] text-4xl" />
//                             <div className="flex flex-col items-start">
//                                 <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name}</h1>
//                                 <p className="text-xs text-[#ababab] font-medium">{userData.role}</p>
//                             </div>
//                         </div>

//                         {/* Menu Items */}
//                         <div className="space-y-3">

//                             {/* Notifications */}
//                             <div className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                                 <FaBell className="text-[#f5f5f5] text-xl" />
//                                 <span className="text-[#f5f5f5]">Notifications</span>
//                             </div>

//                             {/* Dashboard & Inventory */}
//                             {userData.role === "Admin" && (
//                                 <>
//                                     <div onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                                         <MdSpaceDashboard className="text-[#f5f5f5] text-xl" />
//                                         <span className="text-[#f5f5f5]">Dashboard</span>
//                                     </div>

//                                     <div onClick={() => { navigate("/Inventory"); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
//                                         <MdOutlineInventory className="text-[#f5f5f5] text-xl" />
//                                         <span className="text-[#f5f5f5]">Inventory</span>
//                                     </div>
//                                 </>
//                             )}

//                             {/* ✅ ADD OFFLINE BUTTON INSIDE MOBILE MENU */}
//                             <div className="bg-[#302f2f] rounded-[15px] p-3 flex justify-center">
//                                 <OfflineToggleButton />
//                             </div>

//                             {/* Logout */}
//                             <div onClick={handleLogout} className="flex items-center gap-3 bg-red-600 rounded-[15px] p-3 cursor-pointer hover:bg-red-700 transition-colors">
//                                 <TbLogout className="text-[#f5f5f5] text-xl" />
//                                 <span className="text-[#f5f5f5]">Logout</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </header>
//     );
// };

// export default Header;


// components/shared/Header.jsx
import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { MdSpaceDashboard, MdOutlineInventory } from "react-icons/md";
import { WifiOff, Wifi } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../redux/slice/userSlice";
import { useOfflineMode } from '../../constants/OfflineModeContext';
import { enqueueSnackbar } from "notistack";
import logo from "../../assets/logo.png";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const userData = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // ✅ Get offline mode state from context
    const { 
        isOfflineMode, 
        actualOnlineStatus,
        hasInternetConnection,
        toggleOfflineMode,
        manualOfflineMode 
    } = useOfflineMode();
    
    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: (data) => {
            console.log("✅ Online logout successful");
            localStorage.removeItem("user");
            dispatch(removeUser());
            navigate("/auth");
        },
        onError: (error) => {
            console.error("❌ Online logout error:", error);
            // Still logout locally even if API fails
            localStorage.removeItem("user");
            dispatch(removeUser());
            navigate("/auth");
        }
    });
    
    // ✅ UPDATED LOGOUT HANDLER - Works in both online and offline modes
    const handleLogout = () => {
        if (!isOfflineMode) {
            // --- ONLINE LOGOUT ---
            console.log("🌐 Attempting online logout...");
            logoutMutation.mutate();
        } else {
            // --- OFFLINE LOGOUT ---
            console.log("📴 Performing offline logout...");
            
            // Clear local storage
            localStorage.removeItem("user");
            
            // Clear Redux state
            dispatch(removeUser());
            
            // Show notification
            enqueueSnackbar("Logged out successfully (offline mode)", { 
                variant: "info" 
            });
            
            // Navigate to login
            navigate("/auth");
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    return (
        <header className="bg-[#1a1a1a] relative">
            {/* Main Header */}
            <div className="flex justify-between items-center py-4 px-4 md:px-6 lg:px-8">

                {/* LOGO */}
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
                    <img src={logo} alt="restaurant logo" className="h-12 md:h-16 w-auto object-contain" />
                    <h1 className="text-base md:text-lg font-semibold text-[#f5f5f5]">AL SAYEDA</h1>
                </div>

                {/* DESKTOP SEARCH */}
                <div className="hidden lg:flex items-center gap-4 bg-[#302f2f] rounded-[15px] px-5 w-[500px] h-10">
                    <FaSearch className="text-[#f5f5f5]"/>
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full"
                    />
                </div>

                {/* DESKTOP ACTIONS */}
                <div className="hidden lg:flex items-center gap-4">

                    {/* Inventory */}
                    {userData.role === "Admin" && (
                        <div onClick={() => navigate("/Inventory")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
                            <MdOutlineInventory className="text-[#f5f5f5] text-2xl" />
                        </div>
                    )}

                    {/* Dashboard */}
                    {userData.role === "Admin" && (
                        <div onClick={() => navigate("/dashboard")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
                            <MdSpaceDashboard className="text-[#f5f5f5] text-2xl" />
                        </div>
                    )}

                    {/* Notifications */}
                    <div className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors">
                        <FaBell className="text-[#f5f5f5] text-2xl" />
                    </div>

                    {/* ✅ NETWORK STATUS INDICATOR */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        isOfflineMode 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'bg-green-500/20 text-green-400'
                    }`}>
                        {isOfflineMode ? (
                            <>
                                <WifiOff className="w-4 h-4" />
                                <span>
                                    {manualOfflineMode 
                                        ? 'Offline' 
                                        : !actualOnlineStatus 
                                        ? 'No Network' 
                                        : 'No Internet'}
                                </span>
                            </>
                        ) : (
                            <>
                                <Wifi className="w-4 h-4" />
                                <span>Online</span>
                            </>
                        )}
                    </div>

                    {/* ✅ OFFLINE TOGGLE BUTTON */}
                    <button
                        onClick={toggleOfflineMode}
                        disabled={!actualOnlineStatus || !hasInternetConnection}
                        className={`px-3 py-2 rounded-lg font-medium text-xs transition-all flex items-center gap-2 ${
                            manualOfflineMode
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-[#302f2f] hover:bg-[#3d3d3d] text-[#f5f5f5]'
                        } ${(!actualOnlineStatus || !hasInternetConnection) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={
                            !actualOnlineStatus 
                                ? 'No network connection' 
                                : !hasInternetConnection
                                ? 'No internet connection'
                                : manualOfflineMode 
                                ? 'Switch to Online Mode' 
                                : 'Switch to Offline Mode'
                        }
                    >
                        {manualOfflineMode ? (
                            <>
                                <Wifi className="w-4 h-4" />
                                <span>Go Online</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4" />
                                <span>Go Offline</span>
                            </>
                        )}
                    </button>

                    {/* User + Logout */}
                    <div className="flex items-center gap-3 cursor-pointer">
                        <FaUserCircle className="text-[#f5f5f5] text-4xl" />
                        <div className="flex flex-col items-start">
                            <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name}</h1>
                            <p className="text-xs text-[#ababab] font-medium">{userData.role}</p>
                        </div>
                        <TbLogout
                            onClick={handleLogout}
                            className="text-[#f5f5f5] ml-2 hover:text-red-400 transition-colors cursor-pointer"
                            size={40}
                            title="Logout"
                        />
                    </div>
                </div>

                {/* MOBILE/TABLET ACTIONS */}
                <div className="flex lg:hidden items-center gap-3">
                    {/* ✅ MOBILE STATUS INDICATOR */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        isOfflineMode 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'bg-green-500/20 text-green-400'
                    }`}>
                        {isOfflineMode ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                    </div>

                    <button onClick={toggleSearch} className="bg-[#302f2f] rounded-[15px] p-2 cursor-pointer">
                        <FaSearch className="text-[#f5f5f5] text-xl" />
                    </button>

                    {/* Mobile Menu */}
                    <button onClick={toggleMobileMenu} className="bg-[#302f2f] rounded-[15px] p-2 cursor-pointer">
                        {isMobileMenuOpen ? (
                            <FaTimes className="text-[#f5f5f5] text-2xl" />
                        ) : (
                            <FaBars className="text-[#f5f5f5] text-2xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* ✅ OFFLINE MODE WARNING BANNER */}
            {manualOfflineMode && (
                <div className="bg-orange-500/10 border-t border-orange-500/30 px-4 md:px-6 lg:px-8 py-2">
                    <div className="flex items-center gap-2">
                        <WifiOff className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <p className="text-xs text-orange-400">
                            <strong>Manual Offline Mode:</strong> All operations are working locally. Data will sync when you go online.
                        </p>
                    </div>
                </div>
            )}

            {/* Mobile Search */}
            {isSearchOpen && (
                <div className="lg:hidden px-4 pb-4">
                    <div className="flex items-center gap-4 bg-[#302f2f] rounded-[15px] px-5 h-10">
                        <FaSearch className="text-[#f5f5f5]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* MOBILE MENU DROPDOWN */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] border-t border-[#302f2f] shadow-lg z-50">
                    <div className="px-4 py-4 space-y-4">

                        {/* User Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-[#302f2f]">
                            <FaUserCircle className="text-[#f5f5f5] text-4xl" />
                            <div className="flex flex-col items-start flex-1">
                                <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name}</h1>
                                <p className="text-xs text-[#ababab] font-medium">{userData.role}</p>
                            </div>
                            {/* ✅ Mobile Status Badge */}
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                isOfflineMode 
                                    ? 'bg-orange-500/20 text-orange-400' 
                                    : 'bg-green-500/20 text-green-400'
                            }`}>
                                {isOfflineMode ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                                <span>{isOfflineMode ? (manualOfflineMode ? 'Offline' : 'No Net') : 'Online'}</span>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-3">

                            {/* Notifications */}
                            <div className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
                                <FaBell className="text-[#f5f5f5] text-xl" />
                                <span className="text-[#f5f5f5]">Notifications</span>
                            </div>

                            {/* Dashboard & Inventory */}
                            {userData.role === "Admin" && (
                                <>
                                    <div onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
                                        <MdSpaceDashboard className="text-[#f5f5f5] text-xl" />
                                        <span className="text-[#f5f5f5]">Dashboard</span>
                                    </div>

                                    <div onClick={() => { navigate("/Inventory"); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
                                        <MdOutlineInventory className="text-[#f5f5f5] text-xl" />
                                        <span className="text-[#f5f5f5]">Inventory</span>
                                    </div>
                                </>
                            )}

                            {/* ✅ OFFLINE TOGGLE BUTTON IN MOBILE MENU */}
                            <button
                                onClick={toggleOfflineMode}
                                disabled={!actualOnlineStatus}
                                className={`w-full flex items-center justify-center gap-2 rounded-[15px] p-3 font-medium text-sm transition-all ${
                                    manualOfflineMode
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-[#302f2f] hover:bg-[#3d3d3d] text-[#f5f5f5]'
                                } ${!actualOnlineStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {manualOfflineMode ? (
                                    <>
                                        <Wifi className="w-5 h-5" />
                                        <span>Switch to Online</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-5 h-5" />
                                        <span>Switch to Offline</span>
                                    </>
                                )}
                            </button>

                            {/* Logout */}
                            <div onClick={handleLogout} className="flex items-center gap-3 bg-red-600 rounded-[15px] p-3 cursor-pointer hover:bg-red-700 transition-colors">
                                <TbLogout className="text-[#f5f5f5] text-xl" />
                                <span className="text-[#f5f5f5]">Logout</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;