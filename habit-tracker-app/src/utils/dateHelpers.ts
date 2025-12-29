export const getCurrentMonth = (): Date => {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
};

export const getPreviousMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

export const getNextMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

export const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

export const calculateStreak = (completionDates: Date[]): number => {
    if (completionDates.length === 0) return 0;

    completionDates.sort((a, b) => a.getTime() - b.getTime());
    let streak = 1;
    let lastDate = completionDates[0];

    for (let i = 1; i < completionDates.length; i++) {
        const currentDate = completionDates[i];
        const diffDays = (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

        if (diffDays === 1) {
            streak++;
        } else if (diffDays > 1) {
            break;
        }

        lastDate = currentDate;
    }

    return streak;
};

export const getMostActiveDay = (completionDates: Date[]): Date | null => {
    const dateCount: { [key: string]: number } = {};

    completionDates.forEach(date => {
        const dateString = date.toDateString();
        dateCount[dateString] = (dateCount[dateString] || 0) + 1;
    });

    const mostActiveDay = Object.keys(dateCount).reduce((a, b) => dateCount[a] > dateCount[b] ? a : b);
    return new Date(mostActiveDay);
};

export const getActiveDaysCount = (completionDates: Date[]): number => {
    const uniqueDays = new Set(completionDates.map(date => date.toDateString()));
    return uniqueDays.size;
};