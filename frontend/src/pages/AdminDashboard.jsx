import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Boxes, CircleCheck, CircleAlert, Flame, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import DifficultyBadge from "../components/DifficultyBadge";

const STAT_STYLES = {
    total: "from-primary/20 to-primary/5 text-primary border-primary/30",
    easy: "from-success/20 to-success/5 text-success border-success/30",
    medium: "from-warning/20 to-warning/5 text-warning border-warning/30",
    hard: "from-error/20 to-error/5 text-error border-error/30",
};

const ROW_ACCENT = {
    easy: "border-l-success",
    medium: "border-l-warning",
    hard: "border-l-error",
};

const AdminDashboard = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const loadProblems = async () => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get("/problem/getAllProblem");
            setProblems(data);
        } catch (err) {
            if (err?.response?.status !== 404) {
                toast.error("Failed to load problems");
            } else {
                setProblems([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProblems();
    }, []);

    const stats = useMemo(() => ({
        total: problems.length,
        easy: problems.filter((p) => p.difficulty === "easy").length,
        medium: problems.filter((p) => p.difficulty === "medium").length,
        hard: problems.filter((p) => p.difficulty === "hard").length,
    }), [problems]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this problem? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            await axiosClient.delete(`/problem/delete/${id}`);
            toast.success("Problem deleted");
            setProblems((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-base-content/60 mt-1">Manage problems and accounts</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/admin/create" className="btn btn-primary btn-sm gap-1.5">
                            <Plus size={15} /> New Problem
                        </Link>
                        <Link to="/admin/create-admin" className="btn btn-ghost btn-sm border border-base-300 gap-1.5">
                            <UserPlus size={15} /> New Admin
                        </Link>
                    </div>
                </div>

                {/* Colorful stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className={`stat-card p-4 bg-linear-to-br border ${STAT_STYLES.total}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Total</span>
                            <Boxes size={16} />
                        </div>
                        <p className="text-3xl font-extrabold">{stats.total}</p>
                    </div>
                    <div className={`stat-card p-4 bg-linear-to-br border ${STAT_STYLES.easy}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Easy</span>
                            <CircleCheck size={16} />
                        </div>
                        <p className="text-3xl font-extrabold">{stats.easy}</p>
                    </div>
                    <div className={`stat-card p-4 bg-linear-to-br border ${STAT_STYLES.medium}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Medium</span>
                            <CircleAlert size={16} />
                        </div>
                        <p className="text-3xl font-extrabold">{stats.medium}</p>
                    </div>
                    <div className={`stat-card p-4 bg-linear-to-br border ${STAT_STYLES.hard}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Hard</span>
                            <Flame size={16} />
                        </div>
                        <p className="text-3xl font-extrabold">{stats.hard}</p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-box border border-base-300 shadow-sm">
                    <table className="table">
                        <thead>
                            <tr className="bg-base-200">
                                <th>Title</th>
                                <th className="w-32">Difficulty</th>
                                <th className="w-40">Tag</th>
                                <th className="w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            )}
                            {!loading && problems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-base-content/50">
                                        No problems yet. Create one to get started.
                                    </td>
                                </tr>
                            )}
                            {!loading && problems.map((problem) => (
                                <tr
                                    key={problem._id}
                                    className={`hover:bg-base-200 transition-colors border-l-4 ${ROW_ACCENT[problem.difficulty] || "border-l-transparent"}`}
                                >
                                    <td className="font-medium">{problem.title}</td>
                                    <td><DifficultyBadge difficulty={problem.difficulty} /></td>
                                    <td><span className="badge badge-ghost badge-sm capitalize">{problem.tags}</span></td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-xs btn-info btn-outline gap-1"
                                                onClick={() => navigate(`/admin/update/${problem._id}`)}
                                            >
                                                <Pencil size={12} /> Edit
                                            </button>
                                            <button
                                                className="btn btn-xs btn-error btn-outline gap-1"
                                                onClick={() => handleDelete(problem._id)}
                                                disabled={deletingId === problem._id}
                                            >
                                                {deletingId === problem._id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <><Trash2 size={12} /> Delete</>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
