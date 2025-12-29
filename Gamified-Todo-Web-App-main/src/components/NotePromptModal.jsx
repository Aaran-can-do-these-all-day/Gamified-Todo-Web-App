import { X, StickyNote } from "lucide-react";
import { useState, useEffect } from "react";
import { usePomodoroSettingsContext } from "../context/PomodoroSettingsContext";

const modeLabels = {
  pomodoro: "Pomodoro",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

function NotePromptModal() {
  const { isNotePromptOpen, pendingSessionType, submitNote, cancelNote } = usePomodoroSettingsContext();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isNotePromptOpen) setNote("");
  }, [isNotePromptOpen]);

  if (!isNotePromptOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-500/20 p-2">
              <StickyNote className="h-5 w-5 text-purple-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Session note</p>
              <h3 className="text-xl font-bold text-white">{modeLabels[pendingSessionType] || ""}</h3>
            </div>
          </div>
          <button
            onClick={cancelNote}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-white/70">Optional note for this session (e.g., what you will focus on).</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-purple-400 focus:outline-none"
          placeholder="Example: Draft outline for feature X"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => submitNote(note)}
            className="rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600"
          >
            Start with note
          </button>
          <button
            onClick={() => submitNote("")}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-white/25"
          >
            Start without note
          </button>
          <button
            onClick={cancelNote}
            className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotePromptModal;
