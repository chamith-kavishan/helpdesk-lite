export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  created_by: number;
  assigned_to: number | null;
  created_by_name: string;
  assigned_to_email: string | null;
  assigned_to_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketsResponse {
  items: Ticket[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
