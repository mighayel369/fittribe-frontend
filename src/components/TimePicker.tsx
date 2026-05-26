import { useEffect, useRef } from "react";
import { formatTime } from "../utils/formatTime";

interface Props {
  times: number[];
  selectedTime: number;
  onSelect: (time: number) => void;
}

const TimePicker = ({ times, selectedTime, onSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = times.indexOf(selectedTime);
    if (containerRef.current && index !== -1) {
      const itemHeight = 36; 
      containerRef.current.scrollTop = Math.max(
        0,
        index * itemHeight - itemHeight * 2
      );
    }
  }, [selectedTime, times]);

  return (
    <div
      ref={containerRef}
      className="
        absolute z-50 mt-2
        bg-white shadow-lg rounded-md
        max-h-[150px] overflow-y-auto
       border w-32  text-xs
      "
    >
      {times.map((time) => (
        <div
          key={time}
          onClick={() => onSelect(time)}
          className={`
            px-3 py-2 text-left cursor-pointer
            ${
              time === selectedTime
                ? "bg-emerald-600 text-white font-semibold"
                : "hover:bg-emerald-100"
            }
          `}
        >
          {formatTime(time)}
        </div>
      ))}
    </div>
  );
};

export default TimePicker;
