import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight">to day</h1>
      <p className="mt-4 text-center text-base text-gray-600">목표와 투두를 탭으로 관리하세요.</p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/goal"
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
          목표 탭
        </Link>
        <Link
          href="/todo"
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
          투두 탭
        </Link>
      </div>
    </main>
  );
}
