import { useGlobalContext } from '../context/GlobalContext';
import dayjs from 'dayjs';
import React from 'react'; // Make sure React is imported for type declarations

const CalenderHeader: React.FC = () => {
    const { monthIndex, setMonthIndex } = useGlobalContext();

    const handlePrevMonth = (): void => setMonthIndex(monthIndex - 1);
    const handleNextMonth = (): void => setMonthIndex(monthIndex + 1);
    const handleReset = (): void => setMonthIndex(dayjs().month());

    // Calculate the current month inline based on the monthIndex
    const currentMonth: string = dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY');

    return (
        <header className="calendar-header flex items-center justify-start">
            <button onClick={handleReset} className="border rounded py-2 px-4 mr-5 pb-2">
                Today
            </button>
            <button onClick={handlePrevMonth}>
                <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                    chevron_left
                </span>
            </button>
            <button onClick={handleNextMonth}>
                <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                    chevron_right
                </span>
            </button>
            <h2 className="ml-4 text-xl text-black-500 font-bold">
                {currentMonth}
            </h2>
        </header>
    );
};

export default CalenderHeader;
