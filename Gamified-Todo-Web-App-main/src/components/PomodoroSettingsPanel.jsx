import { X, Volume2, Bell, Clock3, RotateCcw } from "lucide-react";
import { usePomodoroSettingsContext } from "../context/PomodoroSettingsContext";

function NumberField({ label, value, min = 1, max = 180, step = 1, onChange, suffix }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-400 focus:outline-none"
        />
        {suffix ? <span className="text-xs text-white/60">{suffix}</span> : null}
      </div>
    </label>
  );
}

function ToggleRow({ label, description, checked, onChange, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-purple-300" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/60">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-purple-500" : "bg-white/20"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

function Slider({ label, value, onChange, min = 0, max = 1, step = 0.05 }) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="font-semibold uppercase tracking-[0.2em]">{label}</span>
        <span className="text-white/60">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-purple-400"
      />
    </label>
  );
}

function PomodoroSettingsPanel() {
  const {
    settings,
    updateSetting,
    resetSettings,
    isSettingsOpen,
    closeSettings,
    playPreviewSound,
  } = usePomodoroSettingsContext();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Pomodoro Settings</p>
            <h3 className="text-2xl font-bold text-white">Control your sessions</h3>
          </div>
          <button
            onClick={closeSettings}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField
            label="Pomodoro duration"
            value={settings.pomodoroMinutes}
            suffix="min"
            onChange={(v) => updateSetting("pomodoroMinutes", Math.max(1, v))}
          />
          <NumberField
            label="Short break duration"
            value={settings.shortBreakMinutes}
            suffix="min"
            onChange={(v) => updateSetting("shortBreakMinutes", Math.max(1, v))}
          />
          <NumberField
            label="Long break duration"
            value={settings.longBreakMinutes}
            suffix="min"
            onChange={(v) => updateSetting("longBreakMinutes", Math.max(1, v))}
          />
          <NumberField
            label="Long break interval"
            value={settings.longBreakInterval}
            suffix="sessions"
            onChange={(v) => updateSetting("longBreakInterval", Math.max(1, v))}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ToggleRow
            label="Alarm sound"
            description="Play a tone when a session ends."
            checked={settings.alarmEnabled}
            onChange={(v) => updateSetting("alarmEnabled", v)}
            icon={Bell}
          />
          <ToggleRow
            label="Ticking sound"
            description="Light tick while the timer runs."
            checked={settings.tickingEnabled}
            onChange={(v) => updateSetting("tickingEnabled", v)}
            icon={Clock3}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ToggleRow
            label="Auto-start work"
            description="Start Pomodoro automatically after breaks."
            checked={settings.autoStartWork}
            onChange={(v) => updateSetting("autoStartWork", v)}
            icon={Clock3}
          />
          <ToggleRow
            label="Auto-start breaks"
            description="Start breaks automatically after Pomodoro."
            checked={settings.autoStartBreak}
            onChange={(v) => updateSetting("autoStartBreak", v)}
            icon={Clock3}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <Slider
            label="Alarm volume"
            value={settings.alarmVolume}
            onChange={(v) => updateSetting("alarmVolume", v)}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={playPreviewSound}
              className="flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-100 hover:bg-purple-500/30"
            >
              <Volume2 className="h-4 w-4" />
              Play preview sound
            </button>
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:border-white/20"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PomodoroSettingsPanel;
