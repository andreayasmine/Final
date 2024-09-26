import React from 'react';
import dayjs from 'dayjs';

// Define the types for context properties
interface GlobalContextType {
    monthIndex: number;
    setMonthIndex: (index: number) => void;
    daySelected: dayjs.Dayjs | null;
    setDaySelected: (day: dayjs.Dayjs) => void;
    showEventModal: boolean;
    setShowEventModal: (show: boolean) => void;
    dispatchedCalEvent: (action: { type: string; payload: any }) => void; // Type for the dispatcher function
    savedEvents: any[]; // Define a more specific type if you know the structure of events
    selectedEvent: any | null; // Define a more specific type for events
    setSelectedEvent: (event: any | null) => void;
    labels?: Array<{ label: string; checked: boolean }>; // Optional labels property
    setLabels?: (labels: Array<{ label: string; checked: boolean }>) => void; // Optional setLabels function
    updateLabel?: (label: { label: string; checked: boolean }) => void; // Optional updateLabel function
    filteredEvents?: any[]; // Optional filteredEvents property
}

// Create the context with default values
const GlobalContext = React.createContext<GlobalContextType>({
    monthIndex: 0,// default value for monthIndex
    setMonthIndex: () => {},// default value for setMonthIndex
    daySelected: null,// default value for daySelected
    setDaySelected: () => {},// default value for setDaySelected
    showEventModal: false,// default value for showEventModal
    setShowEventModal: () => {},// default value for setShowEventModal
    dispatchedCalEvent: () => {},// default value for dispatchedCalEvent
    savedEvents: [], //default empty array for savedEvents
    selectedEvent: null, //default null for selectedEvent
    setSelectedEvent: () => {}, //default value for setSelectedEvent
});

export default GlobalContext;
