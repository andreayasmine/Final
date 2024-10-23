import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useGlobalContext } from '../context/GlobalContext';
import OverflowModal from './OverflowModal';
import { CSSTransition } from 'react-transition-group';

type Event = {
    title: string;
    label: string;
    isAllDay: boolean;
    startTime?: string | null;
    day: string;  // Assuming that each event has a `day` field to compare
};

type DayProps = {
    day: Dayjs;
    rowIdx: number;
    currentMonth: number;
};

export default function Day({ day, rowIdx, currentMonth }: DayProps) {
    const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
    const [overflowEvents, setOverflowEvents] = useState<Event[]>([]);
    const [showOverflowModal, setShowOverflowModal] = useState(false);
    const eventContainerRef = useRef<HTMLDivElement>(null);

    const { setDaySelected, setShowEventModal, filteredEvents, setSelectedEvent } = useGlobalContext();

    // Filter and sort events without storing derived state
    const dayEvents = useMemo(() => {
        const events = filteredEvents.filter(
            (evt) => dayjs(evt.day).format('DD-MM-YY') === day.format('DD-MM-YY')
        );

        // Sort events by all-day first and then by start time
        return events.sort((a, b) => {
            if (a.isAllDay && !b.isAllDay) return -1;
            if (!a.isAllDay && b.isAllDay) return 1;

            if (!a.isAllDay && !b.isAllDay) {
                const aTime = a.startTime
                    ? dayjs(`${day.format('YYYY-MM-DD')} ${a.startTime}`, 'YYYY-MM-DD h:mm A')
                    : dayjs();
                const bTime = b.startTime
                    ? dayjs(`${day.format('YYYY-MM-DD')} ${b.startTime}`, 'YYYY-MM-DD h:mm A')
                    : dayjs();

                return aTime.isBefore(bTime) ? -1 : 1;
            }
            return 0;
        });
    }, [filteredEvents, day]);

    // Function to calculate visible and overflow events
    const calculateVisibleAndOverflowEvents = useCallback(() => {
        if (eventContainerRef.current) {
            let containerHeight = eventContainerRef.current.clientHeight;

            const eventElements = eventContainerRef.current.querySelectorAll('.event-class');
            const eventHeight = eventElements.length > 0 ? eventElements[0].clientHeight : 24;

            if (rowIdx === 0) {
                containerHeight -= 16; // Adjust for top row if needed
            }

            const moreButtonHeight = 25;  // Height of the "+more" button
            let maxVisibleEvents = Math.floor((containerHeight - moreButtonHeight) / eventHeight);

            // Separate all-day and timed events
            const allDayEvents = dayEvents.filter((evt) => evt.isAllDay);
            const timedEvents = dayEvents.filter((evt) => !evt.isAllDay);

            // Determine visible events
            if (allDayEvents.length + timedEvents.length <= maxVisibleEvents) {
                setVisibleEvents([...allDayEvents, ...timedEvents]);
                setOverflowEvents([]);
            } else {
                let visibleAllDayCount = Math.min(allDayEvents.length, maxVisibleEvents);
                let visibleTimedCount = Math.max(0, maxVisibleEvents - visibleAllDayCount);

                let potentialVisibleAllDays = allDayEvents.slice(0, visibleAllDayCount);

                // Adjust if all-day events exceed space
                if (visibleAllDayCount === allDayEvents.length) {
                    const totalHeight = visibleAllDayCount * eventHeight;
                    if (totalHeight + moreButtonHeight > containerHeight) {
                        visibleAllDayCount -= 1;
                    }
                }

                const visibleAllDays = potentialVisibleAllDays.slice(0, visibleAllDayCount);
                const visibleTimed = timedEvents.slice(0, visibleTimedCount);
                setVisibleEvents([...visibleAllDays, ...visibleTimed]);

                const remaining = [
                    ...allDayEvents.slice(visibleAllDayCount),
                    ...timedEvents.slice(visibleTimedCount)
                ];
                setOverflowEvents(remaining);
            }
        }
    }, [dayEvents, rowIdx]);

    useEffect(() => {
        calculateVisibleAndOverflowEvents();
    }, [calculateVisibleAndOverflowEvents]);

    // Debounced resize event handler with 100ms delay
    useEffect(() => {
        let resizeTimer: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                calculateVisibleAndOverflowEvents();
            }, 100);  // 100ms debounce delay
        };

        window.addEventListener('resize', handleResize);

        // Clean up the resize event listener
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, [calculateVisibleAndOverflowEvents]);

    const handleDayClick = (): void => {
        setDaySelected(day);
        setShowEventModal(true);
    };

    const isPastDay = dayjs(day).isBefore(dayjs(), 'day');

    return (
        <div
            className={`border border-gray-200 flex flex-col w-full h-full group relative ${
                day.month() === currentMonth ? 'bg-white' : 'bg-gray-100'
            }`}
            onClick={handleDayClick}
        >
            <header className="flex flex-col items-center relative">
                {rowIdx === 0 && (
                    <p
                        className="text-xs text-gray-500 uppercase tracking-wide"
                        style={{ fontSize: '0.65rem', marginBottom: '10px' }}
                    >
                        {day.format('ddd')}
                    </p>
                )}
                <p
                    className={`${
                        dayjs().isSame(day, 'day')
                            ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center'
                            : ''
                    } ${isPastDay ? 'text-gray-400' : ''}`}
                    style={{
                        marginTop: '0',
                        fontSize: '0.70rem',
                        position: 'relative',
                        top: rowIdx === 0 ? '-10px' : '0',
                    }}
                >
                    {day.format('DD')}
                </p>
            </header>

            {/* All-day events container */}
            {visibleEvents.some((evt) => evt.isAllDay) && (
                <div
                    className="all-day-events-container"
                    style={{
                        minHeight: '0px',
                        marginBottom: '0px',
                        marginTop: '4px',
                    }}
                >
                    {visibleEvents
                        .filter((evt) => evt.isAllDay)
                        .map((evt, idx) => (
                            <div
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(evt);
                                    setDaySelected(day);
                                    setShowEventModal(true);
                                }}
                                className={`p-1 text-sm rounded mb-1 truncate event-class ${isPastDay ? 'opacity-50' : ''}`}
                                style={{
                                    backgroundColor: evt.label,
                                    color: 'white',
                                    lineHeight: '1.2',
                                    height: '24px',
                                }}
                            >
                                {evt.title}
                            </div>
                        ))}
                </div>
            )}

            {/* Timed events container */}
            <div
                className={`timed-events-container flex-1 flex flex-col justify-start overflow-hidden ${
                    !visibleEvents.some((evt) => evt.isAllDay) ? 'mt-2' : 'mt-1'
                }`}
                ref={eventContainerRef}
                style={{ position: 'relative', paddingBottom: '25px' }}
            >
                {visibleEvents
                    .filter((evt) => evt.startTime)
                    .map((evt, idx) => {
                        const time = evt.startTime
                            ? dayjs(`${day.format('YYYY-MM-DD')} ${evt.startTime}`, 'YYYY-MM-DD h:mm A')
                            : null;
                        const formattedTime = time ? time.format('h:mm A') : '';

                        return (
                            <li
                                key={`bullet-${idx}`}
                                style={{
                                    position: 'relative',
                                    paddingLeft: '20px',
                                    marginTop: rowIdx === 0 ? '4px' : '0px',
                                    fontSize: '0.700rem',
                                    listStyle: 'none',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(evt);
                                    setDaySelected(dayjs(evt.day));
                                    setShowEventModal(true);
                                }}
                                className={`cursor-pointer event-class ${isPastDay ? 'opacity-50' : ''}`}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: '0',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: evt.label,
                                        lineHeight: '1',
                                    }}
                                >
                                    •
                                </span>
                                {formattedTime && <span style={{ color: 'lightgray' }}>{formattedTime}</span>}
                                <span style={{ color: 'black' }}> - {evt.title}</span>
                            </li>
                        );
                    })}
            </div>

            {/* Overflow Button */}
            {overflowEvents.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowOverflowModal(true);
                        }}
                        className="text-[10px] text-black hover:text-gray-500 font-bold text-center w-full overflow-button"
                        style={{ 
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            opacity: isPastDay ? '0.5' : '1',
                        }}
                    >
                        +{overflowEvents.length} More
                    </button>
                </div>
            )}

            {/* Overflow Modal */}
            {showOverflowModal && (
                <OverflowModal
                    events={overflowEvents.concat(visibleEvents)}
                    daySelected={day}
                    onClose={() => setShowOverflowModal(false)}
                    onSelectEvent={(evt) => {
                        setShowOverflowModal(false);
                        setSelectedEvent(evt);
                        setShowEventModal(true);
                    }}
                />
            )}
        </div>
    );
}
