import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { useEffect, useState, useRef } from "react";
import { FaPlus, FaClock } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import Toast from "../../components/Toast";
import { generateTimes } from "../../helperFunctions/generateTimes";
import TimePicker from "../../components/TimePicker";
import { TrainerScheduleService } from "../../services/trainer/trainer.schedule";
import { formatTime } from "../../utils/formatTime";
import { type TimeRange } from "../../types/slotType";
import { validateUpdateAvailability } from "../../validations/updateSlotValidation";

const daysMap = [
  { label: "Sun", key: "sunday" },
  { label: "Mon", key: "monday" },
  { label: "Tue", key: "tuesday" },
  { label: "Wed", key: "wednesday" },
  { label: "Thu", key: "thursday" },
  { label: "Fri", key: "friday" },
  { label: "Sat", key: "saturday" }
] as const;

type dayKey = typeof daysMap[number]["key"];


interface BackendDaySchedule {
  enabled: boolean;
  slots: TimeRange[];
}

type WeeklyAvailability = Record<dayKey, BackendDaySchedule>;

const TrainerAvailability = () => {
  const times = generateTimes();
  const isInitialLoad = useRef(true);

  const [openPicker, setOpenPicker] = useState<{
    day: string | null;
    type: "start" | "end" | null;
    index: number | null;
  }>({ day: null, type: null, index: null });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");


  const [availability, setAvailability] = useState<WeeklyAvailability>({
    sunday: { enabled: false, slots: [] },
    monday: { enabled: false, slots: [] },
    tuesday: { enabled: false, slots: [] },
    wednesday: { enabled: false, slots: [] },
    thursday: { enabled: false, slots: [] },
    friday: { enabled: false, slots: [] },
    saturday: { enabled: false, slots: [] }
  });

  useEffect(() => {
    document.title = "FitTribe | Schedules";
    async function fetchSlot() {
      try {
        const res = await TrainerScheduleService.getSchedule();
        if (res.data?.weeklyAvailability) {
          setAvailability(res.data.weeklyAvailability);
        }
      } catch (err: any) {
        const errMesg = err.message || "Failed to load schedule";
        setToastType("error");
        setToastMessage(errMesg);
      } finally {
        setTimeout(() => { isInitialLoad.current = false; }, 100);
      }
    }
    fetchSlot();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;
    const timer = setTimeout(async () => {
      try {
        const res = await TrainerScheduleService.syncWeeklyTemplate(availability);
        setToastType("success");
        setToastMessage(res.message || "Schedule updated successfully");
      } catch (err: any) {
        const errMesg = err.message || "Sync failed";
        setToastType("error");
        setToastMessage(errMesg);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [availability]);

  const updateTime = (day: dayKey, index: number, type: "start" | "end", value: number) => {
    const arrayFormatAvailability = Object.fromEntries(
      Object.entries(availability).map(([k, v]) => [k, v.slots])
    ) as Record<dayKey, TimeRange[]>;

    const validationError = validateUpdateAvailability(arrayFormatAvailability, day, index, type, value);

    if (validationError) {
      setToastType("error");
      setToastMessage(validationError);
      return;
    }

    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [type]: value } : slot
        )
      }
    }));
  };

  const addSlot = (day: dayKey) => {
    setAvailability(prev => {
      const currentDaySlots = prev[day]?.slots || [];

      let newStart = 560;
      let newEnd = 600;

      if (currentDaySlots.length > 0) {
        const lastSlot = currentDaySlots[currentDaySlots.length - 1];
        newStart = lastSlot.end;
        newEnd = newStart + 60;
      }

      if (newStart >= 1440) {
        setToastType("error");
        setToastMessage("Cannot add more slots. The day schedule boundary has been reached.");
        return prev;
      }

      if (newEnd > 1440) {
        newEnd = 1440;
      }

      return {
        ...prev,
        [day]: {
          enabled: true,
          slots: [...currentDaySlots, { start: newStart, end: newEnd }]
        }
      };
    });
  };

  const removeSlot = (day: dayKey, index: number) => {
    setAvailability(prev => {
      const filteredSlots = prev[day].slots.filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: {
          enabled: filteredSlots.length > 0,
          slots: filteredSlots
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerTopBar />
      <TrainerSideBar />

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}

      <main className="ml-72 pt-24 px-10">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Schedules</h1>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10 space-y-8">
          <div className="flex items-center gap-3 text-gray-700">
            <FaClock className="text-emerald-600 text-xl mb-4" />
            <div>
              <h2 className="text-md font-bold">Weekly Hours</h2>
              <p className="text-sm text-gray-500">
                Set your available time slots for each day. Changes save automatically.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {daysMap.map(({ label, key }) => (
              <div key={key} className="flex gap-6 text-xs items-start border-b border-gray-50 pb-4 last:border-0">
                <span className="w-10 h-6 flex items-center justify-center bg-emerald-600 text-white rounded-full font-semibold mt-1">
                  {label}
                </span>

                <div className="flex flex-col gap-3">
                  {availability[key]?.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          onClick={() => setOpenPicker(
                            openPicker.day === key && openPicker.type === "start" && openPicker.index === index
                              ? { day: null, type: null, index: null }
                              : { day: key, type: "start", index }
                          )}
                          className={`w-24 text-center p-2 rounded-md cursor-pointer border transition-colors ${openPicker.day === key && openPicker.type === "start" && openPicker.index === index
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-400"
                            }`}
                        >
                          {formatTime(slot.start)}
                        </div>
                        {openPicker.day === key && openPicker.type === "start" && openPicker.index === index && (
                          <TimePicker
                            times={times}
                            selectedTime={slot.start}
                            onSelect={(time) => {
                              updateTime(key, index, "start", time);
                              setOpenPicker({ day: null, type: null, index: null });
                            }}
                          />
                        )}
                      </div>

                      <span className="w-2 h-[1px] bg-gray-400" />

                      <div className="relative">
                        <div
                          onClick={() => setOpenPicker(
                            openPicker.day === key && openPicker.type === "end" && openPicker.index === index
                              ? { day: null, type: null, index: null }
                              : { day: key, type: "end", index }
                          )}
                          className={`w-24 text-center p-2 rounded-md cursor-pointer border transition-colors ${openPicker.day === key && openPicker.type === "end" && openPicker.index === index
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-400"
                            }`}
                        >
                          {formatTime(slot.end)}
                        </div>
                        {openPicker.day === key && openPicker.type === "end" && openPicker.index === index && (
                          <TimePicker
                            times={times}
                            selectedTime={slot.end}
                            onSelect={(time) => {
                              updateTime(key, index, "end", time);
                              setOpenPicker({ day: null, type: null, index: null });
                            }}
                          />
                        )}
                      </div>

                      <button
                        onClick={() => removeSlot(key, index)}
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <HiOutlineX size={18} />
                      </button>

                      <button
                        onClick={() => addSlot(key)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  ))}

                  {/* FIX: Conditional display checks length of nested slots array */}
                  {(!availability[key] || availability[key].slots.length === 0) && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => addSlot(key)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <FaPlus size={12} />
                      </button>
                      <p className="text-gray-400 italic">Unavailable</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerAvailability;