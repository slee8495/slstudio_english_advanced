import { useState } from "react";

export default function ProfileGate({ onSubmit }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-6 pt-[env(safe-area-inset-top)]">
      <div className="w-full max-w-sm text-center">
        <p className="mb-2 text-4xl">🔁</p>
        <h1 className="mb-1 text-2xl font-bold text-gray-900">In The Loop</h1>
        <p className="mb-6 text-sm text-gray-500">
          이름을 입력하면 그 이름으로 진행 상황이 따로 저장돼요. 로그인은 필요 없고, 나중에 같은
          이름을 다시 입력하면 그대로 이어져요.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 또는 별명"
            autoFocus
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-loop-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-xl bg-loop-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
