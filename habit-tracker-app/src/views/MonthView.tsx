import React, { useContext, useState } from 'react';
import { HabitContext } from '../context/HabitContext';
import CalendarHeatmap from '../components/CalendarHeatmap';
import { getMonthSummary } from '../utils/analytics';
import './MonthView.css';

const MonthView = () => {
    const { habits } = useContext(HabitContext);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedHabit, setSelectedHabit] = useState(null);
    
    const monthSummary = getMonthSummary(habits, currentMonth, selectedHabit);

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const handleHabitFilterChange = (event) => {
        setSelectedHabit(event.target.value);
    };

    return (
        <div className="month-view">
            <header>
                <h1>Habit Tracker - Month View</h1>
                <div className="month-navigation">
                    <button onClick={handlePreviousMonth}>Previous Month</button>
                    <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={handleNextMonth}>Next Month</button>
                </div>
                <div className="habit-filter">
                    <label htmlFor="habit-filter">Filter Habits:</label>
                    <select id="habit-filter" onChange={handleHabitFilterChange}>
                        <option value="">Show All Habits</option>
                        {habits.map(habit => (
                            <option key={habit.id} value={habit.id}>{habit.name}</option>
                        ))}
                    </select>
                </div>
            </header>
            <CalendarHeatmap habits={habits} currentMonth={currentMonth} selectedHabit={selectedHabit} />
            <footer>
                <h2>Monthly Summary</h2>
                <p>Total Tasks Completed: {monthSummary.totalCompleted}</p>
                <p>Best Streak: {monthSummary.bestStreak}</p>
                <p>Most Active Day: {monthSummary.mostActiveDay}</p>
                <p>Number of Active Days: {monthSummary.activeDays}</p>
            </footer>
        </div>
    );
};

export default MonthView;