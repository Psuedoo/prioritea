import { TaskTable } from "./task";

export default function Home() {
  return (
    <main className="flex min-h-screen w-100% flex-col items-center">
      <h1 className="text-6xl pt-10 pb-10">Welcome to Prioritea! 🍵</h1>
      <div className="w-1/2">
        <TaskTable />
      </div>
    </main>
  );
}
