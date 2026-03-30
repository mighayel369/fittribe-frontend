import { useState } from "react";

type CalendarProps = {
  selectDate: (date: Date) => void;
  selectedDate: Date;
};

const Calendar: React.FC<CalendarProps> = ({ selectDate, selectedDate }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);

  const goPrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
  };

  const goNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
  };

  const isDateSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  return (
    <div className="select-none">
      <div className="flex justify-between items-center mb-5">
        <button 
          onClick={goPrevMonth} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-600"
        >
          &lt;
        </button>
        <h2 className="text-lg font-black uppercase tracking-tight text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button 
          onClick={goNextMonth} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-600"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {daysArray.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;

          const cellDate = new Date(currentYear, currentMonth, day);
          cellDate.setHours(0, 0, 0, 0);

          const isPastDate = cellDate < today;
          const isSelected = isDateSelected(day);

          return (
            <div
              key={day}
              className={`
                p-3 rounded-xl text-xs font-bold transition-all duration-200 border
                ${isSelected 
                  ? "bg-red-600 text-white border-red-600 shadow-md scale-105" 
                  : "border-transparent"}
                ${isPastDate 
                  ? "text-gray-200 cursor-not-allowed" 
                  : ""}
                ${!isSelected  && !isPastDate 
                  ? "text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer" 
                  : ""}
              `}
              onClick={() => {
                if (!isPastDate) {
                  selectDate(cellDate);
                }
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;