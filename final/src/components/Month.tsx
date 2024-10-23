import React from "react";
import Day from "./Day";
import { Dayjs } from "dayjs";
import { useGlobalContext } from '../context/GlobalContext';

// Define the props for the Month component (month is a 2D array)
type MonthProps = {
    month: Dayjs[][];
};

// Define the Month component
export default function Month({ month }: MonthProps) {
    // Get monthIndex from GlobalContext
    const { monthIndex } = useGlobalContext();

    // Dynamically determine the number of rows based on the month length
    const rowCount = month.length;

    return (
        <div className={`flex-1 grid grid-cols-7 grid-rows-${rowCount} h-[90vh] max-h-full`}>
            {/* Calendar container, 7 columns for days of the week, dynamic rows for weeks */}
            {month.map((row, i) => (
                <React.Fragment key={i}>
                    {row.map((day, idx) => (
                        <Day day={day} key={idx} rowIdx={i} currentMonth={monthIndex} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
}
