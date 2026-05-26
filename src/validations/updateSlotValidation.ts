
import { type TimeRange } from "../types/slotType";

type WeeklyAvailability = Record<string, TimeRange[]>;

export const validateUpdateAvailability = (
  data: WeeklyAvailability,
  dayName: string,
  index: number,
  type: "start" | "end",
  newValue: number
): string | null => {
  const slots = data[dayName].map((slot, i) => {
    if (i === index) {
      return { ...slot, [type]: newValue };
    }
    return slot;
  });

  const targetSlot = slots[index];
  if (targetSlot.start >= targetSlot.end) {
    return "End time must be after start time.";
  }

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const slotA = slots[i];
      const slotB = slots[j];

      if (slotA.start < slotB.end && slotB.start < slotA.end) {
        return "This time range overlaps with an existing slot.";
      }
    }
  }

  return null; 
};