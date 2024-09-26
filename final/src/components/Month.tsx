import React from "react";
import Day from "./Day";
import { Dayjs } from "dayjs";

// Define the props for the Month component month is 2d array
type MonthProps = {
    month: Dayjs[][];
};

// Define the Month component
export default function Month({ month }: MonthProps) {

    const currentMonth = month[2][0].month(); // Get the current month based on the middle row

    return (
        <div className="flex-1 grid grid-cols-7 grid-rows-5 pl-40 pr-40 pb-40 pt-0"> 
        {/* Calendar container, 7 columns for days of weekm 5 rows for weeks  */}
            {month.map((row, i) => (
                <React.Fragment key={i}>
                    {row.map((day, idx) => (
                        <Day day={day} key={idx} rowIdx={i} currentMonth={currentMonth} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
}
