import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, PencilLine } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import ProblemForm from "../components/ProblemForm";

const AdminUpdateProblem = () => {
    const { id } = useParams();
    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const { data } = await axiosClient.get(`/problem/admin/${id}`);
                setInitialValues(data);
            } catch (err) {
                toast.error("Failed to load problem");
                navigate("/admin");
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id, navigate]);

    const handleUpdate = async (form) => {
        setSubmitting(true);
        try {
            await axiosClient.put(`/problem/update/${id}`, form);
            toast.success("Problem updated");
            navigate("/admin");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update problem");
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
                    <span className="w-9 h-9 rounded-lg grid place-items-center bg-info/10 text-info border border-info/20">
                        <PencilLine size={17} />
                    </span>
                    <h1 className="text-2xl font-bold">Update Problem</h1>
                </div>
                {loading && (
                    <div className="flex justify-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}
                {!loading && initialValues && (
                    <ProblemForm
                        initialValues={initialValues}
                        onSubmit={handleUpdate}
                        submitLabel="Save Changes"
                        submitting={submitting}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminUpdateProblem;
