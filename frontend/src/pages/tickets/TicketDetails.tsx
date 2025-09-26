import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { toast } from "react-toastify";

import { useAuth } from "../../auth/useAuth";
import { axiosClient } from "../../api/axiosClient";
import {
  CUSTOM_SELECT_STYLES,
  PRIORITY_COLORS,
  STATUS_COLORS,
} from "../../utils/constants";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { getSocket } from "../../realtime/socket";

import type { User } from "../../types/user";
import type { Ticket } from "../../types/ticket";
import type { Comment } from "../../types/comment";
import type { UserOption } from "../../types/user";

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { user, token } = useAuth();
  const [newComment, setNewComment] = useState("");
  const ticketKey = ["ticket", id];
  const commentsKey = ["comments", id];

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!token || !id) return;

    const socket = getSocket(token);
    socket.emit("ticket:join", { ticketId: Number(id) });

    const onNew = (comment: Comment) => {
      qc.setQueryData<Comment[] | undefined>(commentsKey, (prev) => {
        const list = prev ?? [];
        return [comment, ...list];
      });
    };
    socket.on("comment:new", onNew);
    return () => {
      socket.emit("ticket:leave", { ticketId: Number(id) });
      socket.off("comment:new", onNew);
    };
  }, [token, id, qc]);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await axiosClient.get("/users")).data as User[],
    enabled: !!isAdmin,
  });

  const userOptions: UserOption[] = useMemo(
    () =>
      (users ?? []).map((u) => ({
        value: String(u.id),
        label: String(u.name ?? u.email ?? u.id),
      })),
    [users]
  );

  const { data: ticket } = useQuery({
    queryKey: ticketKey,
    queryFn: async (): Promise<Ticket> =>
      (await axiosClient.get(`/tickets/${id}`)).data,
  });

  const { data: comments } = useQuery({
    queryKey: commentsKey,
    queryFn: async (): Promise<Comment[]> =>
      (await axiosClient.get(`/tickets/${id}/comments`)).data,
  });

  const updateStatus = useMutation({
    mutationFn: async (status: Ticket["status"]) =>
      (await axiosClient.patch(`/tickets/${id}`, { status })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKey });
      toast.success("Status updated");
    },
    onError: (err) => {
      toast.error("Failed to update status");
      console.error(err);
    },
  });

  const assignTo = useMutation({
    mutationFn: async (uid: number) =>
      (await axiosClient.put(`/tickets/${id}/assign`, { assigned_to: uid }))
        .data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKey });
      toast.success("User assigned");
    },
    onError: (err) => {
      toast.error("Failed to assign user");
      console.error(err);
    },
  });

  const addComment = useMutation({
    mutationFn: async (data: { body: string }) =>
      (await axiosClient.post(`/tickets/${id}/comments`, data)).data,
    onSuccess: () => {
      setNewComment("");
      qc.invalidateQueries({ queryKey: commentsKey });
    },
  });

  const STATUS_OPTIONS = [
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
  ] as const;

  const [selectedStatus, setSelectedStatus] = useState<{
    value: Ticket["status"];
    label: string;
  } | null>(null);

  const [selectedAssignee, setSelectedAssignee] = useState<UserOption | null>(
    null
  );

  useEffect(() => {
    if (!ticket) return;

    const s = STATUS_OPTIONS.find((o) => o.value === ticket.status) ?? null;
    setSelectedStatus(s);

    const raw = ticket.assigned_to;
    const normalizedId =
      raw === null || raw === undefined || Number(raw) === 0
        ? null
        : String(Number(raw));

    const currentAssignee =
      normalizedId === null
        ? null
        : userOptions.find((o) => o.value === normalizedId) ?? null;

    setSelectedAssignee(currentAssignee);
  }, [ticket, userOptions]);

  if (!ticket) return <div className="p-4">Loading…</div>;

  const canEdit =
    user && (user.role === "admin" || user.id === ticket.created_by);

  const statusChanged =
    selectedStatus?.value && selectedStatus.value !== ticket.status;

  const assigneeChanged =
    (selectedAssignee?.value ?? null) !== (ticket.assigned_to ?? null);

  return (
    <section className="pt-6">
      <div className="w-full flex items-center justify-between">
        <h2 className="main-label w-[250px]">Ticket #{ticket.id}</h2>
        <SecondaryButton name="Back" onClick={() => nav("/")} />
      </div>

      <div className="md:mt-8 mt-5">
        <h3 className="text-base text-[#E1E1E1]">{ticket.title}</h3>
        <h3 className="text-base text-[#E1E1E1] mt-5">{ticket.description}</h3>
        <div className="flex items-center gap-6 flex-wrap">
          <h3 className="text-base text-[#E1E1E1] mt-5">
            Created by: {ticket.created_by_name}
          </h3>
          {ticket.assigned_to_name && (
            <h3 className="text-base text-[#E1E1E1] mt-5">
              Assigned To: {ticket.assigned_to_name}
            </h3>
          )}

          <h3 className="text-base text-[#E1E1E1] mt-5">
            Priority:
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                PRIORITY_COLORS[ticket.priority]
              }`}
            >
              {ticket.priority}
            </span>
          </h3>

          <h3 className="text-base text-[#E1E1E1] mt-5">
            Status:
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                STATUS_COLORS[ticket.status]
              }`}
            >
              {ticket.status}
            </span>
          </h3>
        </div>

        {canEdit && (
          <div className="mt-5">
            <label className="input-label">Status</label>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-full md:w-[250px] z-[99999]">
                <Select
                  classNamePrefix="select"
                  isSearchable
                  isClearable={false}
                  placeholder="Status"
                  styles={CUSTOM_SELECT_STYLES}
                  options={
                    STATUS_OPTIONS as unknown as {
                      value: string;
                      label: string;
                    }[]
                  }
                  value={
                    selectedStatus as unknown as {
                      value: string;
                      label: string;
                    } | null
                  }
                  onChange={(opt) =>
                    setSelectedStatus(
                      opt as { value: Ticket["status"]; label: string } | null
                    )
                  }
                  inputId="status"
                  isDisabled={updateStatus.isPending}
                />
              </div>

              <button
                type="button"
                className="text-sm px-3 py-2 rounded bg-[#2f2f2f] text-white border border-white/20 disabled:opacity-50"
                onClick={() => {
                  if (selectedStatus?.value) {
                    updateStatus.mutate(selectedStatus.value);
                  }
                }}
                disabled={!statusChanged || updateStatus.isPending}
                title="Apply status"
              >
                {updateStatus.isPending ? "Applying…" : "Apply"}
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-6">
            <label className="input-label">Assign to</label>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-full md:w-[320px]">
                <Select<UserOption, false>
                  classNamePrefix="select"
                  isSearchable
                  isClearable={false}
                  placeholder="Select a user"
                  styles={CUSTOM_SELECT_STYLES}
                  options={userOptions}
                  value={selectedAssignee}
                  onChange={(opt) => setSelectedAssignee(opt)}
                  isDisabled={assignTo.isPending || !users}
                />
              </div>

              <button
                type="button"
                className="text-sm px-3 py-2 rounded bg-[#2f2f2f] text-white border border-white/20 disabled:opacity-50"
                onClick={() => {
                  const uid = selectedAssignee
                    ? Number(selectedAssignee.value)
                    : 0;
                  assignTo.mutate(uid);
                }}
                disabled={!assigneeChanged || assignTo.isPending || !users}
                title="Apply assignee"
              >
                {assignTo.isPending ? "Assigning…" : "Apply"}
              </button>
            </div>
            {(assignTo.isPending || updateStatus.isPending) && (
              <span className="text-white ml-2 align-middle" />
            )}
          </div>
        )}

        <h3 className="mt-12 input-label">Comments</h3>
        {comments?.length ? (
          <div className="space-y-2 w-full md:w-[70%] mt-3">
            {comments.map((c) => (
              <div
                key={c._id}
                className="rounded-[10px] border border-[#B0B0B0] p-3 text-white"
              >
                <div className="text-sm opacity-70">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div>{c.body}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="opacity-70 text-white">No comments yet.</div>
        )}

        <form
          className="mt-4 flex gap-2 flex-col items-start"
          onSubmit={(e) => {
            e.preventDefault();
            if (newComment.trim()) {
              addComment.mutate({ body: newComment.trim() });
            }
          }}
        >
          <div className="w-full md:w-[70%]">
            <textarea
              id="description"
              className="primary-input min-h-[100px]"
              placeholder="Write a comment…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <PrimaryButton
            name={addComment.isPending ? "Posting…" : "Post"}
            submitting={addComment.isPending}
          />
        </form>
      </div>
    </section>
  );
}
