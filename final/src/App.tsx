import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { getMonth } from './util';
import CalenderHeader from './components/CalenderHeader';
import Month from './components/Month';
import GlobalContext from './context/GlobalContext';
import EventModal from './components/EventModal';
import dayjs from 'dayjs'; // Import dayjs

// Define the App component
const App: React.FC = () => {
  //initialize state for month 
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs[][]>(getMonth()); // getMonth() assumed to return 2D array of dayjs objects
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  //update state when monthIndex changes
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />} {/* if true, display the modal */}
      <div className="min-h-screen w-full max-w-custom mx-auto">
        <CalenderHeader />
        {/* Calendar container for navigation */}
        <div className="flex flex-1">
          {/* Calendar container, 7 columns for days of weekm 5 rows for weeks  */}
          <Month month={currentMonth} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
