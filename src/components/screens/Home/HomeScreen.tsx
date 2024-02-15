"use client";

import { Grid } from "@/components/base/Grid";
import styles from "./HomeScreen.module.scss";

import { SearchForm } from "@/components/base/SearchForm";
import { BoardCard } from "@/components/modules/board/BoardCard";
import { Heading } from "@/components/ui/Heading";
import clsx from "clsx";
import { ComponentPropsWithoutRef, FC } from "react";

type Props = {
  // TODO: need to add properly disabled state to form
  search: string;
  onSearchChange: (value: string) => void;
};

export type HomeScreenProps = ComponentPropsWithoutRef<"section"> & Props;

export const HomeScreen: FC<HomeScreenProps> = (props) => {
  const { search, onSearchChange, className, ...rest } = props;

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: "Active boards" }}
        description={{ text: "Manage your boards" }}
        withDivider
      />
      <Grid gap={4}>
        <div className={styles.filters}>
          <SearchForm onSearch={onSearchChange} />
        </div>
        <ul className={styles.list}>
          {new Array(10).fill(0).map((_, i) => (
            <li key={i}>
              <BoardCard href="" title={i.toString()} columns={0} tasks={0} />
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
};
