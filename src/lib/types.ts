export interface Task {
  id: string;
  title: string;
  status: "PENDING" | "DRAWN";
  createdAt: string;
  drawnAt: string | null;
}
