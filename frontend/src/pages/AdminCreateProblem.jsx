import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, FilePlus2 } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import ProblemForm from "../components/ProblemForm";

const AdminCreateProblem = () => {
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (form) => {
        setSubmitting(true);
        try {
            await axiosClient.post("/problem/create", form);
            toast.success("Problem created");
            navigate("/admin");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create problem");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <Link to="/admin" className="text-sm text-base-content/50 hover:text-base-content flex items-center gap-1 mb-3 w-fit">
                    <ArrowLeft size={14} /> Back to dashboard
                </Link>
                <div className="flex items-center gap-2.5 mb-6">
                    <span className="w-9 h-9 rounded-lg grid place-items-center bg-primary/10 text-primary border border-primary/20">
                        <FilePlus2 size={17} />
                    </span>
                    <h1 className="text-2xl font-bold">Create Problem</h1>
                </div>
                <ProblemForm onSubmit={handleCreate} submitLabel="Create Problem" submitting={submitting} />
            </div>
        </div>
    );
};

export default AdminCreateProblem;
