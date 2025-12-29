export const analyzeHabits = (habits) => {
    const completedTasks = habits.filter(habit => habit.completed);
    const totalTasks = habits.length;

    const streaks = completedTasks.reduce((acc, habit) => {
        const streak = habit.streak || 0;
        return acc + streak;
    }, 0);

    const weakestHabit = habits.reduce((prev, curr) => {
        return (prev.completedCount < curr.completedCount) ? prev : curr;
    });

    const strongestHabit = habits.reduce((prev, curr) => {
        return (prev.completedCount > curr.completedCount) ? prev : curr;
    });

    return {
        totalTasks,
        completedTasks: completedTasks.length,
        streaks,
        weakestHabit,
        strongestHabit
    };
};

export const calculateLongestStreak = (habit) => {
    let longestStreak = 0;
    let currentStreak = 0;

    habit.history.forEach(day => {
        if (day.completed) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    });

    return longestStreak;
};