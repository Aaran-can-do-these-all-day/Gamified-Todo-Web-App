import React, { useContext, useState } from 'react';
import { HabitContext } from '../context/HabitContext';
import HabitList from '../components/HabitList';
import DailyNote from '../components/DailyNote';
import FloatingActionButton from '../components/FloatingActionButton';

const AgendaView: React.FC = () => {
    const { habits, toggleHabitCompletion } = useContext(HabitContext);
    const [dailyNote, setDailyNote] = useState<string>('');

    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const todayHabits = habits.filter(habit => habit.date === today);

    const handleNoteChange = (note: string) => {
        setDailyNote(note);
    };

    return (
        <div className="agenda-view">
            <h1>Today's Habits</h1>
            <HabitList habits={todayHabits} onToggle={toggleHabitCompletion} />
            <DailyNote note={dailyNote} onNoteChange={handleNoteChange} />
            <FloatingActionButton />
        </div>
    );
};

export default AgendaView;