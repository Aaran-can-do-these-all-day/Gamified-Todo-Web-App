import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Settings, List, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import PomodoroSettingsPanel from "./PomodoroSettingsPanel";
import NotePromptModal from "./NotePromptModal";
import PomodoroLogManager from "./PomodoroLogManager";
import { usePomodoroSettingsContext } from "../context/PomodoroSettingsContext";

const MODE_META = {
  pomodoro: { label: "Pomodoro" },
  shortBreak: { label: "Short Break" },
  longBreak: { label: "Long Break" },
};

function PomodoroTimer() {
  const {
    settings,
    openSettings,
    openLogManager,
    requestNote,
    playAlarm,
    playTick,
    addLog,
  } = usePomodoroSettingsContext();

  const durations = useMemo(
    () => ({
      pomodoro: settings.pomodoroMinutes * 60,
      shortBreak: settings.shortBreakMinutes * 60,
      longBreak: settings.longBreakMinutes * 60,
    }),
    [settings.pomodoroMinutes, settings.shortBreakMinutes, settings.longBreakMinutes],
  );

  const [mode, setMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(durations.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [sessionNote, setSessionNote] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(durations[mode]);
    setIsRunning(false);
  }, [durations, mode]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleCompletion();
          return 0;
        }
        playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSessionNote("");
    setSessionStart(null);
    setIsRunning(false);
    setTimeLeft(durations[newMode]);
  };

  const handleCompletion = () => {
    const end = Date.now();
    if (sessionStart) {
      addLog({
        startTime: sessionStart,
        endTime: end,
        sessionType: MODE_META[mode].label,
        note: sessionNote,
      });
    }
    playAlarm();

    if (mode === "pomodoro") {
      const nextCount = sessionCount + 1;
      const useLongBreak = nextCount % settings.longBreakInterval === 0;
      setSessionCount(nextCount);
      const nextMode = useLongBreak ? "longBreak" : "shortBreak";
      setMode(nextMode);
      setSessionNote("");
      setSessionStart(null);
      setTimeLeft(durations[nextMode]);
      setIsRunning(useLongBreak ? settings.autoStartBreak : settings.autoStartBreak);
    } else {
      setMode("pomodoro");
      setSessionNote("");
      setSessionStart(null);
      setTimeLeft(durations.pomodoro);
      setIsRunning(settings.autoStartWork);
    }
  };

  const startWithNotePrompt = async () => {
    const note = await requestNote(mode);
    setSessionNote(note || "");
    setSessionStart(Date.now());
    setIsRunning(true);
  };

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    startWithNotePrompt();
  };

  const resetTimer = () => {
    setTimeLeft(durations[mode]);
    setIsRunning(false);
    setSessionNote("");
    setSessionStart(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = Math.max(0, Math.min(100, (timeLeft / durations[mode]) * 100));

  return (
    <div className="relative">
      <PomodoroSettingsPanel />
      <NotePromptModal />
      <PomodoroLogManager />

      <motion.div
        className="overflow-hidden rounded-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
        }}
      >
        <div className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {Object.keys(MODE_META).map((key) => (
                <button
                  key={key}
                  onClick={() => handleModeChange(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    mode === key ? "bg-white text-gray-800" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {MODE_META[key].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openLogManager}
                className="rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/25"
              >
                <List className="mr-2 inline h-4 w-4" /> Logs
              </button>
              <button
                onClick={openSettings}
                className="rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/25"
              >
                <Settings className="mr-2 inline h-4 w-4" /> Settings
              </button>
            </div>
          </div>

          <div className="mb-4 text-center">
            <div className="text-7xl font-bold text-white font-display tracking-wider">
              {formatTime(timeLeft)}
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/70">
              {MODE_META[mode].label}
            </p>
          </div>

          <div className="mb-6 h-2 w-full rounded-full bg-white/15">
            <div
              className="h-2 rounded-full bg-white"
              style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={toggleTimer}
              className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-gray-800 transition-colors hover:bg-gray-100"
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={playAlarm}
              className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white transition-colors hover:bg-white/30"
            >
              <Volume2 className="h-4 w-4" /> Preview alarm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PomodoroTimer;
