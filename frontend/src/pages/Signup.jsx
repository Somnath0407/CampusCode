import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { registerUser } from "../store/authSlice";
import Logo from "../components/Logo";

const Signup = () => {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(form));
        if (registerUser.fulfilled.match(result)) {
            toast.success("Account created!");
            navigate("/problems");
        } else {
            toast.error(result.payload || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
            {/* Brand panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-base-200 via-base-200 to-base-300 border-r border-base-300 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
                <Link to="/signup" className="flex items-center gap-2 text-2xl font-extrabold relative z-10">
                    <Logo size={40} className="shadow-lg shadow-primary/20 rounded-xl" />
                    <span className="brand-gradient">CampusCode</span>
                </Link>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold leading-tight mb-3">
                        Join a community of <span className="text-primary">problem solvers</span>.
                    </h2>
                    <p className="text-base-content/60 max-w-md">
                        Create an account to save your progress, track solved problems, and build your submission history.
                    </p>
                </div>
                <p className="text-xs text-base-content/40 relative z-10">© {new Date().getFullYear()} CampusCode</p>
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-1">Create your account</h1>
                    <p className="text-base-content/60 text-sm mb-6">Start solving in less than a minute.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <User size={16} className="text-base-content/40" />
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    className="grow"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={20}
                                    required
                                />
                            </label>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    className="grow"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={20}
                                    required
                                />
                            </label>
                        </div>
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
                                minLength={8}
                                required
                            />
                        </label>
                        <p className="text-xs text-base-content/50 -mt-2">
                            Min 8 characters, with uppercase, lowercase, number and symbol.
                        </p>
                        <button type="submit" className="btn btn-primary mt-2 gap-2" disabled={loading}>
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : (
                                <>Sign Up <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>
                    <p className="text-sm text-base-content/60 mt-6 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-primary font-medium">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
