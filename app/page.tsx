import { TaskTable } from "./task";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl">Welcome to Prioritea!</h1>
      <TaskTable />
    </main>
  );
}
