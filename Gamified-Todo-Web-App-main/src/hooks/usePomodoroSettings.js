import { useEffect, useState } from "react";

const SETTINGS_KEY = "pomodoroSettings";

const defaultSettings = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  alarmEnabled: true,
  alarmVolume: 0.5,
  tickingEnabled: false,
  autoStartWork: false,
  autoStartBreak: false,
};

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};

export function usePomodoroSettings() {
  const [settings, setSettings] = useState(() => {
    if (typeof window === "undefined") return defaultSettings;
    const stored = safeParse(localStorage.getItem(SETTINGS_KEY));
    return stored ? { ...defaultSettings, ...stored } : defaultSettings;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  return { settings, updateSetting, resetSettings, defaultSettings };
}
