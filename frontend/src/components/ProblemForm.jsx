import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, FileText, Plus, ShieldCheck, Code2, X } from "lucide-react";

const LANGUAGES = ["c++", "java", "javascript"];
const TAGS = ["arrays", "strings", "linked-lists", "trees", "graphs", "dynamic-programming", "greedy", "backtracking"];

const emptyVisibleCase = { input: "", output: "", explanation: "" };
const emptyHiddenCase = { input: "", output: "" };

const buildEmptyForm = () => ({
    title: "",
    description: "",
    difficulty: "easy",
    tags: TAGS[0],
    visibleTestCases: [{ ...emptyVisibleCase }],
    hiddenTestCases: [{ ...emptyHiddenCase }],
    startCode: LANGUAGES.map((language) => ({ language, initialCode: "" })),
    referenceSolution: LANGUAGES.map((language) => ({ language, completeCode: "" })),
});

const SECTION_COLORS = {
    primary: "text-primary bg-primary/10 border-primary/20",
    success: "text-success bg-success/10 border-success/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    secondary: "text-secondary bg-secondary/10 border-secondary/20",
    warning: "text-warning bg-warning/10 border-warning/20",
};

const Section = ({ icon: Icon, color, title, subtitle, action, children }) => (
    <div className="rounded-box border border-base-300 bg-base-200/50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
            <div className="flex items-center gap-2.5">
                <span className={`w-8 h-8 rounded-lg grid place-items-center border ${SECTION_COLORS[color]}`}>
                    <Icon size={15} />
                </span>
                <div>
                    <h3 className="font-semibold text-sm leading-tight">{title}</h3>
                    {subtitle && <p className="text-xs text-base-content/50">{subtitle}</p>}
                </div>
            </div>
            {action}
        </div>
        <div className="p-4">{children}</div>
    </div>
);

// Tabbed per-language code editor — used for both Starter Code and Reference Solution
// so three full-height textareas aren't stacked on top of each other.
const LanguageCodeTabs = ({ entries, codeKey, onChange, minHeight = "min-h-56" }) => {
    const [active, setActive] = useState(0);

    return (
        <div>
            <div role="tablist" className="tabs tabs-box tabs-sm w-fit mb-2 bg-base-100">
                {entries.map((entry, i) => (
                    <a
                        key={entry.language}
                        role="tab"
                        className={`tab capitalize ${active === i ? "tab-active" : ""}`}
                        onClick={() => setActive(i)}
                    >
                        {entry.language}
                    </a>
                ))}
            </div>
            <textarea
                className={`textarea textarea-bordered w-full font-mono text-sm ${minHeight}`}
                value={entries[active][codeKey]}
                onChange={(e) => onChange(active, codeKey, e.target.value)}
                spellCheck={false}
                required
            />
        </div>
    );
};

