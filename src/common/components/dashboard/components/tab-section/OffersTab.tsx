export default function OffersTab() {
 
  return (
    <div className="space-y-6 p-4 bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Offers & Promotions
            </h1>
            <p className="mt-2 text-purple-100">
              Manage discounts, campaigns and promotional activities.
            </p>
          </div>

        </div>
      </div>


    </div>
  );
}