// components/StatCard.tsx
interface StatCardProps {
  label: string;
  count: number;
  color: string;
}

const StatCard = ({ label, count, color }: StatCardProps) => {
  return (
    <div
      className={`${color} rounded-2xl p-8 text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">
          {label}
        </span>
        <span className="text-5xl font-black mt-3">{count}</span>
      </div>
    </div>
  );
};

export default StatCard;
