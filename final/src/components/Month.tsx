import React from "react";
import Day from "./Day";
import { Dayjs } from "dayjs";

type MonthProps = {
    month: Dayjs[][];
};

export default function Month({ month }: MonthProps) {
    const currentMonth = month[2][0].month(); // Get the current month based on the middle row

    return (
        <div className="flex-1 grid grid-cols-7 grid-rows-5 pl-40 pr-40 pb-40 pt-0"> {/* Calendar container */}
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
