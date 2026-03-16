import React, { useState } from 'react';
import { register } from '../../https';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const Register = ({ setIsRegister }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelection = (selectedRole) => {
        setFormData({ ...formData, role: selectedRole });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.role) {
            enqueueSnackbar("Please select a role", { variant: "warning" });
            return;
        }
        registerMutation.mutate(formData);
    };

    const registerMutation = useMutation({
        mutationFn: (reqData) => register(reqData),
        onSuccess: (res) => {
            const { data } = res;
            enqueueSnackbar(data.message || "Registration successful!", { variant: "success" });
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                role: "",
            });

            setTimeout(() => {
                setIsRegister(false);
            }, 1500);
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response?.data?.message || "Registration failed", { variant: "error" });
        }
    });

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                    <label className="block text-gray-300 mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                        Employee Name
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <User className="w-5 h-5 text-gray-500 group-focus-within:text-[#02ca3a] transition-colors" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter employee name"
                            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-[#1f1f1f] border-2 border-[#333333] rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:border-[#02ca3a] focus:outline-none focus:ring-2 focus:ring-[#02ca3a]/20 transition-all"
                            required
                            autoComplete="name"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mt-3">
                    <label className="block text-gray-300 mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wide">
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

                {/* Phone */}
                <div className="mt-3">
                    <label className="block text-gray-300 mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                        Employee Phone
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <Phone className="w-5 h-5 text-gray-500 group-focus-within:text-[#02ca3a] transition-colors" />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter employee phone"
                            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-[#1f1f1f] border-2 border-[#333333] rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:border-[#02ca3a] focus:outline-none focus:ring-2 focus:ring-[#02ca3a]/20 transition-all"
                            required
                            autoComplete="tel"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mt-3">
                    <label className="block text-gray-300 mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wide">
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
                            autoComplete="new-password"
                            minLength="6"
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

                {/* Role Selection */}
                <div className="mt-3">
                    <label className="block text-gray-300 mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                        Choose Your Role
                    </label>

                    <div className="flex items-center gap-3 mt-2">
                        {["Waiter", "Cashier", "Admin"].map((role) => {
                            return (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleSelection(role)}
                                    className={`relative px-4 py-3 w-full rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 border-2 ${
                                        formData.role === role
                                            ? "bg-gradient-to-r from-[#02ca3a] to-[#029c2e] border-[#02ca3a] text-black shadow-lg shadow-[#02ca3a]/30"
                                            : "bg-[#1f1f1f] border-[#333333] text-[#ababab] hover:border-[#02ca3a] hover:text-white"
                                    }`}
                                >
                                    {role}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full rounded-xl mt-6 py-3 sm:py-4 text-base sm:text-lg font-bold transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${
                        registerMutation.isPending
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#F6B100] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#F6B100] text-black shadow-[#F6B100]/50'
                    }`}
                    disabled={registerMutation.isPending}
                >
                    {registerMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                        </span>
                    ) : (
                        'Sign up'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Register;