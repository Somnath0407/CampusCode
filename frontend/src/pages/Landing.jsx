import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight, CheckCircle2, Cpu, LineChart, ShieldCheck, Terminal,
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import Logo from "../components/Logo";
import DifficultyBadge from "../components/DifficultyBadge";
import ThemeToggle from "../components/ThemeToggle";
import LogoMarquee from "../components/LogoMarquee";

const FEATURE_COLORS = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    warning: "bg-warning/10 text-warning border-warning/20",
};

const FEATURES = [
    {
        icon: Cpu,
        color: "primary",
        title: "Real code execution",
        desc: "Every run and submission is judged live via Judge0 — real compilers, real verdicts, not a guess.",
    },
    {
        icon: LineChart,
        color: "success",
        title: "Track your progress",
        desc: "Solved problems, submission history, and a live progress bar across Easy, Medium, and Hard.",
    },
    {
        icon: ShieldCheck,
        color: "accent",
        title: "Curated by admins",
        desc: "Every problem's reference solution is verified against its own test cases before it goes live.",
    },
    {
        icon: Terminal,
        color: "warning",
        title: "Multi-language editor",
        desc: "Write and run solutions in C++, Java, or JavaScript with a full Monaco-powered editor.",
    },
];

const PREVIEW_PROBLEMS = [
    { title: "Two Sum", difficulty: "easy", tag: "arrays" },
    { title: "Binary Tree Level Order", difficulty: "medium", tag: "trees" },
    { title: "Longest Increasing Path", difficulty: "hard", tag: "graphs" },
];

const Landing = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axiosClient.get("/problem/stats")
            .then(({ data }) => setStats(data))
            .catch(() => setStats(null));
    }, []);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Top bar */}
            <div className="navbar px-4 lg:px-8 border-b border-base-300">
                <div className="flex-1">
                    <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
                        <Logo size={32} className="rounded-lg" />
                        <span className="brand-gradient">CampusCode</span>
                    </Link>
                </div>
                <div className="flex-none flex items-center gap-2">
                    <ThemeToggle />
                    <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                    <Link to="/signup" className="btn btn-primary btn-sm gap-1.5">
                        Sign up <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-40 -left-32 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
                <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-16 pb-20 relative grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-5">
                            Sharpen your code.<br />
                            <span className="brand-gradient">Ace the interview.</span>
                        </h1>
                        <p className="text-base-content/60 text-lg mb-8 max-w-lg">
                            Solve hand-picked data structure and algorithm problems, get instantly judged
                            against real test cases, and track every step of your progress.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/signup" className="btn btn-primary gap-1.5">
                                Start solving for free <ArrowRight size={16} />
                            </Link>
                            <Link to="/login" className="btn btn-ghost border border-base-300">
                                I have an account
                            </Link>
                        </div>

                        {stats && (
                            <div className="flex flex-wrap gap-6 mt-10">
                                <div>
                                    <p className="text-2xl font-extrabold">{stats.total}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide">Problems</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold text-success">{stats.easy}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide">Easy</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold text-warning">{stats.medium}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide">Medium</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold text-error">{stats.hard}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide">Hard</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decorative code panel */}
                    <div className="hidden lg:block">
                        <div className="rounded-box border border-base-300 bg-base-200 shadow-2xl overflow-hidden">
                            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-base-300/50 border-b border-base-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
                                <span className="ml-3 text-xs text-base-content/40 font-mono">two-sum.js</span>
                            </div>
                            <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto"><code>
<span className="text-accent">function</span> <span className="text-warning">twoSum</span>(nums, target) {"{"}
  <span className="text-accent">const</span> seen = <span className="text-accent">new</span> Map();
  <span className="text-accent">for</span> (<span className="text-accent">let</span> i = 0; i {"<"} nums.length; i++) {"{"}
    <span className="text-accent">const</span> need = target - nums[i];
    <span className="text-accent">if</span> (seen.has(need)) {"{"}
      <span className="text-accent">return</span> [seen.get(need), i];
    {"}"}
    seen.set(nums[i], i);
  {"}"}
{"}"}
                            </code></pre>
                            <div className="flex items-center gap-2 px-5 py-3 border-t border-base-300 bg-success/10">
                                <CheckCircle2 size={16} className="text-success" />
                                <span className="text-xs font-medium text-success">Accepted — 4 / 4 test cases passed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LogoMarquee />

            {/* Features */}
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
                <h2 className="text-2xl font-bold text-center mb-2">Everything you need to practice well</h2>
                <p className="text-base-content/60 text-center mb-10">No fluff — just problems, a judge, and your progress.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                        <div key={title} className="stat-card p-5">
                            <span className={`w-10 h-10 rounded-lg grid place-items-center mb-4 border ${FEATURE_COLORS[color]}`}>
                                <Icon size={18} />
                            </span>
                            <h3 className="font-semibold mb-1.5">{title}</h3>
                            <p className="text-sm text-base-content/60 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Problem preview */}
            <div className="max-w-4xl mx-auto px-4 lg:px-8 pb-16">
                <h2 className="text-2xl font-bold text-center mb-2">A taste of the problem set</h2>
                <p className="text-base-content/60 text-center mb-8">Every difficulty, every topic — sign up to see the full list.</p>
                <div className="overflow-hidden rounded-box border border-base-300 shadow-sm">
                    <table className="table">
                        <thead>
                            <tr className="bg-base-200">
                                <th>Title</th>
                                <th className="w-32">Difficulty</th>
                                <th className="w-40">Tag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PREVIEW_PROBLEMS.map((p) => (
                                <tr key={p.title}>
                                    <td className="font-medium">{p.title}</td>
                                    <td><DifficultyBadge difficulty={p.difficulty} /></td>
                                    <td><span className="badge badge-ghost badge-sm capitalize">{p.tag}</span></td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={3} className="text-center py-4">
                                    <Link to="/signup" className="link link-primary text-sm font-medium">
                                        + {stats ? Math.max(stats.total - PREVIEW_PROBLEMS.length, 0) : "many"} more problems waiting
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Final CTA */}
            <div className="border-t border-base-300 bg-base-200/50">
                <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-3">Ready to level up?</h2>
                    <p className="text-base-content/60 mb-8">Create a free account and start solving in under a minute.</p>
                    <Link to="/signup" className="btn btn-primary gap-1.5">
                        Get started <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <footer className="px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-base-content/40">
                <span className="flex items-center gap-1.5">
                    <Logo size={18} className="rounded" /> CampusCode
                </span>
                <span>© {new Date().getFullYear()} CampusCode. Built for practice, not production.</span>
            </footer>
        </div>
    );
};

export default Landing;
