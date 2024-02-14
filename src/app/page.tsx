"use client";

import { BoardCard } from "@/components/modules/board/BoardCard";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const data = useSession();

  return (
    <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
      {new Array(10).fill(0).map((_, i) => (
        <BoardCard key={i} href="" title={i.toString()} columns={0} tasks={0} />
      ))}
    </div>
  );
};

export default HomePage;
