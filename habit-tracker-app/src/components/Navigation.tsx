import React, { useContext } from 'react';
import { HabitContext } from '../context/HabitContext';
import { ThemeContext } from '../context/ThemeContext';

const Navigation: React.FC = () => {
    const { setView } = useContext(HabitContext);
    const { theme } = useContext(ThemeContext);

    const handleNavigation = (view: string) => {
        setView(view);
    };

    return (
        <nav className={`navigation ${theme}`}>
            <button onClick={() => handleNavigation('month')}>Month</button>
            <button onClick={() => handleNavigation('agenda')}>Agenda</button>
            <button onClick={() => handleNavigation('settings')}>Settings</button>
        </nav>
    );
};

export default Navigation;