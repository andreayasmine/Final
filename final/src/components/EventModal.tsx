import { useContext, useState, FormEvent } from 'react';
import GlobalContext from '../context/GlobalContext';
import { CSSTransition } from 'react-transition-group';

//
type CalendarEvent = {
    id: number;
    title: string;
    label: string;
    startTime: string | null;
    endTime: string | null;
    isAllDay: boolean;
    
};


type Label = {
    name: string;
    color: string;
};

// Define the types for global  context properties
type GlobalContextType = {
    setShowEventModal: (show: boolean) => void;
    daySelected: any; // You can replace `any` with the type from your date library (e.g., `moment.Moment`)
    dispatchedCalEvent: (action: { type: string; payload: CalendarEvent }) => void;
    selectedEvent: CalendarEvent | null;
};

// Predefined labels of events and their colors
const labelsClasses: Label[] = [
    { name: "Red Event", color: "hsl(0, 75%, 60%)" },
    { name: "Blue Event", color: "hsl(200, 80%, 50%)" },
    { name: "Green Event", color: "hsl(150, 80%, 30%)" }
];

// Define the EventModal component allowing users to create and edit events
export default function EventModal() {
    const {
        setShowEventModal, 
        daySelected, 
        dispatchedCalEvent, 
        selectedEvent,
    } = useContext(GlobalContext) as GlobalContextType;
    
    //set states... event title, label, start time, end time, all day
    const [title, setTitle] = useState<string>(selectedEvent ? selectedEvent.title : '');
    const [selectedLabel, setSelectedLabel] = useState<string>(
        selectedEvent
            ? (labelsClasses.find((lbl) => lbl.color === selectedEvent.label)?.color || labelsClasses[0].color)
            : labelsClasses[0].color
    );
    const [startTime, setStartTime] = useState<string>(selectedEvent ? selectedEvent.startTime || '' : '');
    const [endTime, setEndTime] = useState<string>(selectedEvent ? selectedEvent.endTime || '' : '');
    const [isAllDay, setIsAllDay] = useState<boolean>(selectedEvent ? selectedEvent.isAllDay : false);
    const [error, setError] = useState<string | null>(null);

    //handle submit updates
    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        //validation of start and end times
        if (!isAllDay) {
            if (!startTime || !endTime) {
                setError("Both start time and end time are required for non-all-day events.");
                return;
            }

            if (startTime >= endTime) {
                setError("Start time must be before end time.");
                return;
            }
        }

        setError(null);

        //create calendar event
        const calendarEvent: CalendarEvent = {
            title,
            label: selectedLabel, // store selected label
            day: daySelected.valueOf(), // store selected day
            startTime: isAllDay ? null : startTime, // store start time
            endTime: isAllDay ? null : endTime, // store end time
            isAllDay, // store if event is all day
            id: selectedEvent ? selectedEvent.id : Date.now(), // store event id
        };

        //update or push event
        if (selectedEvent) {
            dispatchedCalEvent({ type: "update", payload: calendarEvent });
        } else {
            dispatchedCalEvent({ type: "push", payload: calendarEvent });
        }
        //close modal
        setShowEventModal(false);
    }

    return (
        <CSSTransition
            in={true}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
            {/* modal for creating editing events */}
            <div className=
            "fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <form className=
                "bg-white rounded-lg shadow-lg w-10/12 max-w-sm p-4" onSubmit={handleSubmit}>
                    <header className=
                    "flex justify-between items-center mb-4">
                        <div className=
                        "flex items-center">
                            {/* Button to submit the form (either add or edit) */}
                            {selectedEvent ? (
                                <button 
                                    type="submit"
                                    className=
                                    "px-4 py-2 rounded text-xl font-semibold mr-2 w-full"
                                >
                                    Edit Event
                                </button>
                            ) : (
                                <button 
                                    type="submit"
                                    className=
                                    "px-4 py-2 rounded text-xl font-semibold mr-2 w-full"
                                >
                                    Add Event
                                </button>
                            )}
                        </div>
                        {/* Display selected day */}
                        <p className=
                        "text-sm" style={{ color: '#555' }}>
                            {daySelected.format("MM/DD/YY")}
                        </p>
                        {/* close button */}
                        <button onClick={() => setShowEventModal(false)} type="button">
                            <span className="material-icons-outlined text-gray-400"
                            >
                                close
                            </span>
                        </button> 
                    </header>
                    {/* event title, label, start time, end time, all day */}
                    <div>
                        {/*  */}
                        <div className="grid gap-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium" 
                                style={{ color: '#777' }}>
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
                            {/* checkbox for all day */}
                            <div className="flex items-center mb-4">
                                <input
                                    id="allDay"
                                    type="checkbox"
                                    checked={isAllDay}
                                    onChange={(e) => setIsAllDay(e.target.checked)}
                                    className=
                                    "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="allDay"
                                 className="ml-2 block text-sm font-medium"
                                  style={{ color: '#777' }}>
                                    All Day?
                                </label>
                            </div>
                            {/* time for start and end time, hidden if all day */}
                            {!isAllDay && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium"
                                         style={{ color: '#777' }}>
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
                                        <label className="block text-sm font-medium" 
                                        style={{ color: '#777' }}>
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
                            {/*  labels selection color coded */}
                            <div className="flex gap-x-2">
                                {labelsClasses.map((label, i) => (
                                    <span 
                                        key={i}
                                        onClick={() => setSelectedLabel(label.color)}
                                        className=
                                        "w-6 h-6 flex items-center justify-center cursor-pointer rounded-md"
                                        style={{ backgroundColor: label.color }}
                                    >
                                        {selectedLabel === label.color && (
                                            <span 
                                            className="material-icons-outlined text-white text-sm">
                                                check
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* error message display */}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <footer className="flex justify-between space-x-2 border-t p-3 mt-4">
                        {/* conditional edit and delete button */}
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
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'hsl(150, 80%, 90%)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'hsl(150, 80%, 95%)'}
                                >
                                    Edit
                                </button>
                                {/*  */}
                                <button 
                                    type="button"
                                    onClick={() => {
                                        if (selectedEvent) {
                                            dispatchedCalEvent({
                                                type: "delete",
                                                payload: selectedEvent,
                                            });
                                            setShowEventModal(false);
                                        }
                                    }}
                                    className="px-4 py-2 rounded text-sm border flex-1"
                                    style={{
                                        backgroundColor: 'hsl(0, 75%, 95%)',
                                        borderColor: 'hsl(0, 75%, 30%)',
                                        color: 'hsl(0, 75%, 10%)',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'hsl(0, 75%, 90%)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'hsl(0, 75%, 95%)'}
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
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'hsl(150, 80%, 90%)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'hsl(150, 80%, 95%)'}
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
