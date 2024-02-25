import { useWatchEffect } from "@/hooks/use-watch-effect";
import { Board } from "@/services/bll/modules/board/dto";
import { UpdateColumnDto } from "@/services/bll/modules/column/dto";
import { AddTaskDto, UpdateTaskDto } from "@/services/bll/modules/task/dto";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";

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

type UseBoardScreen = {
  columns?: Board["columns"];
  tasks?: Board["tasks"];
  onUpdateColumn: (title: Omit<UpdateColumnDto, "boardId">) => void;
  onUpdateTask: (dto: Omit<UpdateTaskDto, "boardId">) => void;
  onAddColumn: (title: string) => void;
  onAddTask: (dto: Omit<AddTaskDto, "boardId">) => void;
};

export const useBoardScreen = (args: UseBoardScreen) => {
  const {
    columns: columnsData,
    tasks: tasksData,
    onUpdateColumn,
    onUpdateTask,
    onAddColumn,
    onAddTask,
  } = args;
  const [columns, setColumns] = useState(columnsData || []);
  const [tasks, setTasks] = useState(tasksData || []);

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
    if (typeof columnsData === "undefined") return;

    setColumns(columnsData);
  }, [columnsData]);

  useWatchEffect(() => {
    if (typeof tasksData === "undefined") return;

    setTasks(tasksData);
  }, [tasksData]);

  // columns
  const addColumn = useCallback(
    (title: string) => {
      const hasSameColumnTitle = columns.some(
        (c) => c.title.trim().toLocaleUpperCase() === title.trim().toLowerCase()
      );

      if (hasSameColumnTitle) return;

      // UI
      setColumns((prev) => [...prev, createBlankColumn(title, columns.length)]);

      // API
      onAddColumn(title);
    },
    [columns, onAddColumn]
  );

  const updateColumnTitle = useCallback(
    (dto: { columnId: string; title: string }) => {
      const { columnId, title } = dto;
      const neededColumn = columns.find((column) => column.id === columnId);

      if (!neededColumn) return;
      if (neededColumn.title === title) return;

      // UI
      setColumns((prev) =>
        prev.map((column) =>
          column.id === columnId ? { ...column, title } : column
        )
      );

      // API
      onUpdateColumn({ columnId, title });
    },
    [columns, onUpdateColumn]
  );

  const updateColumnOrder = useCallback(
    (dto: { columnId: string; newColumnId: string }) => {
      const { columnId, newColumnId } = dto;

      const oldIndex = columnIds.findIndex((column) => column === columnId);
      const newIndex = columnIds.findIndex((column) => column === newColumnId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = arrayMove(columnIds, oldIndex, newIndex);

      setColumns((prev) => arrayMove(prev, oldIndex, newIndex));

      onUpdateColumn({ columnId, order: newOrder });
    },
    [columnIds, onUpdateColumn]
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

      // UI
      setColumns((prev) =>
        prev.map((c) =>
          c.id === columnId
            ? { ...c, tasks: [...c.tasks, { id: newTask.id }] }
            : c
        )
      );
      setTasks((prev) => [...prev, newTask]);

      // API
      onAddTask({ title, columnId });
    },
    [columns, onAddTask]
  );

  const updateTaskTitle = useCallback(
    (dto: { taskId: string; title: string }) => {
      const { taskId, title } = dto;

      const neededTask = tasks.find((task) => task.id === taskId);

      if (!neededTask) return;
      if (neededTask.title === title) return;

      // UI
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, title } : task))
      );

      // API
      onUpdateTask({ taskId, title });
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
    (dto: { taskId: string; newTaskId: string; newColumnId?: string }) => {
      const { taskId, newTaskId, newColumnId } = dto;
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

      // UI
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

      onUpdateTask({ taskId, order: newColumnOrderIds, newColumnId });
    },
    [columns, onUpdateTask]
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
