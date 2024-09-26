import { useContext } from 'react';
import GlobalContext from '../context/GlobalContext';
import dayjs from 'dayjs';


//this is the type for global context
//current month and function to update it
type GlobalContextType = {
    monthIndex: number;
    setMonthIndex: (index: number) => void;
};


//this is for the navigation of months
export default function CalenderHeader() {

    //grabs current month and function to update it
    const { monthIndex, setMonthIndex } = 
    useContext(GlobalContext) as GlobalContextType;

    //moves to previous month
    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
    }


       
    function handleNextMonth() {
        setMonthIndex(monthIndex + 1);
    }
    //resets to current month
    function handleReset() {
        setMonthIndex(dayjs().month());
    }

    //returns the header
    //buttons and title
    //buttons to move to next and previous month
    return (
        <header className="px-4 py-2 flex items-center pl-40 pt-10">
            <button onClick={handleReset} 
            className="border rounded py-2 px-4 mr-5">
                Today
            </button>
            <button onClick={handlePrevMonth}>
                <span 
                className=
                "material-icons-outlined cursor-pointer text-gray-600 mx-2">
                    chevron_left
                </span>
            </button>
            <button onClick={handleNextMonth}>
                <span 
                className=
                "material-icons-outlined cursor-pointer text-gray-600 mx-2">
                    chevron_right
                </span>
            </button>
            <h2 
            className=
            "ml-4 text-xl text-black-500 font-bold">
                {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
            </h2>
        </header>
    );
}
