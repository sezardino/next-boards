"use client";

import { useCallback, type ComponentPropsWithoutRef, type FC } from "react";

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
    async (title: string, columnId: string) => {
      const neededColumn = columns.find((column) => column.id === columnId);

      if (!neededColumn) return;

      addTask({ title, columnId });
      addTaskAction.action({ title, columnId: columnId });
    },
    [addTaskAction, columns, addTask]
  );

  const updateColumnTitleHandler = useCallback(
    async (id: string, title: string) => {
      const neededColumn = columns.find((column) => column.id === id);

      if (!neededColumn) return;
      if (neededColumn.title === title) return;

      updateColumnTitle({ columnId: id, title });
      updateColumnAction.action({ columnId: id, title });
    },
    [columns, updateColumnAction, updateColumnTitle]
  );

  const updateTaskTitleHandler = useCallback(
    async (taskId: string, title: string) => {
      const neededTask = tasks.find((task) => task.id === taskId);

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
      </section>
    </>
  );
};
