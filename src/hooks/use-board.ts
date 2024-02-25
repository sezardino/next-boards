import { Board } from "@/services/bll/modules/board/dto";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";
import { useWatchEffect } from "./use-watch-effect";

const createBlankColumn = (title: string, order: number) => ({
  id: new Date().toString(),
  tasks: [],
  title,
  order,
});

const createBlankTask = (title: string, columnId: string, order: number) => ({
  id: new Date().toString(),
  title,
  columnId,
  order,
});

type FormattedBoardColumn = Omit<Board["columns"][number], "tasks"> & {
  tasks: Board["tasks"];
};

export const useBoard = (board?: Board) => {
  const [columns, setColumns] = useState(board?.columns || []);
  const [tasks, setTasks] = useState(board?.tasks || []);

  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const formattedColumns = useMemo<FormattedBoardColumn[]>(() => {
    return (
      columns.map((column) => ({
        ...column,
        tasks:
          (
            column.tasks
              .map((task) => tasks.find((t) => t.id === task.id))
              .filter(Boolean) as Board["tasks"][number][]
          ).sort((a, b) => a.order - b.order) || [],
      })) || []
    );
  }, [columns, tasks]);

  useWatchEffect(() => {
    if (!board) return;

    setColumns(board.columns);
    setTasks(board.tasks);
  }, [board?.columns]);

  // columns
  const addColumn = useCallback(
    (title: string) =>
      setColumns((prev) => [...prev, createBlankColumn(title, columns.length)]),
    [columns.length]
  );

  const updateColumnTitle = useCallback(
    (dto: { columnId: string; title: string }) => {
      const { columnId, title } = dto;

      setColumns((prev) =>
        prev.map((column) =>
          column.id === columnId ? { ...column, title } : column
        )
      );
    },
    []
  );

  const updateColumnOrder = useCallback(
    (dto: { columnId: string; newColumnId: string }) => {
      const { columnId, newColumnId } = dto;

      const oldIndex = columnIds.findIndex((column) => column === columnId);
      const newIndex = columnIds.findIndex((column) => column === newColumnId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = arrayMove(columnIds, oldIndex, newIndex);

      setColumns((prev) => arrayMove(prev, oldIndex, newIndex));

      return newOrder;
    },
    [columnIds, setColumns]
  );

  // tasks
  const addTask = useCallback(
    (dto: { title: string; columnId: string }) => {
      const { title, columnId } = dto;

      const neededColumn = columns.find((column) => column.id === columnId);

      if (!neededColumn) return;

      const newTask = createBlankTask(
        title,
        columnId,
        neededColumn.tasks.length
      );

      setColumns((prev) =>
        prev.map((c) =>
          c.id === columnId
            ? { ...c, tasks: [...c.tasks, { id: newTask.id }] }
            : c
        )
      );

      setTasks((prev) => [...prev, newTask]);
    },
    [columns]
  );

  const updateTaskTitle = useCallback(
    (dto: { taskId: string; title: string }) => {
      const { taskId, title } = dto;

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, title } : task))
      );
    },
    []
  );

  const updateTaskColumnBaseOnColumn = useCallback(
    (dto: { taskId: string; newColumnId: string }) => {
      const { taskId, newColumnId } = dto;

      const neededColumn = columns.find((column) => column.id === newColumnId);

      if (!neededColumn) return;

      setColumns((prev) =>
        prev.map((column) => {
          if (column.id === newColumnId)
            return { ...column, tasks: [...column.tasks, { id: taskId }] };

          if (column.tasks.find((task) => task.id === taskId))
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            };

          return column;
        })
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                columnId: newColumnId,
                order: neededColumn.tasks.length,
              }
            : task
        )
      );
    },
    [columns]
  );

  const updateTaskColumnBaseOnTask = useCallback(
    (dto: { taskId: string; newColumnId: string; newTaskId: string }) => {
      const { taskId, newColumnId, newTaskId } = dto;

      const neededTask = tasks.find((task) => task.id === taskId);

      if (!neededTask) return;

      setColumns((prev) => {
        return prev.map((column) => {
          if (column.id === newColumnId) {
            return {
              ...column,
              tasks: column.tasks
                .filter((task) => task.id !== taskId)
                .map((task, index) => ({ ...task, order: index })),
            };
          }

          if (column.id === newTaskId) {
            const tasks = [
              ...column.tasks,
              { ...neededTask, order: column.tasks.length },
            ];

            const newIndex = tasks.findIndex((task) => task.id === newTaskId);

            return {
              ...column,
              tasks: arrayMove(tasks, newIndex, tasks.length - 1).map(
                (task, index) => ({ ...task, order: index })
              ),
            };
          }

          return column;
        });
      });
    },
    [tasks]
  );

  const updateTaskOrder = useCallback(
    (dto: { taskId: string; newTaskId: string }) => {
      const { taskId, newTaskId } = dto;
      const neededColumn = columns.find((column) => {
        return (
          column.tasks.find((task) => task.id === taskId) &&
          column.tasks.find((task) => task.id === newTaskId)
        );
      });

      if (!neededColumn) return;

      const oldIndex = neededColumn.tasks.findIndex(
        (task) => task.id === taskId
      );
      const newIndex = neededColumn.tasks.findIndex(
        (task) => task.id === newTaskId
      );

      setColumns((prev) =>
        prev.map((column) => {
          if (column.id !== neededColumn.id) return column;

          return {
            ...column,
            tasks: arrayMove(column.tasks, oldIndex, newIndex),
          };
        })
      );

      const newColumnOrderIds = arrayMove(
        neededColumn.tasks,
        oldIndex,
        newIndex
      ).map((task) => task.id);

      setTasks((prev) =>
        prev.map((task) => {
          if (newColumnOrderIds.includes(task.id)) {
            return {
              ...task,
              order: newColumnOrderIds.indexOf(task.id),
            };
          }

          return task;
        })
      );

      return newColumnOrderIds;
    },
    [columns]
  );

  return {
    columns,
    setColumns,
    tasks,
    setTasks,
    formattedColumns,
    columnIds,
    // columns
    addColumn,
    updateColumnTitle,
    updateColumnOrder,
    // tasks
    addTask,
    updateTaskTitle,
    updateTaskColumnBaseOnColumn,
    updateTaskColumnBaseOnTask,
    updateTaskOrder,
  };
};
