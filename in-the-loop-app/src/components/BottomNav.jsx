const TABS = [
  { key: "home", label: "홈", emoji: "🏠" },
  { key: "review", label: "복습", emoji: "📚" },
  { key: "gap", label: "갭 저널", emoji: "📝" },
  { key: "calendar", label: "기록", emoji: "🗓️" },
];

export default function BottomNav({ active, onChange, reviewBadge }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${
              active === tab.key ? "text-loop-600" : "text-gray-400"
            }`}
          >
            <span className="text-xl">{tab.emoji}</span>
            {tab.label}
            {tab.key === "review" && reviewBadge > 0 && (
              <span className="absolute right-6 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                {reviewBadge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
