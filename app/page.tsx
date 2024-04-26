import { TaskTable } from "./task";

export default function Home() {
  return (
    <main className="flex min-h-screen w-100% flex-col items-center">
      <h1 className="text-6xl pt-10 pb-10">Welcome to Prioritea! 🍵</h1>
      <p className="w-2/4 text-lg text-center mb-5">
        Welcome to <strong>Prioritea</strong>, your personal task prioritizer.
        This application helps you manage your tasks more effectively by
        automatically calculating (and sorting!) the priority of each task based
        on its impact and level of effort.
      </p>
      <p className="w-2/4 text-lg text-center mb-5">
        To get started, simply input your tasks along with their impact and
        level of effort, and let Prioritea handle the rest. Start organizing
        your tasks with Prioritea and make your to-do list a breeze!
      </p>
      <div className="w-2/3">
        <TaskTable />
      </div>
    </main>
  );
}
