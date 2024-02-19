"use client";

import { useState, type ComponentPropsWithoutRef, type FC } from "react";

import { InputForm } from "@/components/base/InputForm/InputForm";
import { ColumnHead } from "@/components/ui/ColumnHead/ColumnHead";
import { Heading } from "@/components/ui/Heading/Heading";
import clsx from "clsx";
import styles from "./BoardScreen.module.scss";

export type BoardScreenProps = ComponentPropsWithoutRef<"div"> & {
  // temp
  boardId: string;
};

export const BoardScreen: FC<BoardScreenProps> = (props) => {
  const { boardId, className, ...rest } = props;
  const [columns, setColumns] = useState<{ title: string; id: string }[]>([]); // temp

  const addColumnHandler = (title: string) => {
    setColumns((prevColumns) => {
      return [...prevColumns, { title, id: crypto.randomUUID() }];
    });
  };

  const updateColumnHandler = (id: string, title: string) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((column) => column.id === id);
      const updatedColumns = [...prevColumns];
      updatedColumns[columnIndex] = { id, title };
      return updatedColumns;
    });
  };

  const deleteColumnHandler = (id: string) => {
    setColumns((prevColumns) => {
      return prevColumns.filter((column) => column.id !== id);
    });
  };

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: `BoardPage ${boardId}` }}
        withDivider
      />

      <ul className={styles.columns}>
        {columns.map((column) => (
          <li key={`${column.id}-${column.title}`} className={styles.column}>
            <ColumnHead
              title={column.title}
              isPending={false}
              onUpdateTitle={async (value) =>
                updateColumnHandler(column.id, value)
              }
            />
          </li>
        ))}
        <li className={styles.column}>
          <InputForm
            label="Create column"
            placeholder="Create column"
            cancel="Cancel column creation"
            submit="Create column"
            isPending={false}
            onFormSubmit={async (value) => addColumnHandler(value)}
          />
        </li>
      </ul>
    </section>
  );
};
