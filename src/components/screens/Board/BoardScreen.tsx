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
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import { createPortal } from "react-dom";
import styles from "./BoardScreen.module.scss";

export type BoardScreenProps = ComponentPropsWithoutRef<"div"> & {
  // temp
  boardId: string;
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

type DraggableColumn = Board["columns"][number];
type DraggableTask = Board["columns"][number]["tasks"][number];

export const BoardScreen: FC<BoardScreenProps> = (props) => {
  const {
    boardId,
    board,
    addColumnAction,
    addTaskAction,
    updateColumnAction,
    updateTaskAction,
    className,
    ...rest
  } = props;
  const [columns, setColumns, { columnIds }] = useBoard(board.data);

  const [draggableColumn, setDraggableColumn] =
    useState<DraggableColumn | null>(null);
  const [draggableTask, setDraggableTask] = useState<DraggableTask | null>(
    null
  );

  const addColumnHandler = (title: string) => {
    setColumns((prev) => [
      ...prev,
      {
        id: new Date().toString(),
        title,
        tasks: [],
        order: prev.length,
      },
    ]);
    addColumnAction.action(title);
  };

  const updateColumnHandler = (id: string, title: string) => {
    const neededColumn = columns.find((column) => column.id === id);

    if (!neededColumn) return;
    if (neededColumn.title === title) return;

    setColumns((prev) =>
      prev.map((column) => (column.id === id ? { ...column, title } : column))
    );
    updateColumnAction.action({ columnId: id, title });
  };

  const addTaskHandler = (title: string, columnId: string) => {
    setColumns((prev) => {
      const neededColumn = prev.find((column) => column.id === columnId);

      if (!neededColumn) return prev;

      const newTask = {
        id: new Date().toString(),
        title,
        columnId,
        order: neededColumn.tasks.length,
      };

      return prev.map((c) => {
        if (c.id !== columnId) return c;

        return {
          ...c,
          tasks: [...c.tasks, newTask],
        };
      });
    });

    addTaskAction.action({ title, columnId: columnId });
  };

  const updateTaskHandler = (id: string, title: string) => {
    updateTaskAction.action({ taskId: id, title });
  };

  const dragEndHandler = useCallback(
    (event: DragEndEvent) => {
      setDraggableColumn(null);
      setDraggableTask(null);
      const { over, active } = event;

      if (!active) return;
      if (!over) return;
      if (over.id === active.id) return;
      if (!active.data.current) return;

      const contextData = active.data.current;

      const isColumn = "column" in contextData;
      const isTask = "task" in contextData;

      if (isColumn) {
        const oldIndex = columnIds.findIndex((column) => column === active.id);
        const newIndex = columnIds.findIndex((column) => column === over.id);

        const newOrder = arrayMove(columnIds, oldIndex, newIndex);

        setColumns((prev) => arrayMove(prev, oldIndex, newIndex));

        updateColumnAction.action({
          columnId: active.id.toString(),
          order: newOrder,
        });
      }

      if (isTask) {
        const isInSameColumn = over.id === contextData.task.columnId;

        if (isInSameColumn) return;

        const neededTask = columns
          .find((column) => column.id === contextData.task.columnId)
          ?.tasks.find((task) => task.id === active.id);

        if (!neededTask) return;

        setColumns((prev) => {
          const newColumns = prev.map((column) => {
            if (column.id === over.id) {
              return {
                ...column,
                tasks: [
                  ...column.tasks,
                  { ...neededTask, order: column.tasks.length },
                ],
              };
            }

            return {
              ...column,
              tasks: column.tasks
                .filter((task) => task.id !== active.id)
                .map((task, index) => ({ ...task, order: index })),
            };
          });

          return newColumns;
        });

        updateTaskAction.action({
          newColumnId: over.id.toString(),
          taskId: active.id.toString(),
        });
      }
    },
    [columnIds, columns, setColumns, updateColumnAction, updateTaskAction]
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

  return (
    <>
      <section {...rest} className={clsx(styles.element, className)}>
        <Heading
          title={{ tag: "h1", text: `BoardPage ${boardId}` }}
          withDivider
        />

        <DndContext
          onDragEnd={dragEndHandler}
          onDragStart={dragStartHandler}
          collisionDetection={closestCenter}
        >
          <ul className={styles.columns}>
            <SortableContext
              items={columnIds}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <Sortable
                  key={`${column.id}-${column.title}`}
                  id={column.id}
                  data={{ column }}
                >
                  {({ setNodeRef, attributes, listeners, isDragging }) => (
                    <BoardColumn
                      ref={setNodeRef}
                      {...attributes}
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
                  )}
                </Sortable>
              ))}
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
            </SortableContext>
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
                    title={draggableTask.title}
                    isPending={false}
                    isDragging
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
