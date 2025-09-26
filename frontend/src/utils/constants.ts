import type {
  StylesConfig,
  CSSObjectWithLabel,
  ControlProps,
  OptionProps,
  GroupBase,
} from "react-select";
import type { Ticket } from "../types/ticket";

export type SelectOption = {
  label: string;
  value: string;
};

type IsMulti = false;

export const CUSTOM_SELECT_STYLES: StylesConfig<
  SelectOption,
  IsMulti,
  GroupBase<SelectOption>
> = {
  control: (
    base: CSSObjectWithLabel,
    state: ControlProps<SelectOption, IsMulti, GroupBase<SelectOption>>
  ) => ({
    ...base,
    fontSize: "14px",
    fontWeight: "400",
    color: state.isFocused ? "#FFFFFF" : "#FFFFFF",
    borderColor: state.isFocused ? "#B0B0B0" : "##B0B0B0",
    boxShadow: state.isFocused ? "0 0 0 1px #64728C" : base.boxShadow,
    "&:hover": {
      borderColor: state.isFocused ? "#64728C" : base.borderColor,
    },
    backgroundColor: "#12121C",
    paddingLeft: "10px",
  }),
  option: (
    base: CSSObjectWithLabel,
    state: OptionProps<SelectOption, IsMulti, GroupBase<SelectOption>>
  ) => ({
    ...base,
    color: state.isSelected ? "#64728C" : "#64728C",
    backgroundColor: state.isSelected ? "#e7e7e7" : "white",
    ":hover": {
      backgroundColor: state.isSelected ? "#ccc" : "#f3f3f3",
    },
    fontSize: "14px",
    fontWeight: "600",
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#FFFFFF",
  }),
  placeholder: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#bdbdbd",
  }),
};

export const CUSTOM_TABLE_STYLES = {
  header: {
    style: {
      backgroundColor: "#1A1925",
      color: "#fff",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#1A1925",
      color: "#fff",
      borderBottom: "1px solid #333",
    },
  },
  headCells: {
    style: {
      backgroundColor: "#1A1925",
      color: "#fff",
    },
  },
  rows: {
    style: {
      backgroundColor: "#1A1925",
      color: "#fff",
      "&:not(:last-of-type)": {
        borderBottom: "1px solid #333",
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: "#1A1925",
      color: "#fff",
    },
    pageButtonsStyle: {
      fill: "#fff",
      color: "#fff",
      "&:disabled": {
        fill: "#555",
        color: "#555",
      },
      "&:hover": {
        backgroundColor: "#111",
        fill: "#fff",
        color: "#fff",
      },
    },
  },
};

export const PRIORITY_COLORS: Record<Ticket["priority"], string> = {
  LOW: "bg-green-600 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  HIGH: "bg-red-600 text-white",
};

export const STATUS_COLORS: Record<Ticket["status"], string> = {
  OPEN: "bg-blue-600 text-white",
  IN_PROGRESS: "bg-orange-500 text-black",
  RESOLVED: "bg-emerald-600 text-white",
};

export const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export const STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
] as const;
