export default function SkeletonCard({ height = 'h-40' }) {
    return (
        <div className={`glass-card !rounded-[2rem] ${height} animate-pulse flex flex-col justify-between p-6 bg-white/[0.02] border-white/5`}>
            <div className="flex justify-between items-start">
                <div className="h-2 bg-white/10 rounded-full w-1/4" />
                <div className="h-8 w-8 bg-white/5 rounded-xl" />
            </div>
            <div className="space-y-3">
                <div className="h-8 bg-white/10 rounded-xl w-3/4" />
                <div className="h-2 bg-white/5 rounded-full w-1/2" />
            </div>
        </div>
    );
}
