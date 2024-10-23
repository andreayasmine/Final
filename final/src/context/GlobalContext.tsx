import React, { createContext, useContext, useReducer, useState } from 'react';
import dayjs from 'dayjs';

// Define the shape of the CalendarEvent
export interface CalendarEvent {
  id: string; // Ensure that id is a string
  title: string;
  label: string;
  startTime: string | null;
  endTime: string | null;
  isAllDay: boolean;
}

// Define the shape of the context
export interface GlobalContextType {
  monthIndex: number;
  setMonthIndex: (index: number) => void;
  daySelected: dayjs.Dayjs | null;
  setDaySelected: (day: dayjs.Dayjs) => void;
  showEventModal: boolean;
  setShowEventModal: (show: boolean) => void;
  dispatchedCalEvent: (action: { type: string; payload: CalendarEvent }) => void; // Use CalendarEvent type here
  savedEvents: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
}

// Define the actions for the event reducer
type EventAction = 
  | { type: 'push'; payload: CalendarEvent }
  | { type: 'update'; payload: CalendarEvent }
  | { type: 'delete'; payload: CalendarEvent };

// Create the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
};

// Event reducer function to handle push, update, and delete actions
const eventReducer = (state: CalendarEvent[], action: EventAction): CalendarEvent[] => {
  switch (action.type) {
    case 'push':
      return [...state, action.payload];
    case 'update':
      return state.map(evt => evt.id === action.payload.id ? action.payload : evt);
    case 'delete':
      return state.filter(evt => evt.id !== action.payload.id);
    default:
      console.error(`Unknown action type: ${action.type}`);
      return state;  // Avoid crashing, just return the current state
  }
};

// Sample context provider
const GlobalContextProvider: React.FC = ({ children }) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [daySelected, setDaySelected] = useState<dayjs.Dayjs | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [savedEvents, dispatchedCalEvent] = useReducer(eventReducer, []); // Initialized with an empty array

  // Safety check: Log any state-changing actions to help debug
  console.log('Current savedEvents:', savedEvents);
  
  const value = {
    monthIndex,
    setMonthIndex,
    daySelected,
    setDaySelected,
    showEventModal,
    setShowEventModal,
    selectedEvent,
    setSelectedEvent,
    dispatchedCalEvent, // Event dispatching function now handles event actions
    savedEvents,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export default GlobalContext;
