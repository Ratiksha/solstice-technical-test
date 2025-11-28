import { useForm } from "react-hook-form";
import { useAuthStore } from "../state/authStore";
import { loginapi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
    const setTokens = useAuthStore((state) => state.setTokens);
    const navigate = useNavigate();

    const { 
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async ({ email, password }) => {
        setApiError(null);
        setLoading(true);
        try {
            const response = await loginapi(email, password);

            const { accessToken, refreshToken, user} = response.data;

            setTokens(accessToken, refreshToken, user);

            navigate("/uploads");
        } catch (error) {
            setApiError(error.response.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };
    

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
                {/* Email */}
                {apiError && (
                    <div className="text-red-600 text-sm text-center">{apiError}</div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        id="email"
                        type="email"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        {...register("email", { required: "Email required" })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        id="password"
                        type="password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        {...register("password", {required: "Password is required" })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50
                    opa"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
}

export default LoginPage;