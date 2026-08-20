const styles = {
    easy: "badge-success",
    medium: "badge-warning",
    hard: "badge-error",
};

const DOT = {
    easy: "bg-success",
    medium: "bg-warning",
    hard: "bg-error",
};

const DifficultyBadge = ({ difficulty }) => {
    const key = difficulty?.toLowerCase();
    const cls = styles[key] || "badge-neutral";
    return (
        <span className={`badge ${cls} badge-outline badge-sm font-semibold capitalize gap-1.5`}>
            <span className={`w-1.5 h-1.5 rounded-full ${DOT[key] || "bg-base-content/40"}`} />
            {difficulty}
        </span>
    );
};

export default DifficultyBadge;
