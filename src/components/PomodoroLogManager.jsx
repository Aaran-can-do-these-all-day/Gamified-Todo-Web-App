import { Trash2, Clock4, BookOpen, X } from "lucide-react";
import { usePomodoroSettingsContext } from "../context/PomodoroSettingsContext";

const formatTime = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

function PomodoroLogManager() {
  const { isLogManagerOpen, closeLogManager, logs, clearAllLogs } = usePomodoroSettingsContext();

  if (!isLogManagerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-500/20 p-2">
              <BookOpen className="h-5 w-5 text-purple-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Session log</p>
              <h3 className="text-2xl font-bold text-white">History</h3>
            </div>
          </div>
          <button
            onClick={closeLogManager}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-white/70">Saved locally in your browser.</p>
          <button
            onClick={clearAllLogs}
            className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:border-white/25"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-center text-sm text-white/60">
            No sessions logged yet.
          </p>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {logs.map((log, idx) => (
              <div
                key={`${log.startTime}-${idx}`}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Clock4 className="h-4 w-4 text-purple-200" />
                    <span>{log.sessionType}</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/60">
                    {formatTime(log.startTime)} → {formatTime(log.endTime)}
                  </span>
                </div>
                {log.note ? (
                  <p className="mt-2 text-sm text-white/80">Note: {log.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PomodoroLogManager;
