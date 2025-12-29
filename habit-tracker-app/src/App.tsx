import React, { useState } from 'react';
import { HabitProvider } from './context/HabitContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import MonthView from './views/MonthView';
import AgendaView from './views/AgendaView';
import SettingsView from './views/SettingsView';

const App = () => {
  const [currentView, setCurrentView] = useState('month');

  const renderView = () => {
    switch (currentView) {
      case 'month':
        return <MonthView />;
      case 'agenda':
        return <AgendaView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MonthView />;
    }
  };

  return (
    <HabitProvider>
      <ThemeProvider>
        <div className="app-container">
          <Navigation currentView={currentView} setCurrentView={setCurrentView} />
          {renderView()}
        </div>
      </ThemeProvider>
    </HabitProvider>
  );
};

export default App;