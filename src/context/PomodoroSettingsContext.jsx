import { createContext, useContext, useMemo, useRef, useState } from "react";
import { usePomodoroSettings } from "../hooks/usePomodoroSettings";
import { clearLogs, loadLogs, saveLog } from "../utils/pomodoroLogs";

const PomodoroSettingsContext = createContext(null);

const playTone = (frequency = 880, duration = 0.2, volume = 0.4) => {
  if (typeof window === "undefined" || !window.AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export function PomodoroSettingsProvider({ children }) {
  const { settings, updateSetting, resetSettings } = usePomodoroSettings();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isLogManagerOpen, setLogManagerOpen] = useState(false);
  const [isNotePromptOpen, setNotePromptOpen] = useState(false);
  const [pendingSessionType, setPendingSessionType] = useState(null);
  const noteResolverRef = useRef(null);
  const [logs, setLogs] = useState(loadLogs());

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const openLogManager = () => setLogManagerOpen(true);
  const closeLogManager = () => setLogManagerOpen(false);

  const requestNote = (sessionType) =>
    new Promise((resolve) => {
      setPendingSessionType(sessionType);
      noteResolverRef.current = resolve;
      setNotePromptOpen(true);
    });

  const submitNote = (note) => {
    noteResolverRef.current?.(note || "");
    noteResolverRef.current = null;
    setNotePromptOpen(false);
    setPendingSessionType(null);
  };

  const cancelNote = () => submitNote("");

  const addLog = (log) => {
    saveLog(log);
    setLogs(loadLogs());
  };

  const clearAllLogs = () => {
    clearLogs();
    setLogs([]);
  };

  const playAlarm = () => {
    if (!settings.alarmEnabled) return;
    playTone(880, 0.22, settings.alarmVolume);
  };

  const playTick = () => {
    if (!settings.tickingEnabled) return;
    playTone(520, 0.05, Math.min(settings.alarmVolume, 0.25));
  };

  const playPreviewSound = () => playTone(880, 0.22, settings.alarmVolume);

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      resetSettings,
      isSettingsOpen,
      openSettings,
      closeSettings,
      isLogManagerOpen,
      openLogManager,
      closeLogManager,
      isNotePromptOpen,
      pendingSessionType,
      requestNote,
      submitNote,
      cancelNote,
      logs,
      addLog,
      clearAllLogs,
      playAlarm,
      playTick,
      playPreviewSound,
    }),
    [settings, isSettingsOpen, isLogManagerOpen, isNotePromptOpen, pendingSessionType, logs],
  );

  return (
    <PomodoroSettingsContext.Provider value={value}>
      {children}
    </PomodoroSettingsContext.Provider>
  );
}

export const usePomodoroSettingsContext = () => {
  const ctx = useContext(PomodoroSettingsContext);
  if (!ctx) {
    throw new Error("usePomodoroSettingsContext must be used within PomodoroSettingsProvider");
  }
  return ctx;
};
