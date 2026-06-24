export default function DashboardTab() {

  return (
    <div className="space-y-6 p-4 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">
            Welcome back 👋
          </h1>
          <p className="mt-2 max-w-2xl text-blue-100">
            Track performance, monitor growth, and make data-driven
            decisions from a single dashboard.
          </p>
        </div>
      </div>
 
    </div>
  );
}