const ProblemForm = ({ initialValues, onSubmit, submitLabel, submitting }) => {
    const [form, setForm] = useState(() => ({ ...buildEmptyForm(), ...initialValues }));

    const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const updateArrayItem = (field, index, key, value) => {
        setForm((prev) => {
            const next = [...prev[field]];
            next[index] = { ...next[index], [key]: value };
            return { ...prev, [field]: next };
        });
    };

    const addArrayItem = (field, empty) => {
        setForm((prev) => ({ ...prev, [field]: [...prev[field], { ...empty }] }));
    };

    const removeArrayItem = (field, index) => {
        setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Section icon={FileText} color="primary" title="Basic Info">
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className="form-control md:col-span-2">
                            <span className="label-text mb-1 text-xs">Title</span>
                            <input
                                type="text"
                                className="input input-bordered input-sm w-full"
                                value={form.title}
                                onChange={(e) => updateField("title", e.target.value)}
                                required
                            />
                        </label>
                        <label className="form-control">
                            <span className="label-text mb-1 text-xs">Difficulty</span>
                            <select
                                className="select select-bordered select-sm w-full capitalize"
                                value={form.difficulty}
                                onChange={(e) => updateField("difficulty", e.target.value)}
                            >
                                {["easy", "medium", "hard"].map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </label>
                    </div>
                    <label className="form-control">
                        <span className="label-text mb-1 text-xs">Tag</span>
                        <select
                            className="select select-bordered select-sm w-full max-w-xs capitalize"
                            value={form.tags}
                            onChange={(e) => updateField("tags", e.target.value)}
                        >
                            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </label>
                    <label className="form-control">
                        <span className="label-text mb-1 text-xs">Description</span>
                        <textarea
                            className="textarea textarea-bordered w-full min-h-28 text-sm"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            required
                        />
                    </label>
                </div>
            </Section>

            <Section
                icon={Eye}
                color="success"
                title="Visible Test Cases"
                subtitle="Shown to users on the problem page"
                action={
                    <button type="button" className="btn btn-xs btn-success btn-outline gap-1"
                        onClick={() => addArrayItem("visibleTestCases", emptyVisibleCase)}>
                        <Plus size={12} /> Add
                    </button>
                }
            >
                <div className="flex flex-col gap-3">
                    {form.visibleTestCases.map((tc, i) => (
                        <div key={i} className="border border-base-300 rounded-box p-3 bg-base-100 relative">
                            <div className="flex justify-between mb-2">
                                <span className="badge badge-success badge-outline badge-xs font-semibold">Case {i + 1}</span>
                                {form.visibleTestCases.length > 1 && (
                                    <button type="button" className="text-base-content/40 hover:text-error transition-colors"
                                        onClick={() => removeArrayItem("visibleTestCases", i)} title="Remove case">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input className="input input-bordered input-sm" placeholder="Input"
                                    value={tc.input} onChange={(e) => updateArrayItem("visibleTestCases", i, "input", e.target.value)} required />
                                <input className="input input-bordered input-sm" placeholder="Output"
                                    value={tc.output} onChange={(e) => updateArrayItem("visibleTestCases", i, "output", e.target.value)} required />
                                <input className="input input-bordered input-sm" placeholder="Explanation"
                                    value={tc.explanation} onChange={(e) => updateArrayItem("visibleTestCases", i, "explanation", e.target.value)} required />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                icon={EyeOff}
                color="accent"
                title="Hidden Test Cases"
                subtitle="Used for grading only, never shown to users"
                action={
                    <button type="button" className="btn btn-xs btn-accent btn-outline gap-1"
                        onClick={() => addArrayItem("hiddenTestCases", emptyHiddenCase)}>
                        <Plus size={12} /> Add
                    </button>
                }
            >
                <div className="flex flex-col gap-3">
                    {form.hiddenTestCases.map((tc, i) => (
                        <div key={i} className="border border-base-300 rounded-box p-3 bg-base-100">
                            <div className="flex justify-between mb-2">
                                <span className="badge badge-accent badge-outline badge-xs font-semibold">Case {i + 1}</span>
                                {form.hiddenTestCases.length > 1 && (
                                    <button type="button" className="text-base-content/40 hover:text-error transition-colors"
                                        onClick={() => removeArrayItem("hiddenTestCases", i)} title="Remove case">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <input className="input input-bordered input-sm" placeholder="Input"
                                    value={tc.input} onChange={(e) => updateArrayItem("hiddenTestCases", i, "input", e.target.value)} required />
                                <input className="input input-bordered input-sm" placeholder="Output"
                                    value={tc.output} onChange={(e) => updateArrayItem("hiddenTestCases", i, "output", e.target.value)} required />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section icon={Code2} color="secondary" title="Starter Code" subtitle="Pre-filled in the editor for each language">
                <LanguageCodeTabs
                    entries={form.startCode}
                    codeKey="initialCode"
                    minHeight="min-h-40"
                    onChange={(i, key, value) => updateArrayItem("startCode", i, key, value)}
                />
            </Section>

            <Section
                icon={ShieldCheck}
                color="warning"
                title="Reference Solution"
                subtitle="Must pass all visible test cases via Judge0 before saving"
            >
                <LanguageCodeTabs
                    entries={form.referenceSolution}
                    codeKey="completeCode"
                    minHeight="min-h-56"
                    onChange={(i, key, value) => updateArrayItem("referenceSolution", i, key, value)}
                />
            </Section>

            <div className="flex items-center gap-3 pt-1">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <span className="loading loading-spinner loading-sm"></span> : submitLabel}
                </button>
                <Link to="/admin" className="btn btn-ghost border border-base-300">Cancel</Link>
            </div>
        </form>
    );
};

export default ProblemForm;
