"use client";

import styles from "./HomeScreen.module.scss";

import { BoardCard } from "@/components/modules/board/BoardCard";
import { Heading } from "@/components/ui/Heading";

export const HomeScreen = () => {
  return (
    <section className={styles.element}>
      <Heading
        title={{ tag: "h1", text: "Active boards" }}
        description={{ text: "Manage your boards" }}
        withDivider
      />
      <ul className={styles.list}>
        {new Array(10).fill(0).map((_, i) => (
          <li key={i}>
            <BoardCard href="" title={i.toString()} columns={0} tasks={0} />
          </li>
        ))}
      </ul>
    </section>
  );
};
