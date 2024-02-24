"use client";

import {
  useCallback,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";

import { InputForm } from "@/components/base/InputForm/InputForm";
import { BoardColumn } from "@/components/modules/board/BoardColumn/BoardColumn";
import { Sortable } from "@/components/modules/dnd/Sortable";
import { ColumnTask } from "@/components/ui/ColumnTask/ColumnTask";
import { Heading } from "@/components/ui/Heading/Heading";
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
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import clsx from "clsx";
import { createPortal } from "react-dom";
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
    setColumns,
    addColumn,
    updateColumnTitle,
    updateColumnOrder,
    // tasks
    tasks,
    addTask,
    updateTaskTitle,
    updateTaskColumn,
    updateTaskOrder,
  } = useBoard(board.data);

  const [draggableColumn, setDraggableColumn] =
    useState<DraggableColumn | null>(null);
  const [draggableTask, setDraggableTask] = useState<DraggableTask | null>(
    null
  );

  const addColumnHandler = useCallback(
    (title: string) => {
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
    (title: string, columnId: string) => {
      const neededColumn = columns.find((column) => column.id === columnId);

      if (!neededColumn) return;

      addTask({ title, columnId });
      addTaskAction.action({ title, columnId: columnId });
    },
    [addTaskAction, columns, addTask]
  );

  const updateColumnHandler = useCallback(
    (id: string, title: string) => {
      const neededColumn = columns.find((column) => column.id === id);

      if (!neededColumn) return;
      if (neededColumn.title === title) return;

      updateColumnTitle({ columnId: id, title });
      updateColumnAction.action({ columnId: id, title });
    },
    [columns, updateColumnAction, updateColumnTitle]
  );

  const updateTaskHandler = useCallback(
    (taskId: string, title: string) => {
      const neededTask = tasks.find((task) => task.id === taskId);

      if (!neededTask) return;
      if (neededTask.title === title) return;

      updateTaskTitle({ taskId, title });
      updateTaskAction.action({ taskId, title });
    },
    [tasks, updateTaskAction, updateTaskTitle]
  );

  const changeColumnOrderHandler = useCallback(
    (columnId: string, newColumnId: string) => {
      const oldIndex = columnIds.findIndex((column) => column === columnId);
      const newIndex = columnIds.findIndex((column) => column === newColumnId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = updateColumnOrder({ columnId, newColumnId });

      updateColumnAction.action({
        columnId,
        order: newOrder,
      });
    },
    [columnIds, updateColumnAction, updateColumnOrder]
  );

  const dragEndHandler = useCallback(
    (event: DragEndEvent) => {
      const { over, active } = event;

      if (!active) return;
      if (!over) return;
      if (over.id === active.id) return;
      if (!active.data.current) return;
      if (!over.data.current) return;

      const overData = over.data.current;
      const activeData = active.data.current;

      const isActiveColumn = "column" in activeData;
      const isActiveTask = "task" in activeData;

      const isOverColumn = "column" in overData;
      const isOverTask = "task" in overData;

      // columns
      // column drop on column
      if (isActiveColumn && isOverColumn) {
        changeColumnOrderHandler(active.id.toString(), over.id.toString());
      }

      // task drop on task
      if (isActiveTask && isOverTask) {
        const isSameColumn =
          draggableTask?.columnId === over.data.current?.task.columnId;

        if (isSameColumn) {
          const newOrder = updateTaskOrder({
            taskId: active.id.toString(),
            newTaskId: over.id.toString(),
          });

          if (!newOrder) return;

          updateTaskAction.action({
            taskId: active.id.toString(),
            order: newOrder,
          });

          return;
        } else if (!isSameColumn) {
          console.log("task drop on task");
          updateTaskAction.action({
            taskId: active.id.toString(),
            newColumnId: over.data.current.task.columnId,
          });
        }
      }

      setDraggableColumn(null);
      setDraggableTask(null);
    },
    [changeColumnOrderHandler, draggableTask, updateTaskAction, updateTaskOrder]
  );

  const dragStartHandler = useCallback((event: DragStartEvent) => {
    const { active } = event;

    if (!active) return;
    if (!active.id) return;
    if (!active.data.current) return;

    const contextData = active.data.current;

    const isColumn = "column" in contextData;
    const isTask = "task" in contextData;

    if (isColumn) {
      setDraggableColumn(contextData.column as DraggableColumn);
    }

    if (isTask) {
      setDraggableTask(contextData.task as DraggableTask);
    }
  }, []);

  const dragOverHandler = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!active) return;
      if (!over) return;
      if (!active.data.current) return;
      if (!over.data.current) return;

      const overData = over.data.current;
      const activeData = active.data.current;

      const isOverTask = "task" in overData;
      const isOverColumn = "column" in overData;

      const isActiveTask = "task" in activeData;

      if (isActiveTask && isOverColumn) {
        const isSameColumn = activeData.task.columnId === overData.column.id;

        if (isSameColumn) return;

        updateTaskColumn({
          taskId: active.id.toString(),
          newColumnId: over.id.toString(),
        });
      }

      if (isOverTask && isActiveTask) {
        const isSameColumn =
          over.data.current.task.columnId === active.data.current.task.columnId;

        if (isSameColumn) return;

        setColumns((prev) => {
          return prev.map((column) => {
            if (
              active.data.current &&
              column.id === active.data.current.task.columnId
            ) {
              return {
                ...column,
                tasks: column.tasks
                  .filter((task) => task.id !== active.id)
                  .map((task, index) => ({ ...task, order: index })),
              };
            }

            if (
              over.data.current &&
              active.data.current &&
              column.id === over.data.current.task.columnId
            ) {
              const tasks = [
                ...column.tasks,
                { ...active.data.current.task, order: column.tasks.length },
              ];

              const newIndex = tasks.findIndex((task) => task.id === over.id);

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
      }
    },
    [setColumns, updateTaskColumn]
  );

  return (
    <>
      <section {...rest} className={clsx(styles.element, className)}>
        <Heading title={{ tag: "h1", text: "BoardPage" }} withDivider />

        <DndContext
          onDragEnd={dragEndHandler}
          onDragStart={dragStartHandler}
          onDragOver={dragOverHandler}
          collisionDetection={closestCenter}
        >
          <ul className={styles.columns}>
            <SortableContext items={columnIds}>
              {formattedColumns.map((column) => (
                <Sortable
                  key={`${column.id}-${column.title}`}
                  id={column.id}
                  data={{ column }}
                >
                  {({
                    setNodeRef,
                    attributes,
                    listeners,
                    isDragging,
                    style,
                  }) => (
                    <li ref={setNodeRef} {...attributes} style={style}>
                      <BoardColumn
                        column={column}
                        isDragging={isDragging}
                        columnsLength={columns.length || 0}
                        dndListeners={listeners}
                        onAddTask={async (title) =>
                          addTaskHandler(title, column.id)
                        }
                        onUpdateTask={async (id, title) =>
                          updateTaskHandler(id, title)
                        }
                        onUpdateColumn={async (title) =>
                          updateColumnHandler(column.id, title)
                        }
                        className={clsx(styles.column, isDragging && "z-50")}
                      />
                    </li>
                  )}
                </Sortable>
              ))}
            </SortableContext>
            <li className={styles.column}>
              <InputForm
                label="Create column"
                placeholder="Create column"
                cancel="Cancel column creation"
                submit="Create column"
                isPending={addColumnAction.isPending}
                onFormSubmit={async (value) => addColumnHandler(value)}
              />
            </li>
          </ul>

          {typeof window !== "undefined" &&
            createPortal(
              <DragOverlay>
                {draggableColumn && (
                  <BoardColumn
                    isPlaceholder
                    column={draggableColumn}
                    columnsLength={columns.length || 0}
                  />
                )}
                {draggableTask && (
                  <ColumnTask
                    task={draggableTask}
                    isPending={false}
                    isPlaceholder
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </section>
    </>
  );
};
