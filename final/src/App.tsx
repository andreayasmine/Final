import React, { useState, useEffect } from 'react';
import './App.css';
import { getMonth } from './util';
import CalenderHeader from './components/CalenderHeader';
import Month from './components/Month';
import EventModal from './components/EventModal';
import { useGlobalContext } from './context/GlobalContext';
import dayjs from 'dayjs'; // Import dayjs

const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs[][]>(getMonth());
  const { monthIndex, showEventModal } = useGlobalContext();

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />} {/* Display EventModal when true */}
      <div className="min-h-screen h-screen w-full max-w-[1500px] mx-auto flex flex-col px-0 sm:px-[50px] lg:px-[200px]">
        <CalenderHeader />
        <div className="flex flex flex-col overflow-hidden h-full">
          <Month month={currentMonth} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
  