import React, { useState } from 'react';

const DailyNote: React.FC = () => {
    const [note, setNote] = useState<string>('');
    const [upcomingHabits, setUpcomingHabits] = useState<string[]>([]);

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(event.target.value);
    };

    const handleSaveNote = () => {
        // Logic to save the note (e.g., update context or local storage)
        console.log('Note saved:', note);
    };

    return (
        <div className="daily-note">
            <h2>Daily Note</h2>
            <textarea
                value={note}
                onChange={handleNoteChange}
                placeholder="Write your daily note here..."
                rows={4}
                cols={50}
            />
            <button onClick={handleSaveNote}>Save Note</button>
            <div className="upcoming-habits">
                <h3>Upcoming Habits for Tomorrow</h3>
                <ul>
                    {upcomingHabits.length > 0 ? (
                        upcomingHabits.map((habit, index) => (
                            <li key={index}>{habit}</li>
                        ))
                    ) : (
                        <li>No upcoming habits.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DailyNote;