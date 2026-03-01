import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Default credentials as requested
        if (credentials.username === "admin" && credentials.password === "admin123") {
            localStorage.setItem("adminAuth", "true");
            navigate("/admin");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Admin Login</h1>
                    <p className="text-gray-500 text-sm mt-2">Enter your credentials to access the panel</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="admin"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg mt-4"
                    >
                        LOGIN TO DASHBOARD
                    </button>
                </form>

                <div className="text-center">
                    <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-primary transition">Return to Home</button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
