// this file has some shared functions i want to use across different components

import dayjs from 'dayjs'

// this function contains an array for each day of the calender
// it will be like a two-dimensional array
export function getMonth(month = dayjs().month()) {
//dayjs is the default value, if nothing is passed it will be the present moment 

    const year = dayjs().year() //represents the current year

    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day() 
    //creates a new js object that represents the first date of the month

    let currentMonthCount = 0 - firstDayOfTheMonth  //creating a counter 
    //if there was a negative value it will focus on the month before or day before

    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            //creating the two dimensions, 5 rows and 7 columns
            currentMonthCount++
            return dayjs(new Date(year, month, currentMonthCount))
        })
    })
    return daysMatrix
}
