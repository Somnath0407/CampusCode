import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { loginUser } from "../store/authSlice";
import Logo from "../components/Logo";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(form));
        if (loginUser.fulfilled.match(result)) {
            toast.success("Welcome back!");
            navigate(result.payload.role === "admin" ? "/admin" : "/problems");
        } else {
            toast.error(result.payload || "Login failed");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
            {/* Brand panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-base-200 via-base-200 to-base-300 border-r border-base-300 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
                <Link to="/login" className="flex items-center gap-2 text-2xl font-extrabold relative z-10">
                    <Logo size={40} className="shadow-lg shadow-primary/20 rounded-xl" />
                    <span className="brand-gradient">CampusCode</span>
                </Link>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold leading-tight mb-3">
                        Sharpen your skills, <span className="text-primary">one problem</span> at a time.
                    </h2>
                    <p className="text-base-content/60 max-w-md">
                        Solve curated coding challenges, get instant feedback from a real judge, and track your progress across easy, medium, and hard problems.
                    </p>
                </div>
                <p className="text-xs text-base-content/40 relative z-10">© {new Date().getFullYear()} CampusCode</p>
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-1">Log in</h1>
                    <p className="text-base-content/60 text-sm mb-6">Welcome back — enter your details to continue.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <Mail size={16} className="text-base-content/40" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="grow"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <Lock size={16} className="text-base-content/40" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="grow"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <button type="submit" className="btn btn-primary mt-2 gap-2" disabled={loading}>
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : (
                                <>Log In <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>
                    <p className="text-sm text-base-content/60 mt-6 text-center">
                        Don't have an account?{" "}
                        <Link to="/signup" className="link link-primary font-medium">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
