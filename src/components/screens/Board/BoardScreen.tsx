"use client";

import {
  useCallback,
  useMemo,
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
import {
  AddColumnResponse,
  AddTaskDto,
  AddTaskResponse,
  Board,
} from "@/services/bll/modules/board/dto";
import { ActionProp, DataProp } from "@/types";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import styles from "./BoardScreen.module.scss";

export type BoardScreenProps = ComponentPropsWithoutRef<"div"> & {
  // temp
  boardId: string;
  board: DataProp<Board>;
  addColumnAction: ActionProp<string, AddColumnResponse>;
  addTaskAction: ActionProp<Omit<AddTaskDto, "boardId">, AddTaskResponse>;
};

type TempTask = { title: string; id: string; columnId: string };

export const BoardScreen: FC<BoardScreenProps> = (props) => {
  const { boardId, board, addColumnAction, addTaskAction, className, ...rest } =
    props;
  const [tasks, setTasks] = useState<TempTask[]>([]); // temp
  const [draggableColumnId, setDraggableColumnId] = useState<string | null>(
    null
  );
  const [draggableTask, setDraggableTask] = useState<TempTask | null>(null);
  console.log(board.data);
  const addColumnHandler = (title: string) => {
    addColumnAction.action(title);
  };

  const updateColumnHandler = (id: string, title: string) => {
    // setColumns((prevColumns) => {
    //   const columnIndex = prevColumns.findIndex((column) => column.id === id);
    //   const updatedColumns = [...prevColumns];
    //   updatedColumns[columnIndex] = { id, title };
    //   return updatedColumns;
    // });
  };

  const addTaskHandler = (title: string, columnId: string) => {
    addTaskAction.action({ title, columnId: columnId });
    // setTasks((prev) => {
    //   return [...prev, { title, id: crypto.randomUUID(), columnId }];
    // });
  };

  const updateTaskHandler = (id: string, title: string) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((column) => column.id === id);
      const updatedTasks = [...prev];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], id, title };
      return updatedTasks;
    });
  };

  const draggableColumn = useMemo(() => {
    if (!board.data) return null;
    if (!draggableColumnId) return null;

    const column = board.data.columns.find(
      (column) => column.id === draggableColumnId
    );

    if (!column) return null;

    return column;
  }, [board.data, draggableColumnId]);

  const dragEndHandler = useCallback(
    (event: DragEndEvent) => {
      setDraggableColumnId(null);
      setDraggableTask(null);
      const { over, active } = event;

      if (!board.data) return;
      if (!active) return;
      if (!over) return;
      if (over.id === active.id) return;

      const isColumn = board.data.columns.some(
        (column) => column.id === active.id
      );

      // if (isColumn) {
      //   setColumns((prevColumns) => {
      //     const oldIndex = prevColumns.findIndex(
      //       (column) => column.id === active.id
      //     );
      //     const newIndex = prevColumns.findIndex(
      //       (column) => column.id === over.id
      //     );
      //     return arrayMove(prevColumns, oldIndex, newIndex);
      //   });
      // } else {
      //   const task = tasks.find((task) => task.id === active.id);
      //   if (!task) return;

      //   setTasks((prevTasks) => {
      //     const oldIndex = prevTasks.findIndex((task) => task.id === active.id);
      //     const newTasks = [...prevTasks];
      //     newTasks[oldIndex] = {
      //       ...newTasks[oldIndex],
      //       columnId: over.id.toString(),
      //     };
      //     return newTasks;
      //   });
      // }
    },
    [board.data]
  );

  const dragStartHandler = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;

      if (!board.data) return;
      if (!active) return;
      if (!active.id) return;

      const isColumn = board.data.columns.some(
        (column) => column.id === active.id
      );

      if (isColumn) {
        const column = board.data.columns.find((c) => c.id === active.id);

        if (!column) return;

        setDraggableColumnId(column.id);
      } else {
        const task = tasks.find((task) => task.id === active.id);

        if (!task) return;

        setDraggableTask(task);
      }
    },
    [board.data, tasks]
  );

  return (
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
            items={board.data?.columns.map((column) => column.id) || []}
            strategy={horizontalListSortingStrategy}
          >
            {board.data?.columns.map((column) => (
              <Sortable key={`${column.id}-${column.title}`} id={column.id}>
                {({ setNodeRef, attributes, listeners, isDragging }) => (
                  <BoardColumn
                    ref={setNodeRef}
                    {...attributes}
                    column={column}
                    columnsLength={board.data?.columns.length || 0}
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
                isPending={false}
                onFormSubmit={async (value) => addColumnHandler(value)}
              />
            </li>
          </SortableContext>
        </ul>
        <DragOverlay>
          {draggableColumn && (
            <BoardColumn
              isDragging
              column={draggableColumn}
              columnsLength={board.data?.columns.length || 0}
            />
          )}
          {draggableTask && (
            <ColumnTask
              title={draggableTask.title}
              isPending={false}
              dndListeners={{}}
              onUpdateTitle={async () => {}}
            />
          )}
        </DragOverlay>
      </DndContext>
    </section>
  );
};
