import React from 'react';

const FloatingActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button 
            className="floating-action-button" 
            onClick={onClick}
            aria-label="Add Habit"
        >
            +
        </button>
    );
};

export default FloatingActionButton;