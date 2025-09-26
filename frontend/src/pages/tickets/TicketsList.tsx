import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";

import { axiosClient } from "../../api/axiosClient";
import {
  CUSTOM_SELECT_STYLES,
  CUSTOM_TABLE_STYLES,
  PRIORITY_COLORS,
  STATUS_COLORS,
} from "../../utils/constants";
import { formatShortTime } from "../../utils/helpers";
import { EyeIcon } from "../../utils/icons";

import type { Ticket, TicketsResponse } from "../../types/ticket";

export default function TicketsList() {
  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All" },
      { value: "OPEN", label: "Open" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "RESOLVED", label: "Resolved" },
    ],
    []
  );

  useEffect(() => {
    setPage(1);
  }, [status, debouncedQ]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isPending } = useQuery<TicketsResponse, Error>({
    queryKey: ["tickets", { status, q: debouncedQ, page, perPage }],
    queryFn: async (): Promise<TicketsResponse> => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (debouncedQ) params.set("q", debouncedQ);
      params.set("page", String(page));
      params.set("limit", String(perPage));
      const res = await axiosClient.get<TicketsResponse>(
        `/tickets?${params.toString()}`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const TABLE_TICKETS_COLUMNS: TableColumn<Ticket>[] = [
    {
      name: "Ticket ID",
      selector: (row: Ticket) => row.id,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Title",
      selector: (row: Ticket) => row.title,
      compact: true,
      wrap: true,
    },
    {
      name: "Status",
      cell: (row: Ticket) => (
        <Badge className={STATUS_COLORS[row.status]}>{row.status}</Badge>
      ),
      compact: true,
      wrap: true,
      sortable: true,
      sortFunction: (a: Ticket, b: Ticket) => a.status.localeCompare(b.status),
    },
    {
      name: "Priority",
      cell: (row: Ticket) => (
        <Badge className={PRIORITY_COLORS[row.priority]}>{row.priority}</Badge>
      ),
      compact: true,
      wrap: true,
      sortable: true,
      sortFunction: (a: Ticket, b: Ticket) =>
        a.priority.localeCompare(b.priority),
    },
    {
      name: "Opened At",
      selector: (row: Ticket) => formatShortTime(row.created_at),
      compact: true,
      wrap: true,
    },
    {
      name: "Opened By",
      selector: (row: Ticket) => row.created_by_name,
      compact: true,
      wrap: true,
    },
    {
      name: "Assigned To",
      cell: (row: Ticket) =>
        row.assigned_to_name ? (
          row.assigned_to_name
        ) : (
          <div className="bg-white text-black p-1">
            <i>Not assigned</i>
          </div>
        ),
      compact: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row: Ticket) => (
        <Link to={`/ticket/${row.id}`} className="btn-primary !px-3 !py-2">
          <EyeIcon />
        </Link>
      ),
    },
  ];

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between">
        <h2 className="main-label">Tickets</h2>
        <Link
          to="/ticket/create"
          className="text-white flex justify-center items-center gap-2 min-w-[120px] md:min-w-[160px] bg-[#00A36C] rounded-[10px] text-sm md:text-base h-fit md:px-10 px-8 py-1.5 md:py-2 hover:bg-opacity-80 duration-300 transition-all cursor-pointer"
        >
          New Ticket
        </Link>
      </div>

      <div className="md:mt-8 mt-5 flex items-center flex-col md:flex-row gap-5">
        <div className="mb-3 w-full md:w-[250px]">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="primary-input h-[40px]"
            placeholder="Search"
          />
        </div>
        <Select
          className="w-full md:w-[250px]"
          classNamePrefix="select"
          isSearchable
          isClearable
          placeholder="Status"
          styles={CUSTOM_SELECT_STYLES}
          options={statusOptions}
          onChange={(opt) => setStatus(opt?.value ?? "")}
          inputId="status"
        />
      </div>

      <div className="mt-10 p-5 bg-adminComponentBg rounded-[10px]">
        <DataTable
          columns={TABLE_TICKETS_COLUMNS}
          data={data?.items ?? []}
          customStyles={CUSTOM_TABLE_STYLES}
          className="mt-4 rounded-none scrollbar-x-style"
          responsive
          theme="dark"
          progressPending={isPending}
          pagination
          paginationServer
          paginationTotalRows={data?.total ?? 0}
          paginationDefaultPage={page}
          paginationPerPage={perPage}
          onChangePage={(p) => setPage(p)}
          onChangeRowsPerPage={(newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          }}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          noDataComponent={<div className="text-center">No data available</div>}
          paginationComponentOptions={{
            rowsPerPageText: "Entries per page:",
            rangeSeparatorText: "of",
          }}
        />
      </div>
    </section>
  );
}

const Badge = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        className || ""
      }`}
    >
      {children}
    </span>
  );
};
