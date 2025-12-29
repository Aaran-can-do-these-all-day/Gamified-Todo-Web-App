import React, { useContext } from 'react';
import { HabitContext } from '../context/HabitContext';

const HabitList: React.FC = () => {
    const { habits, toggleHabitCompletion } = useContext(HabitContext);

    return (
        <div className="habit-list">
            <h2>Today's Habits</h2>
            <ul>
                {habits.map(habit => (
                    <li key={habit.id} className={`habit-item ${habit.completed ? 'completed' : ''}`}>
                        <input
                            type="checkbox"
                            checked={habit.completed}
                            onChange={() => toggleHabitCompletion(habit.id)}
                        />
                        <span>{habit.name}</span>
                        {habit.reminder && <span className="reminder">Reminder: {habit.reminder}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HabitList;