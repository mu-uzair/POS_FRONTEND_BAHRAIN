import React, { useState } from "react";
import restaurant from "../assets/restaurant.jpg"
import logo from "../assets/logo.png"
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false)

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full">
            {/* Left Section - Hidden on mobile & tablet, visible only on desktop */}
            <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center bg-cover">
                {/* BG Image */}
                <img 
                    className="w-full h-full object-cover" 
                    src={restaurant} 
                    alt="restaurant image" 
                />
                
                {/* Black Overlay */}
                <div 
                    className="absolute inset-0 bg-black bg-opacity-60" 
                    style={{ opacity: 0.6 }}
                ></div>

                {/* Quote at bottom */}
                <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white">
                    "Good food is not just about taste — it's about creating memories, sharing laughter, and bringing people closer, one delicious bite at a time."
                    <br />
                    <span className="block mt-4 text-yellow-400">
                        - Founder of AL SYEDA
                    </span>
                </blockquote>
            </div>

            {/* Right Section - Full width on mobile & tablet, 40% on desktop */}
            <div className="w-full lg:w-2/5 min-h-screen bg-[#1a1a1a] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
                    <img 
                        src={logo} 
                        alt="Restro Logo" 
                        className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 border-2 border-white rounded-full p-1"
                    />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#f5f5f5] tracking-wide">
                        AL SYEDA
                    </h1>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold text-yellow-400 mb-6 sm:mb-8 md:mb-10">
                    {isRegister ? "Employee Registration" : "Employee Login"}
                </h2>

                {/* Auth Components - Centered with max width */}
                <div className="flex-1 flex flex-col justify-center w-full max-w-sm sm:max-w-md mx-auto">
                    {isRegister ? (
                        <Register setIsRegister={setIsRegister} />
                    ) : (
                        <Login />
                    )}
                </div>

                {/* Toggle Link */}
                <div className="flex justify-center mt-6 sm:mt-8">
                    <p className="text-sm sm:text-base text-[#ababab]">
                        {isRegister ? "Already have an account?" : "Don't have an account?"}
                        <a 
                            onClick={() => setIsRegister(!isRegister)} 
                            className="text-yellow-400 font-semibold hover:underline cursor-pointer ml-1"
                        >
                            {isRegister ? "Sign in" : "Sign up"}
                        </a>
                    </p>
                </div>

                {/* Mobile & Tablet Only - Restaurant Info */}
                <div className="lg:hidden mt-8 pt-6 border-t border-gray-700">
                    <p className="text-xs sm:text-sm text-center text-gray-400 italic px-4">
                        "Good food is not just about taste — it's about creating memories, sharing laughter, and bringing people closer, one delicious bite at a time."
                        <span className="block mt-2 sm:mt-3 text-yellow-400 not-italic">
                            - Founder of AL SYEDA
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Auth;