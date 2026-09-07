import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../api/axiosClient";

const WEEKDAY_LABELS = { 1: "Mon", 3: "Wed", 5: "Fri" };
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEVEL_CLASSES = [
    "bg-base-300/60",
    "bg-success/30",
    "bg-success/55",
    "bg-success/80",
    "bg-success",
];

const levelFor = (count) => {
    if (!count) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
};

// Builds a Jan 1 - Dec 31 grid of UTC calendar days for the given year,
// grouped into 7-day (Sun-Sat) columns, matching how the backend buckets
// submissions by UTC date — keeping the grid and backend counts in sync.
// Days from the neighboring year that fill out the first/last week are
// rendered as blank padding cells (null) so the grid stays rectangular.
const buildWeeks = (year, countByDate) => {
    const start = new Date(Date.UTC(year, 0, 1));
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const end = new Date(Date.UTC(year, 11, 31));

    const weeks = [];
    let week = [];
    const cursor = new Date(start);

    while (cursor <= end) {
        const inYear = cursor.getUTCFullYear() === year;
        const key = cursor.toISOString().slice(0, 10);
        week.push(inYear ? {
            date: key,
            count: countByDate.get(key) || 0,
            isMonthStart: cursor.getUTCDate() <= 7,
            month: cursor.getUTCMonth(),
        } : null);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    if (week.length) {
        while (week.length < 7) week.push(null);
        weeks.push(week);
    }
    return weeks;
};

// One label per week column — only the column where a new month begins,
// so it prints once instead of on every week it spans.
const buildMonthLabels = (weeks) => {
    const labels = [];
    let prevMonth = -1;
    for (const week of weeks) {
        const first = week[0];
        if (first && first.isMonthStart && first.month !== prevMonth) {
            labels.push(MONTH_NAMES[first.month]);
            prevMonth = first.month;
        } else {
            labels.push("");
        }
    }
    return labels;
};

const currentYear = new Date().getUTCFullYear();

// "date" is a plain YYYY-MM-DD (UTC) key, parsed as UTC so the printed
// weekday/day doesn't shift a day off depending on the viewer's timezone.
const formatDate = (dateStr) =>
    new Date(`${dateStr}T00:00:00Z`).toLocaleDateString(undefined, {
        weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    });

const ActivityHeatmap = () => {
    const { user } = useSelector((state) => state.auth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedDay, setSelectedDay] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        axiosClient.get(`/submission/activity?year=${selectedYear}`)
            .then(({ data }) => setData(data))
            .catch(() => setData({ year: selectedYear, total: 0, days: [] }));
    }, [selectedYear]);

    // Derived rather than tracked in its own state — flips back to true the
    // instant selectedYear changes, so a stale year's grid never flashes
    // while the new one is still in flight.
    const loading = !data || data.year !== selectedYear;

    const accountYear = user?.createdAt ? new Date(user.createdAt).getUTCFullYear() : currentYear;
    const years = [];
    for (let y = currentYear; y >= accountYear; y--) years.push(y);

    const countByDate = new Map((data?.days || []).map((d) => [d.date, d.count]));
    const weeks = buildWeeks(selectedYear, countByDate);
    const monthLabels = buildMonthLabels(weeks);
    const total = data?.total ?? 0;

    return (
        <div className="flex items-stretch gap-4 mb-8">
            <div className="stat-card p-5 flex-1 overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-36">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-3 mb-4 min-h-5">
                            <p className="text-sm font-semibold">
                                {total} submission{total === 1 ? "" : "s"} in {selectedYear}
                            </p>
                            {selectedDay && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedDay(null)}
                                    className="text-xs text-base-content/60 hover:text-base-content flex items-center gap-1.5"
                                >
                                    <span className="font-medium">
                                        {selectedDay.count} submission{selectedDay.count === 1 ? "" : "s"} on {formatDate(selectedDay.date)}
                                    </span>
                                    <span aria-hidden="true">✕</span>
                                </button>
                            )}
                        </div>

                        <div className="flex gap-0.75 w-max">
                            <div className="flex flex-col gap-0.75 mr-1 shrink-0">
                                <div className="h-3.25" />
                                {Array.from({ length: 7 }).map((_, row) => (
                                    <div key={row} className="h-3.25 text-[10px] leading-3.25 text-base-content/50 pr-1">
                                        {WEEKDAY_LABELS[row] || ""}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-0.75">
                                <div className="flex gap-0.75">
                                    {weeks.map((_, wi) => (
                                        <div key={wi} className="w-3.25 text-[10px] text-base-content/50 whitespace-nowrap">
                                            {monthLabels[wi]}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-0.75">
                                    {weeks.map((week, wi) => (
                                        <div key={wi} className="flex flex-col gap-0.75">
                                            {week.map((day, di) => (
                                                day ? (
                                                    <button
                                                        key={di}
                                                        type="button"
                                                        title={`${day.count} submission${day.count === 1 ? "" : "s"} on ${day.date}`}
                                                        onClick={() => setSelectedDay((prev) => (prev?.date === day.date ? null : day))}
                                                        className={`w-3.25 h-3.25 rounded-[3px] p-0 border-0 cursor-pointer ${LEVEL_CLASSES[levelFor(day.count)]} ${
                                                            selectedDay?.date === day.date ? "ring-2 ring-primary ring-offset-1 ring-offset-base-200" : ""
                                                        }`}
                                                    />
                                                ) : (
                                                    <div key={di} className="w-3.25 h-3.25" />
                                                )
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 mt-3 text-[11px] text-base-content/50">
                            <span>Less</span>
                            {LEVEL_CLASSES.map((cls, i) => (
                                <span key={i} className={`w-2.75 h-2.75 rounded-[3px] ${cls}`} />
                            ))}
                            <span>More</span>
                        </div>
                    </>
                )}
            </div>

            {years.length > 1 && (
                <div className="flex flex-col items-stretch justify-center gap-1.5 w-24 shrink-0">
                    {years.map((y) => (
                        <button
                            key={y}
                            type="button"
                            onClick={() => { setSelectedYear(y); setSelectedDay(null); }}
                            className={
                                y === selectedYear
                                    ? "btn btn-sm btn-primary rounded-box"
                                    : "btn btn-sm btn-ghost text-base-content/50"
                            }
                        >
                            {y}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActivityHeatmap;
