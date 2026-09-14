function CategoryCard({ category, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(category)}
      className="min-h-[115px] w-full bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-2xl px-3 py-5 flex flex-col items-center justify-center text-center transition"
    >
      <div className="text-2xl mb-3">{category.icon}</div>
      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">{category.title}</h3>
      <p className="mt-1 text-[11px] text-gray-400">{category.jobs}</p>
    </button>
  );
}

export default CategoryCard;
