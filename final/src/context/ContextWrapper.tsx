import React, { useState, useEffect, useReducer, useMemo } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

// Define the shape of the event
interface Event {
    id: string;
    label: string;
    [key: string]: any; // Allow for additional properties
}

// Define the shape of the label
interface Label {
    label: string;
    checked: boolean;
}

// Define the shape of the action
type Action =
    | { type: "push"; payload: Event }
    | { type: "update"; payload: Event }
    | { type: "delete"; payload: Event };

    // Define the reducer
function savedEventsReducer(state: Event[], action: Action): Event[] {
    switch (action.type) {
        case "push":
            return [...state, action.payload];
        case "update":
            return state.map((evt) =>
                evt.id === action.payload.id ? action.payload : evt
            );
        case "delete":
            return state.filter((evt) => evt.id !== action.payload.id);
        default:
            throw new Error("Unsupported action type");
    }
}

// Define the initial state from local storage
function initEvents(): Event[] {
    const storageEvents = localStorage.getItem("savedEvents");
    const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
    return parsedEvents;
}

// Define the ContextWrapper component for global context to be used for children 
export default function ContextWrapper(props: { children: React.ReactNode }) {
    const [monthIndex, setMonthIndex] = useState<number>(dayjs().month()); //track month
    const [smallCalendarMonth, setSmallCalendarMonth] = useState<number | null>(null); //track month selected
    const [daySelected, setDaySelected] = useState<dayjs.Dayjs>(dayjs()); //track day selected
    const [showEventModal, setShowEventModal] = useState<boolean>(false); //track event modal
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); //
    const [labels, setLabels] = useState<Label[]>([]); //track labels
    const [savedEvents, dispatchedCalEvent] = useReducer(savedEventsReducer, [], initEvents); //track events with reducer

    //filter events based on label
    const filteredEvents = useMemo(() => {
        return savedEvents.filter((evt) =>
            labels
                .filter((lbl) => lbl.checked) // Only include events with checked labels
                .map((lbl) => lbl.label) //
                .includes(evt.label) // Only include events with checked labels
        );
    }, [savedEvents, labels]);

    //
    useEffect(() => {
        localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
    }, [savedEvents]);

    //update labels based on saved events
    useEffect(() => {
        setLabels((prevLabels) => {
            return [...new Set(savedEvents.map((evt) => evt.label))].map(
                (label) => {
                    const currentLabel = prevLabels.find((lbl) => lbl.label === label);
                    return {
                        label,
                        checked: currentLabel ? currentLabel.checked : true,
                    };
                }
            );
        });
    }, [savedEvents]);

    //match monthIndex with smallCalendarMonth
    useEffect(() => {
        if (smallCalendarMonth !== null) {
            setMonthIndex(smallCalendarMonth);
        }
    }, [smallCalendarMonth]);

    //  reset selected event if showEventModal is false
    useEffect(() => {
        if (!showEventModal) {
            setSelectedEvent(null);
        }
    }, [showEventModal]);

    //update label
    function updateLabel(label: Label) {
        setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
    }

    return (
        // Pass the context values to the children
        <GlobalContext.Provider
            value={{
                monthIndex,
                setMonthIndex,
                smallCalendarMonth,
                setSmallCalendarMonth,
                daySelected,
                setDaySelected,
                showEventModal,
                setShowEventModal,
                dispatchedCalEvent,
                selectedEvent,
                setSelectedEvent,
                savedEvents,
                setLabels,
                labels,
                updateLabel,
                filteredEvents,
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
}
