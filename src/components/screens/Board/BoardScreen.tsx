"use client";

import {
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { InputForm } from "@/components/base/InputForm/InputForm";
import { ColumnHead } from "@/components/ui/ColumnHead/ColumnHead";
import { ColumnTask } from "@/components/ui/ColumnTask/ColumnTask";
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
  const [tasks, setTasks] = useState<
    { title: string; id: string; columnId: string }[]
  >([]); // temp

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

  const addTaskHandler = (title: string, columnId: string) => {
    setTasks((prev) => {
      return [...prev, { title, id: crypto.randomUUID(), columnId }];
    });
  };

  const updateTaskHandler = (id: string, title: string) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((column) => column.id === id);
      const updatedTasks = [...prev];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], id, title };
      return updatedTasks;
    });
  };

  const formattedColumns = useMemo(
    () =>
      columns.map((c) => ({
        ...c,
        tasks: tasks.filter((t) => t.columnId === c.id),
      })),
    [columns, tasks]
  );

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: `BoardPage ${boardId}` }}
        withDivider
      />

      <ul className={styles.columns}>
        {formattedColumns.map((column) => (
          <li key={`${column.id}-${column.title}`} className={styles.column}>
            <ColumnHead
              title={column.title}
              isPending={false}
              onUpdateTitle={async (value) =>
                updateColumnHandler(column.id, value)
              }
            />
            <ul className={styles.tasks}>
              {column.tasks.map((task) => (
                <li key={task.id}>
                  <ColumnTask
                    title={task.title}
                    isPending={false}
                    onUpdateTitle={async (value) =>
                      updateTaskHandler(task.id, value)
                    }
                  />
                </li>
              ))}
              <li>
                <InputForm
                  label="Create task"
                  placeholder="Create task"
                  cancel="Cancel task creation"
                  submit="Create task"
                  isPending={false}
                  onFormSubmit={async (value) =>
                    addTaskHandler(value, column.id)
                  }
                />
              </li>
            </ul>
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
