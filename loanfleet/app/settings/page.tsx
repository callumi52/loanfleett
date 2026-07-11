export default function SettingsPage() {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
      <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">Settings</p>
      <h1 className="text-3xl font-semibold text-white">Application Settings</h1>
      <p className="max-w-2xl text-sm text-slate-300">
        Configure dealership preferences, notifications, and fleet defaults here.
      </p>
    </div>
  );
}
