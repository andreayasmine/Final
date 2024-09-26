import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs'; // Ensure dayjs is imported for date formatting
import { CSSTransition } from 'react-transition-group'; // Import CSSTransition

// Define the shape of the event
type Event = {
    title: string;
    label: string;
    startTime?: string | null | undefined;
};

// Define the props for the OverflowModal component
type OverflowModalProps = {
    events: Event[];
    daySelected: Dayjs;
    onClose: () => void;
    onSelectEvent: (event: Event) => void;
};

// Define the colors for the labels
const labelColors: { [key: string]: string } = {
    "Red Event": "hsl(0, 75%, 60%)",
    "Blue Event": "hsl(200, 80%, 50%)",
    "Green Event": "hsl(150, 80%, 30%)",
};

// Define the OverflowModal component   
export default function OverflowModal({
    events,
    daySelected,
    onClose,
    onSelectEvent,
}: OverflowModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Handle the visibility of the modal
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Handle the closing of the modal
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for the animation to finish before removing from DOM
    };

    // Get the background color style based on the label
    const getBackgroundColorStyle = (label: string) => {
        const color = Object.values(labelColors).find((color) => label.includes(color));
        return { backgroundColor: color || 'hsl(0, 0%, 90%)' }; // Default to a light gray if no match
    };

    return (
        //modal transition with CSSTransition
        <CSSTransition in={isVisible} timeout={300} classNames="modal" unmountOnExit>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                {/* modal container */}
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4 transform transition-transform duration-300 ease-out">
                    <header className="flex justify-between items-center mb-4">
                        {/* display selected date */}
                        <h2 className="text-xl font-semibold" style={{ color: '#555' }}>
                            {daySelected ? dayjs(daySelected).format('MM/DD/YY') : 'Select a date'}
                        </h2>
                        {/* close button */}
                        <button onClick={handleClose} className="text-gray-600 hover:text-gray-900">
                            <span className="material-icons-outlined">close</span>
                        </button>
                    </header>
                    {/* display list of events */}
                    <div>
                        {events.map((evt, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    onSelectEvent(evt);
                                    handleClose();
                                }}
                                className="p-2 mb-2 rounded cursor-pointer text-gray-700 hover:bg-gray-300"
                                style={getBackgroundColorStyle(evt.label)}
                            >
                                {evt.title} {evt.startTime && `- ${evt.startTime}`}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
