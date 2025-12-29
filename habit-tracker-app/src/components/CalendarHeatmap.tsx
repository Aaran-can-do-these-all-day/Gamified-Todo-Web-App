import React, { useContext, useState } from 'react';
import { HabitContext } from '../context/HabitContext';
import { getMonthData, getMonthName } from '../utils/dateHelpers';

const CalendarHeatmap = () => {
    const { habits } = useContext(HabitContext);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const monthData = getMonthData(currentMonth, habits);
    const monthName = getMonthName(currentMonth);

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    return (
        <div className="calendar-heatmap">
            <header>
                <button onClick={handlePreviousMonth}>Previous Month</button>
                <h2>{monthName} {currentMonth.getFullYear()}</h2>
                <button onClick={handleNextMonth}>Next Month</button>
            </header>
            <div className="heatmap-grid">
                {monthData.map((week, weekIndex) => (
                    <div key={weekIndex} className="week">
                        {week.map((day, dayIndex) => (
                            <div key={dayIndex} className={`day ${day.intensity}`}>
                                {day.completed ? '✔️' : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <footer>
                <div>Total tasks completed: {monthData.totalCompleted}</div>
                <div>Best streak: {monthData.bestStreak}</div>
                <div>Most active day: {monthData.mostActiveDay}</div>
                <div>Number of active days: {monthData.activeDays}</div>
            </footer>
        </div>
    );
};

export default CalendarHeatmap;