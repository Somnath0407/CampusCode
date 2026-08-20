import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Lock, User, UserPlus } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";

const AdminCreateAdmin = () => {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "admin" });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post("/user/admin/register", form);
            toast.success("Admin account created");
            navigate("/admin");
        } catch (err) {
            toast.error(err?.response?.data || "Failed to create admin");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <div className="max-w-md mx-auto px-4 py-8">
                <Link to="/admin" className="text-sm text-base-content/50 hover:text-base-content flex items-center gap-1 mb-3 w-fit">
                    <ArrowLeft size={14} /> Back to dashboard
                </Link>
                <div className="flex items-center gap-2.5 mb-6">
                    <span className="w-9 h-9 rounded-lg grid place-items-center bg-secondary/10 text-secondary border border-secondary/20">
                        <UserPlus size={17} />
                    </span>
                    <h1 className="text-2xl font-bold">Create Admin / User Account</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <User size={16} className="text-base-content/40" />
                            <input name="firstName" placeholder="First name" className="grow"
                                value={form.firstName} onChange={handleChange} minLength={3} maxLength={20} required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <input name="lastName" placeholder="Last name" className="grow"
                                value={form.lastName} onChange={handleChange} minLength={3} maxLength={20} required />
                        </label>
                    </div>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <Mail size={16} className="text-base-content/40" />
                        <input type="email" name="email" placeholder="Email" className="grow"
                            value={form.email} onChange={handleChange} required />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <Lock size={16} className="text-base-content/40" />
                        <input type="password" name="password" placeholder="Password" className="grow"
                            value={form.password} onChange={handleChange} minLength={8} required />
                    </label>
                    <p className="text-xs text-base-content/50 -mt-1">
                        Min 8 characters, with uppercase, lowercase, number and symbol.
                    </p>
                    <label className="form-control">
                        <span className="label-text mb-1 text-xs">Role</span>
                        <select name="role" className="select select-bordered w-full" value={form.role} onChange={handleChange}>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </label>
                    <button type="submit" className="btn btn-secondary mt-2" disabled={submitting}>
                        {submitting ? <span className="loading loading-spinner loading-sm"></span> : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateAdmin;
