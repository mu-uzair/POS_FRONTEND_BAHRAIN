import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import logo from "../../assets/logo.png"
import { useDispatch, useSelector } from "react-redux";

import { TbLogout } from "react-icons/tb";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { Navigate, useNavigate } from "react-router-dom";
import { removeUser } from "../../redux/slice/userSlice"
import { MdSpaceDashboard, MdOutlineInventory  } from "react-icons/md";


const Header = () => {

    const userData = useSelector(state => state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: (data)=> {
            console.log(data);
            dispatch(removeUser());
            navigate("/auth")
            

        },
        onError: (error) => {
            console.log(error)
        }
    })
    const handleLogout = () =>{
        logoutMutation.mutate();
    }

    return (

        <header className="flex justify-between items-center py-4 px-8 bg-[#1a1a1a]">


            {/* LOGO */}
            <div onClick={()=> navigate('/')} className="flex items-center gap-2 cursor-pointer">
                <img src={logo} alt="restaurant logo"
                 className="h-auto w-auto max-h-10 max-w-10 object-contain " />
                <h1 className="text-lg font-semibold text-[#f5f5f5] ">Savoury Bites</h1>
            </div>


            {/* SEARCH  */}
            <div className="flex items-center gap-4  bg-[#302f2f] rounded-[15px] px-5 w-[500px] h-8">
                <FaSearch className="text-[#f5f5f5]"/>
                <input
                type = "text"
                placeholder="Search"
                className="bg-[#302f2f] outline-none text-[#f5f5f5] "/>
            </div>


            {/* LOGGED USER DETAILS  */}
            <div className="flex items-center gap-4">
                { 
                 userData.role === "Admin" && (
                     <div onClick={() => navigate("/Inventory")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
                     <MdOutlineInventory  className="text-[#f5f5f5] text-2xl" />
 
                 </div>
                 )
                }
               { 
                userData.role === "Admin" && (
                    <div onClick={() => navigate("/dashboard")} className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
                    <MdSpaceDashboard className="text-[#f5f5f5] text-2xl" />

                </div>
                )
               }
                <div className="bg-[#302f2f] rounded-[15px] p-3 cursor-pointer">
                    <FaBell className="text-[#f5f5f5] text-2xl" />

                </div>
                <div className="flex item-center gap-3 cursor-pointer">
                    <FaUserCircle className="text-[#f5f5f5] text-4xl translate-y-.5" />
                    <div className="flex flex-col items-start">
                        <h1 className="text-md text-[#f5f5f5] font-semibold">{userData.name || "Test User"}</h1>
                        <p className="text-xs text-[#ababab] font-medium">{userData.role || "Role"}</p>
                    </div>

                    <TbLogout onClick={handleLogout} className="text-[#f5f5f5] ml-2 "size={40}/>
                </div>
            </div>

        </header>
    )


};
export default Header;
