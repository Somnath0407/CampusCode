import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight, ArrowUpRight, Cpu, LineChart, ShieldCheck, Terminal,
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import Logo from "../components/Logo";
import DifficultyBadge from "../components/DifficultyBadge";
import ThemeToggle from "../components/ThemeToggle";
import LogoMarquee from "../components/LogoMarquee";
import TextType from "../components/TextType";

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

const MOTIVATIONAL_QUOTES = [
    "Every bug is one step closer to the solution.",
    "Think. Code. Test. Repeat.",
    "Small progress becomes big results.",
    "One problem solved, one skill stronger.",
    "Code today. Crack the interview tomorrow.",
    "Consistency beats talent when talent stops practicing.",
    "Don't fear errors - debug them.",
    "Every expert programmer started with one problem.",
    "Practice the problem until the pattern becomes clear.",
    "Your next solution could be your breakthrough.",
];

const CODE_LANGUAGES = ["javascript", "java", "cpp"];

// How long the typed-out quote lingers before it deletes and the next one
// starts — also what drives the code boilerplate to cycle languages in step.
const QUOTE_HOLD_MS = 5000;

// Token colors for the hero code preview.
const KEYWORD = "text-accent";
const NAME = "text-warning";
const STRING = "text-success";
const DYNAMIC_QUOTE = { dynamic: true };

// Each line is an array of {t: text, c?: colorClass} tokens (or a single
// {dynamic: true} marker standing in for the live-typed quote) rather than
// raw multi-line JSX text — JSX collapses newlines between sibling elements
// into spaces, so building lines this way (one <div> per line) is what keeps
// the snippet actually multi-line instead of silently flattening into one row.
//
// Every language's template is shaped identically — 5 lines, print statement
// at index 2, dynamic quote at token index 2 within it — so the <TextType>
// element always lands at the same position in the tree across a language
// switch. React then keys onto it as the same component and keeps its typing
// progress intact, instead of unmounting/remounting and restarting the quote.
const buildSnippet = (language) => {
    if (language === "java") {
        return {
            filename: "Motivate.java",
            lines: [
                [{ t: "public ", c: KEYWORD }, { t: "class ", c: KEYWORD }, { t: "Motivate", c: NAME }, { t: " {" }],
                [{ t: "  public static void main(String[] args) {" }],
                [{ t: "    System.out.println(" }, { t: '"', c: STRING }, DYNAMIC_QUOTE, { t: '"', c: STRING }, { t: ");" }],
                [{ t: "  }" }],
                [{ t: "}" }],
            ],
        };
    }
    if (language === "cpp") {
        return {
            filename: "motivate.cpp",
            lines: [
                [{ t: "#include ", c: KEYWORD }, { t: "<iostream>" }],
                [{ t: "int ", c: KEYWORD }, { t: "main() {" }],
                [{ t: "  std::cout << " }, { t: '"', c: STRING }, DYNAMIC_QUOTE, { t: '"', c: STRING }, { t: " << std::endl;" }],
                [{ t: "  return 0;" }],
                [{ t: "}" }],
            ],
        };
    }
    return {
        filename: "motivate.js",
        lines: [
            [{ t: "function ", c: KEYWORD }, { t: "motivate", c: NAME }, { t: "() {" }],
            [{ t: "" }],
            [{ t: "  console.log(" }, { t: '"', c: STRING }, DYNAMIC_QUOTE, { t: '"', c: STRING }, { t: ");" }],
            [{ t: "}" }],
            [{ t: "motivate();" }],
        ],
    };
};

