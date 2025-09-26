export interface Comment {
  _id: string;
  ticketId: number;
  authorId: number;
  body: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}
