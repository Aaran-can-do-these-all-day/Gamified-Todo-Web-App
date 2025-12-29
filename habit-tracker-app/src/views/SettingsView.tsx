import React, { useContext, useState } from 'react';
import { HabitContext } from '../context/HabitContext';
import { ThemeContext } from '../context/ThemeContext';

const SettingsView: React.FC = () => {
    const { habits, addHabit, editHabit, deleteHabit } = useContext(HabitContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [newHabit, setNewHabit] = useState('');
    const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
    const [habitColor, setHabitColor] = useState('green');
    const [reminder, setReminder] = useState('');

    const handleAddHabit = () => {
        if (newHabit) {
            addHabit({ name: newHabit, color: habitColor, reminder });
            setNewHabit('');
            setReminder('');
        }
    };

    const handleEditHabit = () => {
        if (selectedHabit && newHabit) {
            editHabit(selectedHabit, { name: newHabit, color: habitColor, reminder });
            setNewHabit('');
            setSelectedHabit(null);
            setReminder('');
        }
    };

    const handleDeleteHabit = (habitId: string) => {
        deleteHabit(habitId);
    };

    return (
        <div className={`settings-view ${theme}`}>
            <h1>Settings</h1>
            <div>
                <h2>Add/Edit Habit</h2>
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Habit name"
                />
                <select value={habitColor} onChange={(e) => setHabitColor(e.target.value)}>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                </select>
                <input
                    type="text"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    placeholder="Reminder (optional)"
                />
                <button onClick={selectedHabit ? handleEditHabit : handleAddHabit}>
                    {selectedHabit ? 'Edit Habit' : 'Add Habit'}
                </button>
            </div>
            <div>
                <h2>Your Habits</h2>
                <ul>
                    {habits.map((habit) => (
                        <li key={habit.id}>
                            <span style={{ color: habit.color }}>{habit.name}</span>
                            <button onClick={() => { setSelectedHabit(habit.id); setNewHabit(habit.name); setHabitColor(habit.color); setReminder(habit.reminder); }}>
                                Edit
                            </button>
                            <button onClick={() => handleDeleteHabit(habit.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>App Settings</h2>
                <button onClick={toggleTheme}>Toggle Theme</button>
                <div>
                    <label>Weekly Start Day:</label>
                    <select>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                    </select>
                </div>
                <button>Backup Data</button>
                <button>Restore Data</button>
                <button>Reset Progress</button>
            </div>
        </div>
    );
};

export default SettingsView;