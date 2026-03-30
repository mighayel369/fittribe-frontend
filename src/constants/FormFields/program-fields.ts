
export const PROGRAM_FIELDS = [
  {
    name: "name",
    label: "Program Name",
    type: "text" as const,
    placeholder: "e.g., Advanced Yoga Flow",
    required: true,
  },
  {
    name: "description",
    label: "Program Description",
    type: "textarea" as const,
    placeholder: "Describe the benefits and goals of this program...",
    rows: 4,
    required: true,
  },
  {
    name: "programPic",
    label: "Cover Image",
    type: "file" as const,
    required: true,
  },
];