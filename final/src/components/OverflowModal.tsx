import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import dayjs, { Dayjs } from 'dayjs';

type Event = {
    title: string;
    label: string;
    startTime?: string | null | undefined;
};

type OverflowModalProps = {
    events: Event[];
    daySelected: Dayjs;
    onClose: () => void;
    onSelectEvent: (event: Event) => void;
};

export default function OverflowModal({
    events,
    daySelected,
    onClose,
    onSelectEvent,
}: OverflowModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null); // Ref for modal focus management

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Close modal when Escape key is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Handle modal close
    const handleClose = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation(); // Prevent the event from bubbling up
        setIsVisible(false);
        setTimeout(onClose, 300); // Close after animation
    };

    // Sort events by time
    const sortedEvents = [...events].sort((a, b) => {
        if (a.startTime && b.startTime) {
            const aTime = dayjs(`${daySelected.format('YYYY-MM-DD')} ${a.startTime}`, 'YYYY-MM-DD h:mm A');
            const bTime = dayjs(`${daySelected.format('YYYY-MM-DD')} ${b.startTime}`, 'YYYY-MM-DD h:mm A');
            return aTime.isBefore(bTime) ? -1 : 1;
        }
        return 0;
    });

    return (
        <CSSTransition in={isVisible} timeout={300} classNames="modal" unmountOnExit>
            <div
                className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
                onClick={handleClose} // Close modal if background is clicked
            >
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4 max-h-[80vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
                    tabIndex={-1} // Make modal focusable
                >
                    <header className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            {daySelected ? dayjs(daySelected).format('MM/DD/YY') : 'Select a date'}
                        </h2>
                        <button onClick={handleClose} className="text-gray-600 hover:text-gray-900">
                            <span className="material-icons-outlined">close</span>
                        </button>
                    </header>
                    <div>
                        {sortedEvents.map((evt, idx) => {
                            const time = evt.startTime
                                ? dayjs(`${daySelected.format('YYYY-MM-DD')} ${evt.startTime}`, 'YYYY-MM-DD h:mm A')
                                : null;
                            const formattedTime = time ? time.format('h:mm A') : '';

                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        onSelectEvent(evt);
                                        handleClose(new MouseEvent('click')); // Close modal on event selection
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onSelectEvent(evt);
                                            handleClose(new MouseEvent('click')); // Close modal on event selection
                                        }
                                    }}
                                    className="p-2 mb-2 rounded cursor-pointer text-white hover:opacity-90"
                                    style={{ backgroundColor: evt.label }}
                                    tabIndex={0} // Make each event focusable
                                >
                                    <span className="text-sm font-medium">{evt.title}</span>
                                    {formattedTime && <span className="text-xs ml-2">- {formattedTime}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
