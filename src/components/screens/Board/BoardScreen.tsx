"use client";

import {
  useCallback,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { Icon } from "@/components/base/Icon";
import { TabItem, Tabs } from "@/components/base/Tabs";
import { Typography } from "@/components/base/Typography/Typography";
import { KanbanView } from "@/components/modules/board/KanbanView/KanbanView";
import { useBoard } from "@/hooks/use-board";
import { Board } from "@/services/bll/modules/board/dto";
import {
  AddColumnResponse,
  UpdateColumnDto,
  UpdateColumnResponse,
} from "@/services/bll/modules/column/dto";
import {
  AddTaskDto,
  AddTaskResponse,
  UpdateTaskDto,
  UpdateTaskResponse,
} from "@/services/bll/modules/task/dto";
import { ActionProp, DataProp } from "@/types";
import clsx from "clsx";
import styles from "./BoardScreen.module.scss";

export type BoardScreenProps = ComponentPropsWithoutRef<"div"> & {
  board: DataProp<Board>;
  addColumnAction: ActionProp<string, AddColumnResponse>;
  addTaskAction: ActionProp<Omit<AddTaskDto, "boardId">, AddTaskResponse>;
  updateColumnAction: ActionProp<
    Omit<UpdateColumnDto, "boardId">,
    UpdateColumnResponse
  >;
  updateTaskAction: ActionProp<
    Omit<UpdateTaskDto, "boardId">,
    UpdateTaskResponse
  >;
};

export type DraggableTask = Board["tasks"][number];
export type DraggableColumn = Omit<Board["columns"][number], "tasks"> & {
  tasks: DraggableTask[];
};

type BoardView = "list" | "kanban";

export const BoardScreen: FC<BoardScreenProps> = (props) => {
  const {
    board,
    addColumnAction,
    addTaskAction,
    updateColumnAction,
    updateTaskAction,
    className,
    ...rest
  } = props;

  const {
    formattedColumns,
    // columns
    columns,
    columnIds,
    addColumn,
    updateColumnTitle,
    updateColumnOrder,
    // tasks
    tasks,
    addTask,
    updateTaskTitle,
    updateTaskColumnBaseOnColumn,
    updateTaskOrder,
  } = useBoard(board.data);

  const [view, setView] = useState<BoardView>("kanban");

  const tabs = useMemo<TabItem<BoardView>[]>(
    () => [
      {
        id: "kanban",
        title: (
          <div className={styles.tab}>
            <Icon name="Kanban" />
            <Typography tag="span" styling="xs">
              Kanban
            </Typography>
          </div>
        ),
      },
      {
        id: "list",
        title: (
          <div className={styles.tab}>
            <Icon name="List" />{" "}
            <Typography tag="span" styling="xs">
              List
            </Typography>
          </div>
        ),
      },
    ],
    []
  );

  const addColumnHandler = useCallback(
    async (title: string) => {
      const hasSameColumnTitle = columns.some(
        (c) => c.title.trim().toLocaleUpperCase() === title.trim().toLowerCase()
      );

      if (hasSameColumnTitle) return;

      addColumn(title);
      addColumnAction.action(title);
    },
    [addColumnAction, columns, addColumn]
  );

  const addTaskHandler = useCallback(
    async (dto: { title: string; columnId: string }) => {
      const { title, columnId } = dto;
      const neededColumn = columns.find((column) => column.id === columnId);

      if (!neededColumn) return;

      addTask({ title, columnId });
      addTaskAction.action({ title, columnId: columnId });
    },
    [addTaskAction, columns, addTask]
  );

  const updateColumnTitleHandler = useCallback(
    async (dto: { columnId: string; title: string }) => {
      const { columnId, title } = dto;
      const neededColumn = columns.find((column) => column.id === columnId);

      if (!neededColumn) return;
      if (neededColumn.title === title) return;

      updateColumnTitle({ columnId, title });
      updateColumnAction.action({ columnId, title });
    },
    [columns, updateColumnAction, updateColumnTitle]
  );

  const updateTaskTitleHandler = useCallback(
    async (dto: { taskId: string; title: string }) => {
      const { taskId, title } = dto;

      const neededTask = tasks.find((task) => task.id === taskId);
      console.log(neededTask, title, tasks, taskId);
      if (!neededTask) return;
      if (neededTask.title === title) return;

      updateTaskTitle({ taskId, title });
      updateTaskAction.action({ taskId, title });
    },
    [tasks, updateTaskAction, updateTaskTitle]
  );

  const columnDropOnColumnHandler = useCallback(
    (dto: { columnId: string; newColumnId: string }) => {
      const { columnId, newColumnId } = dto;

      const newOrder = updateColumnOrder({ columnId, newColumnId });

      if (!newOrder) return;

      updateColumnAction.action({
        columnId,
        order: newOrder,
      });
    },
    [updateColumnAction, updateColumnOrder]
  );

  const taskOrderInSameColumnHandler = useCallback(
    async (dto: { taskId: string; newTaskId: string }) => {
      const { taskId, newTaskId } = dto;

      const newOrder = updateTaskOrder({
        taskId,
        newTaskId,
      });

      if (!newOrder) return;

      updateTaskAction.action({
        taskId,
        order: newOrder,
      });
    },
    [updateTaskAction, updateTaskOrder]
  );

  const taskOrderInOtherColumnsHandler = useCallback(
    async (dto: { taskId: string; newTaskId: string; newColumnId: string }) => {
      const { taskId, newTaskId, newColumnId } = dto;

      const newOrder = updateTaskOrder({
        taskId,
        newTaskId,
      });

      updateTaskAction.action({
        taskId,
        newColumnId,
        order: newOrder,
      });
    },
    [updateTaskAction, updateTaskOrder]
  );

  return (
    <>
      <section {...rest} className={clsx(styles.element, className)}>
        <header className={styles.header}>
          <Typography tag="h1" styling="xl">
            {board.data?.title}
          </Typography>
          <Tabs
            title="Select view"
            variant="underlined"
            items={tabs}
            selected={view}
            className={styles.tabs}
            onSelectedChange={setView}
          />
        </header>
        <div className={styles.board}>
          {view === "kanban" && (
            <KanbanView
              columns={formattedColumns}
              className={styles.kanban}
              onAddColumn={addColumnHandler}
              onAddTask={addTaskHandler}
              onChangeColumnOrder={columnDropOnColumnHandler}
              onUpdateColumnTitle={updateColumnTitleHandler}
              onUpdateTaskTitle={updateTaskTitleHandler}
              onChangeTaskColumn={updateTaskAction.action}
              onChangeTaskOrderInSameColumn={taskOrderInSameColumnHandler}
              onChangeTaskOrderInOtherColumns={taskOrderInOtherColumnsHandler}
              onOverTaskOnColumn={updateTaskColumnBaseOnColumn}
            />
          )}

          {view === "list" && <div>list</div>}
        </div>
      </section>
    </>
  );
};
