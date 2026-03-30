import {type FormField } from "../../types/formFieldType";
export const leaveFields: FormField[] = [
  {
    name: "type",
    label: "Leave Type",
    type: "select",
    required: true,
    options: [
      { label: "Sick Leave", value: "sick" },
      { label: "Casual Leave", value: "casual" },
      { label: "Medical Leave", value: "medical" },
    ],
  },
  { name: "startDate", label: "Start Date", type: "date", required: true },
  { name: "endDate", label: "End Date", type: "date", required: true },
  { name: "reason", label: "Reason", type: "textarea", placeholder: "Explain why...", required: true },
  { name: "documents", label: "Supporting Docs", type: "file" },
];