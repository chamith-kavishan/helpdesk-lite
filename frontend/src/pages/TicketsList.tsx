import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { axiosClient } from "../api/axiosClient";

export default function TicketsList() {
  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["tickets", { status, q, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("limit", "10");
      const res = await axiosClient.get(`/tickets?${params.toString()}`);
      return res.data as any[];
    },
  });

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option>OPEN</option>
          <option>IN_PROGRESS</option>
          <option>RESOLVED</option>
        </select>
        <input
          className="border p-2"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.id}</td>
                <td className="p-2">
                  <a className="text-blue-600" href={`/ticket/${t.id}`}>
                    {t.title}
                  </a>
                </td>
                <td className="p-2">{t.status}</td>
                <td className="p-2">{t.priority}</td>
                <td className="p-2">
                  {new Date(t.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-3 flex gap-2">
        <button
          className="border px-2 py-1"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          className="border px-2 py-1"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
