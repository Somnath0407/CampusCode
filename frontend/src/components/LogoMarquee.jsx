const COMPANIES = [
    { name: 'Google', color: '#4285F4' },
    { name: 'Qualcomm', color: '#3253DC' },
    { name: 'Meta', color: '#0866FF' },
    { name: 'Apple', color: 'var(--color-base-content)' },
    { name: 'Netflix', color: '#E50914' },
    { name: 'LinkedIn', color: '#0A66C2' },
    { name: 'amazon', color: 'var(--color-base-content)' },
    { name: 'Microsoft', color: 'var(--color-base-content)' },
];

const MicrosoftMark = () => (
    <span className="inline-grid grid-cols-2 gap-0.5 w-4 h-4 mr-1.5 align-middle -mt-0.5">
        <span className="bg-[#f25022]" />
        <span className="bg-[#7fba00]" />
        <span className="bg-[#00a4ef]" />
        <span className="bg-[#ffb900]" />
    </span>
);

const LogoMarquee = () => {
    const track = [...COMPANIES, ...COMPANIES];

    return (
        <div className="border-y border-base-300 bg-base-200/30 py-12 sm:py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <h2 className="text-base font-semibold">Delivering job-ready developers</h2>
                <p className="text-sm text-base-content/50 mt-1.5">Companies where our community's developers are working</p>
            </div>
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className="marquee-track flex w-max items-center gap-16">
                    {track.map((c, i) => (
                        <span
                            key={i}
                            className="shrink-0 flex items-center text-xl sm:text-2xl font-bold tracking-tight opacity-80 hover:opacity-100 transition-opacity"
                            style={{ color: c.color }}
                        >
                            {c.name === 'Microsoft' && <MicrosoftMark />}
                            {c.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoMarquee;
