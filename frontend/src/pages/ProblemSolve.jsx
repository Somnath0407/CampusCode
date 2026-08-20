import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { Play, Send, CheckCircle2, XCircle } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/Navbar";
import DifficultyBadge from "../components/DifficultyBadge";
import { useTheme } from "../context/ThemeContext";

const LANGUAGE_META = {
    "c++": { label: "C++", monaco: "cpp" },
    "cpp": { label: "C++", monaco: "cpp" },
    "java": { label: "Java", monaco: "java" },
    "javascript": { label: "JavaScript", monaco: "javascript" },
};

const ProblemSolve = () => {
    const { id } = useParams();
    const { isDark } = useTheme();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("javascript");
    const [codeByLanguage, setCodeByLanguage] = useState({});
    const [activeTab, setActiveTab] = useState("description");
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const { data } = await axiosClient.get(`/problem/problemById/${id}`);
                setProblem(data);
                const initialCode = {};
                (data.startCode || []).forEach((sc) => {
                    initialCode[sc.language.toLowerCase()] = sc.initialCode;
                });
                setCodeByLanguage(initialCode);
                const firstLang = data.startCode?.[0]?.language?.toLowerCase();
                if (firstLang) setLanguage(firstLang);
            } catch (err) {
                toast.error("Failed to load problem");
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    const availableLanguages = useMemo(
        () => (problem?.startCode || []).map((sc) => sc.language.toLowerCase()),
        [problem]
    );

    const currentCode = codeByLanguage[language] ?? "";

    const handleEditorChange = (value) => {
        setCodeByLanguage((prev) => ({ ...prev, [language]: value ?? "" }));
    };

    const handleRun = async () => {
        setRunning(true);
        setRunResult(null);
        try {
            const { data } = await axiosClient.post(`/submission/run/${id}`, {
                code: currentCode,
                language,
            });
            setRunResult(data);
            setActiveTab("result");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Run failed");
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitResult(null);
        try {
            const { data } = await axiosClient.post(`/submission/submit/${id}`, {
                code: currentCode,
                language,
            });
            setSubmitResult(data);
            setActiveTab("result");
            if (data.status === "accepted") {
                toast.success("Accepted!");
            } else {
                toast.error(`Status: ${data.status}`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const loadSubmissions = async () => {
        try {
            const { data } = await axiosClient.get(`/submission/${id}`);
            setSubmissions(data);
        } catch (err) {
            toast.error("Failed to load submissions");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100">
                <Navbar />
                <div className="flex justify-center py-24">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen bg-base-100">
                <Navbar />
                <p className="text-center py-24 text-base-content/60">Problem not found</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-base-100">
            <Navbar />
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left: description / result / submissions */}
                <div className="lg:w-1/2 w-full flex flex-col border-r border-base-300 overflow-hidden">
                    <div className="tabs tabs-lift px-2 pt-2 bg-base-200 shrink-0">
                        <a
                            className={`tab ${activeTab === "description" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("description")}
                        >
                            Description
                        </a>
                        <a
                            className={`tab ${activeTab === "result" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("result")}
                        >
                            Result
                        </a>
                        <a
                            className={`tab ${activeTab === "submissions" ? "tab-active" : ""}`}
                            onClick={() => { setActiveTab("submissions"); loadSubmissions(); }}
                        >
                            Submissions
                        </a>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        {activeTab === "description" && (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-xl font-bold">{problem.title}</h1>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <DifficultyBadge difficulty={problem.difficulty} />
                                    <span className="badge badge-ghost badge-sm capitalize">{problem.tags}</span>
                                </div>
                                <p className="whitespace-pre-wrap text-base-content/90 leading-relaxed">
                                    {problem.description}
                                </p>

                                {problem.visibleTestCases?.map((tc, i) => (
                                    <div key={i} className="mt-5">
                                        <p className="font-semibold mb-1">Example {i + 1}:</p>
                                        <div className="bg-base-200 rounded-box p-3 text-sm font-mono border border-base-300">
                                            <p><span className="text-base-content/50">Input:</span> {tc.input}</p>
                                            <p><span className="text-base-content/50">Output:</span> {tc.output}</p>
                                            {tc.explanation && (
                                                <p><span className="text-base-content/50">Explanation:</span> {tc.explanation}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "result" && (
                            <ResultPanel runResult={runResult} submitResult={submitResult} />
                        )}

                        {activeTab === "submissions" && (
                            <SubmissionsList submissions={submissions} />
                        )}
                    </div>
                </div>

                {/* Right: editor */}
                <div className="lg:w-1/2 w-full flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-base-200 border-b border-base-300 shrink-0">
                        <select
                            className="select select-sm select-bordered w-36"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {availableLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {LANGUAGE_META[lang]?.label || lang}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-ghost border border-base-300 gap-1.5" onClick={handleRun} disabled={running}>
                                {running ? <span className="loading loading-spinner loading-xs"></span> : <><Play size={14} /> Run</>}
                            </button>
                            <button className="btn btn-sm btn-primary gap-1.5" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? <span className="loading loading-spinner loading-xs"></span> : <><Send size={14} /> Submit</>}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            theme={isDark ? "vs-dark" : "light"}
                            language={LANGUAGE_META[language]?.monaco || "javascript"}
                            value={currentCode}
                            onChange={handleEditorChange}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResultPanel = ({ runResult, submitResult }) => {
    if (!runResult && !submitResult) {
        return <p className="text-base-content/50">Run or submit your code to see results here.</p>;
    }

    if (submitResult) {
        const isAccepted = submitResult.status === "accepted";
        return (
            <div>
                <h2 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isAccepted ? "text-success" : "text-error"}`}>
                    {isAccepted ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {isAccepted ? "Accepted" : submitResult.status === "error" ? "Runtime Error" : "Wrong Answer"}
                </h2>
                <p className="text-sm text-base-content/70 mb-1">
                    Test cases passed: {submitResult.testCasesPassed} / {submitResult.testCasesTotal}
                </p>
                <p className="text-sm text-base-content/70 mb-1">Runtime: {submitResult.runtime}s</p>
                <p className="text-sm text-base-content/70 mb-3">Memory: {submitResult.memory} KB</p>
                {submitResult.errorMessage && (
                    <pre className="bg-base-200 border border-base-300 rounded-box p-3 text-xs overflow-x-auto whitespace-pre-wrap">
                        {submitResult.errorMessage}
                    </pre>
                )}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-bold mb-3">
                {runResult.testCasesPassed} / {runResult.testCasesTotal} test cases passed
            </h2>
            <div className="flex flex-col gap-3">
                {runResult.results.map((r, i) => (
                    <div key={i} className={`rounded-box border p-3 text-sm ${r.passed ? "border-success/40 bg-success/10" : "border-error/40 bg-error/10"}`}>
                        <p className="font-semibold mb-1">
                            Test case {i + 1}: {r.passed ? <span className="text-success">Passed</span> : <span className="text-error">Failed</span>}
                        </p>
                        <p><span className="text-base-content/50">Input:</span> {r.input}</p>
                        <p><span className="text-base-content/50">Expected:</span> {r.expectedOutput}</p>
                        <p><span className="text-base-content/50">Output:</span> {r.stdout ?? "-"}</p>
                        {(r.stderr || r.compileOutput) && (
                            <pre className="mt-1 text-xs whitespace-pre-wrap text-error">{r.stderr || r.compileOutput}</pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SubmissionsList = ({ submissions }) => {
    if (!submissions || submissions.length === 0) {
        return <p className="text-base-content/50">No submissions yet.</p>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Language</th>
                        <th>Passed</th>
                        <th>Runtime</th>
                        <th>When</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((s) => (
                        <tr key={s._id}>
                            <td className={`capitalize ${s.status === "accepted" ? "text-success" : "text-error"}`}>
                                {s.status}
                            </td>
                            <td className="capitalize">{s.language}</td>
                            <td>{s.testCasesPassed}/{s.testCasesTotal}</td>
                            <td>{s.runtime}s</td>
                            <td>{new Date(s.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProblemSolve;
