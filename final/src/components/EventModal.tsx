import React, { useContext, useState, FormEvent, useEffect, useRef } from 'react';
import GlobalContext, { CalendarEvent } from '../context/GlobalContext';
import { CSSTransition } from 'react-transition-group';

// Define labels and their colors
const labelsClasses = [
    { name: 'Red Event', color: 'hsl(0, 75%, 60%)' },
    { name: 'Blue Event', color: 'hsl(200, 80%, 50%)' },
    { name: 'Green Event', color: 'hsl(150, 80%, 30%)' },
] as const;

type GlobalContextType = {
    setShowEventModal: (show: boolean) => void;
    daySelected: any; // Can use `dayjs.Dayjs` if using dayjs
    dispatchedCalEvent: (action: { type: string; payload: CalendarEvent }) => void;
    selectedEvent: CalendarEvent | null;
};

// EventModal component
export default function EventModal() {
    const {
        setShowEventModal,
        daySelected,
        dispatchedCalEvent,
        selectedEvent,
    } = useContext(GlobalContext) as GlobalContextType;

    const modalRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(true); // Manage modal visibility for transitions

    const [title, setTitle] = useState<string>(selectedEvent ? selectedEvent.title : '');
    const [selectedLabel, setSelectedLabel] = useState<string>(
        selectedEvent
            ? labelsClasses.find((lbl) => lbl.color === selectedEvent.label)?.color || labelsClasses[0].color
            : labelsClasses[0].color
    );
    const [startTime, setStartTime] = useState<string>(selectedEvent?.startTime || '');
    const [endTime, setEndTime] = useState<string>(selectedEvent?.endTime || '');
    const [isAllDay, setIsAllDay] = useState<boolean>(selectedEvent?.isAllDay || false);
    const [error, setError] = useState<string | null>(null);

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!isAllDay && (!startTime || !endTime)) {
            setError("Both start time and end time are required for non-all-day events.");
            return;
        }

        if (!isAllDay && startTime >= endTime) {
            setError("Start time must be before end time.");
            return;
        }

        setError(null);

        const calendarEvent: CalendarEvent = {
            id: selectedEvent ? selectedEvent.id : Date.now().toString(),
            title,
            label: selectedLabel,
            day: daySelected.valueOf(),
            startTime: isAllDay ? null : startTime,
            endTime: isAllDay ? null : endTime,
            isAllDay,
        };

        // Dispatch action to add or update event
        if (selectedEvent) {
            dispatchedCalEvent({ type: 'update', payload: calendarEvent });
        } else {
            dispatchedCalEvent({ type: 'push', payload: calendarEvent });
        }

        handleClose(); // Close modal
    };

    const handleClose = () => {
        setShowModal(false);
        setTimeout(() => setShowEventModal(false), 300); // Allow time for exit animation
    };

    // Close modal with Escape key
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

    // Set focus to the modal when it opens
    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus();
        }
    }, []);

    return (
        <CSSTransition in={showModal} timeout={300} classNames="modal" unmountOnExit>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <form
                    ref={modalRef}
                    className="bg-white rounded-lg shadow-lg w-10/12 max-w-sm p-4"
                    onSubmit={handleSubmit}
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
                >
                    <header className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            {selectedEvent ? (
                                <button type="submit" className="px-4 py-2 rounded text-xl font-semibold mr-2 w-full">
                                    Edit Event
                                </button>
                            ) : (
                                <button type="submit" className="px-4 py-2 rounded text-xl font-semibold mr-2 w-full">
                                    Add Event
                                </button>
                            )}
                        </div>
                        <p className="text-sm" style={{ color: '#555' }}>
                            {daySelected.format('MM/DD/YY')}
                        </p>
                        <button onClick={handleClose} type="button">
                            <span className="material-icons-outlined text-gray-400">close</span>
                        </button>
                    </header>

                    <div className="grid gap-y-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium" style={{ color: '#777' }}>
                                Name
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                style={{ color: '#333' }}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                id="allDay"
                                type="checkbox"
                                checked={isAllDay}
                                onChange={(e) => setIsAllDay(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="allDay" className="ml-2 block text-sm font-medium" style={{ color: '#777' }}>
                                All Day?
                            </label>
                        </div>

                        {!isAllDay && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium" style={{ color: '#777' }}>
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        style={{ color: '#333' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium" style={{ color: '#777' }}>
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        style={{ color: '#333' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-x-2">
                            {labelsClasses.map((label, i) => (
                                <span
                                    key={i}
                                    onClick={() => setSelectedLabel(label.color)}
                                    className="w-6 h-6 flex items-center justify-center cursor-pointer rounded-md"
                                    style={{ backgroundColor: label.color }}
                                >
                                    {selectedLabel === label.color && (
                                        <span className="material-icons-outlined text-white text-sm">check</span>
                                    )}
                                </span>
                            ))}
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <footer className="flex justify-between space-x-2 border-t p-3 mt-4">
                        {selectedEvent ? (
                            <>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded text-sm border flex-1"
                                    style={{
                                        backgroundColor: 'hsl(150, 80%, 95%)',
                                        borderColor: 'hsl(150, 80%, 30%)',
                                        color: 'hsl(150, 80%, 10%)',
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedEvent) {
                                            dispatchedCalEvent({
                                                type: 'delete',
                                                payload: selectedEvent,
                                            });
                                            handleClose();
                                        }
                                    }}
                                    className="px-4 py-2 rounded text-sm border flex-1"
                                    style={{
                                        backgroundColor: 'hsl(0, 75%, 95%)',
                                        borderColor: 'hsl(0, 75%, 30%)',
                                        color: 'hsl(0, 75%, 10%)',
                                    }}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 rounded text-sm border flex-1"
                                style={{
                                    backgroundColor: 'hsl(150, 80%, 95%)',
                                    borderColor: 'hsl(150, 80%, 30%)',
                                    color: 'hsl(150, 80%, 10%)',
                                }}
                            >
                                Add
                            </button>
                        )}
                    </footer>
                </form>
            </div>
        </CSSTransition>
    );
}
