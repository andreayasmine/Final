import { useContext, useState, useEffect, useRef, MouseEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import GlobalContext from '../context/GlobalContext';
import OverflowModal from './OverflowModal';

// Define the shape of the event
type Event = {
    title: string;
    day: string;
    label: string;
    isAllDay: boolean;
    startTime?: string | null | undefined;
};

// Define the props for the Day component
type DayProps = {
    day: Dayjs;
    rowIdx: number;
    currentMonth: number;
};

// Define the types for global  context properties
type GlobalContextType = {
    setDaySelected: (day: Dayjs) => void;
    setShowEventModal: (show: boolean) => void;
    filteredEvents: Event[];
    setSelectedEvent: (event: Event) => void;
};


// Define the Day component
export default function Day({ day, rowIdx, currentMonth }: DayProps) {
    const [dayEvents, setDayEvents] = useState<Event[]>([]);
    const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
    const [overflowEvents, setOverflowEvents] = useState<Event[]>([]);
    const [showOverflowModal, setShowOverflowModal] = useState(false);
    const dayContainerRef = useRef<HTMLDivElement | null>(null);

    //
    const {
        setDaySelected,
        setShowEventModal,
        filteredEvents,
        setSelectedEvent,
    } = useContext(GlobalContext) as GlobalContextType;

    //filter events based on day and sort them
    useEffect(() => {
        const events = filteredEvents.filter(
            (evt) => dayjs(evt.day).format('DD-MM-YY') === day.format('DD-MM-YY')
        );

        events.sort((a, b) => {
            if (a.isAllDay && !b.isAllDay) return -1;
            if (!a.isAllDay && b.isAllDay) return 1;
            return 0;
        });

        setDayEvents(events);
        calculateVisibleEvents(events);
    }, [filteredEvents, day]);

    //calculate visible events
    const calculateVisibleEvents = (events: Event[]) => {
        const maxVisible = 2; // Maximum number of visible events before showing "+ More"
        const visible = events.filter((evt) => !evt.startTime).slice(0, maxVisible);
        const overflow = events.filter((evt) => !evt.startTime).slice(maxVisible);

        setVisibleEvents(visible);
        setOverflowEvents(overflow);
    };

    //add event on click
    const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDaySelected(day);
        setShowEventModal(true);
    };

    
    return (
        <div
            className={`border border-gray-200 flex flex-col w-full h-32 group relative ${
                day.month() === currentMonth ? 'bg-white' : 'bg-gray-100'
            }`}
            ref={dayContainerRef}
        >
            {/*Day Header with day of week */}
            <header className="flex flex-col items-center justify-center relative h-12">
                {rowIdx === 0 && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {day.format('ddd')}
                    </p>
                )}
                {/* Current Day Highlight */}
                <p
                    className={`text-sm ${
                        dayjs().isSame(day, 'day')
                            ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center'
                            : ''
                    } ${dayjs(day).isBefore(dayjs(), 'day') ? 'text-gray-400' : ''}`}
                    style={{
                        backgroundColor: dayjs().isSame(day, 'day')
                            ? 'hsl(200, 80%, 50%)'
                            : 'transparent',
                    }}
                >
                    {day.format('DD')}
                </p>
                {/* Add Event Button  */}
                <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out absolute top-1 right-1"
                    onClick={handleAddClick}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-gray-500"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </header>
            {/* Event list */}
            <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                    setDaySelected(day);
                    setShowEventModal(true);
                }}
            >
                <div className="overflow-hidden">
                    {visibleEvents.map((evt, idx) => (
                        <div
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt);
                                setShowEventModal(true);
                            }}
                            className={`p-1 text-sm rounded mb-1 truncate ${
                                dayjs(day).isBefore(dayjs(), 'day') ? 'opacity-50' : ''
                            }`}
                            style={{ backgroundColor: evt.label, color: 'white' }}
                        >
                            {evt.title}
                        </div>
                    ))}
                    {/* button for showing more events if there are overflow events */}
                    {overflowEvents.length > 0 && (
                        <div className="flex justify-center mt-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowOverflowModal(true);
                                }}
                                className="text-black-500 text-xs"
                            >
                                +{overflowEvents.length} More
                            </button>
                        </div>
                    )}
                    {/* bullet points if there are events */}
                    {dayEvents.some((evt) => evt.startTime) && (
                        <ul className="mt-2 list-none text-xs">
                            {dayEvents
                                .filter((evt) => evt.startTime)
                                .map((evt, idx) => {
                                    const [hour, minute] = evt.startTime!.split(':');
                                    const period = parseInt(hour, 10) >= 12 ? 'PM' : 'AM';
                                    const formattedHour = parseInt(hour, 10) % 12 || 12; // Convert to 12-hour format

                                    return (
                                        <li
                                            key={`bullet-${idx}`}
                                            style={{
                                                position: 'relative',
                                                paddingLeft: '20px',
                                                color: dayjs(day).isBefore(dayjs(), 'day')
                                                    ? 'rgba(119, 119, 119, 0.7)'
                                                    : '#777',
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedEvent(evt);
                                                setShowEventModal(true);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {/*  */}
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    top: '0',
                                                    color: dayjs(day).isBefore(dayjs(), 'day')
                                                        ? `rgba(${parseInt(
                                                              evt.label.split(',')[0].match(/\d+/)![0]
                                                          )}, ${parseInt(
                                                              evt.label.split(',')[1].match(/\d+/)![0]
                                                          )}, ${parseInt(
                                                              evt.label.split(',')[2].match(/\d+/)![0]
                                                          )}, 0.7)`
                                                        : evt.label,
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                •
                                            </span>
                                            {`${formattedHour}:${minute} ${period}`} - {evt.title}
                                        </li>
                                    );
                                })}
                        </ul>
                    )}
                </div>
            </div>
            {/* Overflow Modal */}
            {showOverflowModal && (
                <OverflowModal
                    events={dayEvents.filter((evt) => !evt.startTime)}
                    daySelected={day}
                    onClose={() => setShowOverflowModal(false)}
                    onSelectEvent={(evt) => {
                        setSelectedEvent(evt);
                        setShowEventModal(true);
                    }}
                />
            )}
        </div>
    );
}
