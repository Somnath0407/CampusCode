import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, ListChecks, Search, Target } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import DifficultyBadge from "../components/DifficultyBadge";

const DIFFICULTIES = ["all", "easy", "medium", "hard"];

const UserDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solved, setSolved] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [problemsRes, solvedRes] = await Promise.all([
                    axiosClient.get("/problem/getAllProblem"),
                    axiosClient.get("/problem/problemSolvedByUser"),
                ]);
                setProblems(problemsRes.data);
                setSolved(solvedRes.data || []);
            } catch (err) {
                if (err?.response?.status !== 404) {
                    toast.error("Failed to load problems");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const solvedSet = useMemo(() => new Set((solved || []).map(String)), [solved]);

    const filteredProblems = useMemo(() => {
        return problems.filter((p) => {
            const matchesDifficulty = difficultyFilter === "all" || p.difficulty === difficultyFilter;
            const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
            return matchesDifficulty && matchesSearch;
        });
    }, [problems, difficultyFilter, search]);

    const solvedCount = problems.filter((p) => solvedSet.has(String(p._id))).length;
    const easyTotal = problems.filter((p) => p.difficulty === "easy").length;
    const mediumTotal = problems.filter((p) => p.difficulty === "medium").length;
    const hardTotal = problems.filter((p) => p.difficulty === "hard").length;
    const progressPct = problems.length ? Math.round((solvedCount / problems.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
                    <p className="text-base-content/60 mt-1">Keep the streak going — pick a problem below.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="stat-card p-4">
                        <div className="flex items-center gap-2 text-base-content/50 text-xs font-medium uppercase tracking-wide mb-2">
                            <ListChecks size={14} /> Total
                        </div>
                        <p className="text-2xl font-bold">{problems.length}</p>
                    </div>
                    <div className="stat-card p-4">
                        <div className="flex items-center gap-2 text-success text-xs font-medium uppercase tracking-wide mb-2">
                            <CheckCircle2 size={14} /> Solved
                        </div>
                        <p className="text-2xl font-bold text-success">{solvedCount}</p>
                    </div>
                    <div className="stat-card p-4">
                        <div className="flex items-center gap-2 text-primary text-xs font-medium uppercase tracking-wide mb-2">
                            <Target size={14} /> Progress
                        </div>
                        <p className="text-2xl font-bold text-primary">{progressPct}%</p>
                    </div>
                    <div className="stat-card p-4">
                        <div className="text-xs font-medium uppercase tracking-wide mb-2 text-base-content/50">By Difficulty</div>
                        <div className="flex gap-2 text-xs font-semibold">
                            <span className="text-success">{easyTotal}E</span>
                            <span className="text-warning">{mediumTotal}M</span>
                            <span className="text-error">{hardTotal}H</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:w-64">
                        <Search size={15} className="text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            className="grow"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <div className="join">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d}
                                onClick={() => setDifficultyFilter(d)}
                                className={`btn btn-sm join-item capitalize ${difficultyFilter === d ? "btn-primary" : "btn-ghost border border-base-300"}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto rounded-box border border-base-300 shadow-sm">
                    <table className="table">
                        <thead>
                            <tr className="bg-base-200">
                                <th className="w-16">Status</th>
                                <th>Title</th>
                                <th className="w-32">Difficulty</th>
                                <th className="w-40">Tag</th>
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
                            {!loading && filteredProblems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-base-content/50">
                                        No problems found
                                    </td>
                                </tr>
                            )}
                            {!loading && filteredProblems.map((problem) => {
                                const isSolved = solvedSet.has(String(problem._id));
                                return (
                                    <tr key={problem._id} className="hover:bg-base-200 transition-colors">
                                        <td>
                                            {isSolved && (
                                                <CheckCircle2 size={18} className="text-success" strokeWidth={2.5} />
                                            )}
                                        </td>
                                        <td>
                                            <Link to={`/problem/${problem._id}`} className="link link-hover font-medium">
                                                {problem.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <DifficultyBadge difficulty={problem.difficulty} />
                                        </td>
                                        <td>
                                            <span className="badge badge-ghost badge-sm capitalize">{problem.tags}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