// Small, reusable section header — keeps typographic rhythm consistent without
// every section reading as an identical copy-pasted block.
const SectionIntro = ({ eyebrow, title, subtitle }) => (
    <div className="text-center mb-12">
        {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{eyebrow}</p>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h2>
        {subtitle && <p className="text-base-content/60 max-w-md mx-auto">{subtitle}</p>}
    </div>
);

const Landing = () => {
    const [stats, setStats] = useState(null);
    const [languageIndex, setLanguageIndex] = useState(0);

    useEffect(() => {
        axiosClient.get("/problem/stats")
            .then(({ data }) => setStats(data))
            .catch(() => setStats(null));
    }, []);

    // TextType types each quote out, holds it for QUOTE_HOLD_MS, then deletes
    // and moves on — this fires right as it's about to type the next quote,
    // so the surrounding code boilerplate (language) switches in step.
    const handleQuoteComplete = (_sentence, index) => {
        setLanguageIndex((index + 1) % CODE_LANGUAGES.length);
    };

    const currentLanguage = CODE_LANGUAGES[languageIndex];
    const snippet = buildSnippet(currentLanguage);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Top bar */}
            <div className="navbar sticky top-0 z-30 bg-base-100/85 backdrop-blur-md border-b border-base-300 px-4 sm:px-6 lg:px-8">
                <div className="flex-1">
                    <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
                        <Logo size={30} className="rounded-lg shadow-sm shadow-primary/20" />
                        <span className="brand-gradient">CampusCode</span>
                    </Link>
                </div>
                <div className="flex-none flex items-center gap-1 sm:gap-2">
                    <ThemeToggle />
                    <Link to="/login" className="btn btn-ghost btn-sm font-medium">Log in</Link>
                    <Link
                        to="/signup"
                        className="btn btn-primary btn-sm gap-1.5 font-medium shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/30"
                    >
                        Sign up <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[32rem] bg-grid-faint pointer-events-none" />
                <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full bg-primary/[0.06] blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-20 relative grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-[2.5rem] sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6 text-balance">
                            Sharpen your code.<br />
                            <span className="brand-gradient">Ace the interview.</span>
                        </h1>
                        <p className="text-base-content/60 text-lg mb-9 max-w-md mx-auto lg:mx-0 leading-relaxed">
                            Solve hand-picked data structure and algorithm problems, get instantly judged
                            against real test cases, and track every step of your progress.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
                            <Link
                                to="/signup"
                                className="btn btn-primary gap-1.5 shadow-sm shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                            >
                                Start solving for free <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/login"
                                className="btn btn-ghost border border-base-300 transition-colors hover:bg-base-200"
                            >
                                I have an account
                            </Link>
                        </div>

                        {stats && (
                            <div className="flex flex-wrap gap-x-7 gap-y-4 mt-12 justify-center lg:justify-start">
                                <div className="border-l border-base-300 pl-4 first:border-l-0 first:pl-0">
                                    <p className="text-2xl font-extrabold font-display">{stats.total}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mt-0.5">Problems</p>
                                </div>
                                <div className="border-l border-base-300 pl-4">
                                    <p className="text-2xl font-extrabold font-display text-success">{stats.easy}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mt-0.5">Easy</p>
                                </div>
                                <div className="border-l border-base-300 pl-4">
                                    <p className="text-2xl font-extrabold font-display text-warning">{stats.medium}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mt-0.5">Medium</p>
                                </div>
                                <div className="border-l border-base-300 pl-4">
                                    <p className="text-2xl font-extrabold font-display text-error">{stats.hard}</p>
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide mt-0.5">Hard</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decorative code panel — types out a motivational quote inside a
                        print statement that cycles through JS / Java / C++, holding each
                        quote for QUOTE_HOLD_MS before deleting and typing the next. */}
                    <div className="hidden lg:block">
                        <div className="rounded-2xl border border-base-300 bg-base-200 shadow-xl shadow-black/10 ring-1 ring-black/5 overflow-hidden">
                            <div className="flex items-center gap-1.5 px-4 py-3 bg-base-300/40 border-b border-base-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
                                <span className="ml-3 text-xs text-base-content/40 font-mono">{snippet.filename}</span>
                            </div>
                            <div className="p-6 text-sm font-mono leading-[1.7] min-h-52.5">
                                {snippet.lines.map((tokens, i) => (
                                    <div key={i} className="whitespace-pre-wrap wrap-break-word">
                                        {tokens.every((tok) => tok.t === "")
                                            ? " "
                                            : tokens.map((tok, j) => (
                                                tok.dynamic ? (
                                                    <TextType
                                                        key={j}
                                                        as="span"
                                                        text={MOTIVATIONAL_QUOTES}
                                                        typingSpeed={45}
                                                        deletingSpeed={25}
                                                        pauseDuration={QUOTE_HOLD_MS}
                                                        loop
                                                        showCursor={false}
                                                        className={STRING}
                                                        onSentenceComplete={handleQuoteComplete}
                                                    />
                                                ) : tok.c ? (
                                                    <span key={j} className={tok.c}>{tok.t}</span>
                                                ) : (
                                                    <span key={j}>{tok.t}</span>
                                                )
                                            ))}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3.5 border-t border-base-300 bg-success/10">
                                <Terminal size={16} className="text-success shrink-0" />
                                <TextType
                                    as="span"
                                    text={MOTIVATIONAL_QUOTES}
                                    typingSpeed={45}
                                    deletingSpeed={25}
                                    pauseDuration={QUOTE_HOLD_MS}
                                    loop
                                    showCursor={false}
                                    className="text-xs font-medium text-success"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LogoMarquee />

            {/* Features */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                <SectionIntro
                    eyebrow="Why CampusCode"
                    title="Everything you need to practice well"
                    subtitle="No fluff — just problems, a judge, and your progress."
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                        <div
                            key={title}
                            className="stat-card p-6 hover:shadow-md hover:shadow-black/5"
                        >
                            <span className={`w-11 h-11 rounded-xl grid place-items-center mb-5 border ${FEATURE_COLORS[color]}`}>
                                <Icon size={19} strokeWidth={2} />
                            </span>
                            <h3 className="font-semibold mb-2">{title}</h3>
                            <p className="text-sm text-base-content/60 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Problem preview */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
                <SectionIntro
                    eyebrow="Problem set"
                    title="A taste of the problem set"
                    subtitle="Every difficulty, every topic — sign up to see the full list."
                />
                <div className="overflow-hidden rounded-2xl border border-base-300 shadow-sm">
                    <table className="table">
                        <thead>
                            <tr className="bg-base-200 border-b border-base-300">
                                <th className="text-xs uppercase tracking-wide font-semibold text-base-content/60">Title</th>
                                <th className="w-32 text-xs uppercase tracking-wide font-semibold text-base-content/60">Difficulty</th>
                                <th className="w-40 text-xs uppercase tracking-wide font-semibold text-base-content/60">Tag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PREVIEW_PROBLEMS.map((p) => (
                                <tr key={p.title} className="hover:bg-base-200/60 transition-colors">
                                    <td className="font-medium">{p.title}</td>
                                    <td><DifficultyBadge difficulty={p.difficulty} /></td>
                                    <td><span className="badge badge-ghost badge-sm capitalize">{p.tag}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-center mt-6">
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-1.5 text-sm font-medium link link-primary link-hover"
                    >
                        + {stats ? Math.max(stats.total - PREVIEW_PROBLEMS.length, 0) : "many"} more problems waiting
                        <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
                <div className="rounded-2xl border border-base-300 bg-base-200/60 px-6 py-14 sm:py-16 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to level up?</h2>
                    <p className="text-base-content/60 mb-8 max-w-sm mx-auto">
                        Create a free account and start solving in under a minute.
                    </p>
                    <Link
                        to="/signup"
                        className="btn btn-primary gap-1.5 shadow-sm shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                    >
                        Get started <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <footer className="border-t border-base-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/50">
                    <span className="flex items-center gap-2 font-medium text-base-content/70">
                        <Logo size={18} className="rounded" /> CampusCode
                    </span>
                    <span>© {new Date().getFullYear()} CampusCode. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
