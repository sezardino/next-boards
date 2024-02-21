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
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import { InputForm } from "@/components/base/InputForm/InputForm";
import { Draggable } from "@/components/modules/dnd/Draggable";
import { Droppable } from "@/components/modules/dnd/Dropable";
import { Sortable } from "@/components/modules/dnd/Sortable";
import { ColumnHead } from "@/components/ui/ColumnHead/ColumnHead";
import { ColumnTask } from "@/components/ui/ColumnTask/ColumnTask";
import { Heading } from "@/components/ui/Heading/Heading";
import {
  AddColumnDto,
  AddColumnResponse,
  AddTaskDto,
  AddTaskResponse,
  BoardResponse,
} from "@/services/bll/modules/board/dto";
import { ActionProp, DataProp } from "@/types";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import styles from "./BoardScreen.module.scss";

export type BoardScreenProps = ComponentPropsWithoutRef<"div"> & {
  // temp
  boardId: string;
  board: DataProp<BoardResponse>;
  addColumnAction: ActionProp<AddColumnDto, AddColumnResponse>;
  addTaskAction: ActionProp<AddTaskDto, AddTaskResponse>;
};

type TempColumn = {
  title: string;
  id: string;
};

type TempTask = { title: string; id: string; columnId: string };

export const BoardScreen: FC<BoardScreenProps> = (props) => {
  const { boardId, addColumnAction, addTaskAction, className, ...rest } = props;
  const [columns, setColumns] = useState<TempColumn[]>([]); // temp
  const [tasks, setTasks] = useState<TempTask[]>([]); // temp
  const [draggableColumn, setDraggableColumn] = useState<TempColumn | null>(
    null
  );
  const [draggableTask, setDraggableTask] = useState<TempTask | null>(null);

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

  const dragEndHandler = useCallback(
    (event: DragEndEvent) => {
      setDraggableColumn(null);
      setDraggableTask(null);
      const { over, active } = event;
      console.log(event);
      const isColumn = columns.some((column) => column.id === active.id);

      if (!over) return;
      if (over.id === active.id) return;

      if (isColumn) {
        setColumns((prevColumns) => {
          const oldIndex = prevColumns.findIndex(
            (column) => column.id === active.id
          );
          const newIndex = prevColumns.findIndex(
            (column) => column.id === over.id
          );
          return arrayMove(prevColumns, oldIndex, newIndex);
        });
      } else {
        const task = tasks.find((task) => task.id === active.id);
        if (!task) return;

        setTasks((prevTasks) => {
          const oldIndex = prevTasks.findIndex((task) => task.id === active.id);
          const newTasks = [...prevTasks];
          newTasks[oldIndex] = {
            ...newTasks[oldIndex],
            columnId: over.id.toString(),
          };
          return newTasks;
        });
      }
    },
    [columns, tasks]
  );

  const dragStartHandler = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;

      if (!active) return;
      if (!active.id) return;

      const isColumn = columns.some((column) => column.id === active.id);

      if (isColumn) {
        const column = columns.find((c) => c.id === active.id);

        if (!column) return;

        setDraggableColumn(column);
      } else {
        const task = tasks.find((task) => task.id === active.id);

        if (!task) return;

        setDraggableTask(task);
      }
    },
    [columns, tasks]
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
            items={columns}
            strategy={horizontalListSortingStrategy}
          >
            {formattedColumns.map((column) => (
              <Sortable key={`${column.id}-${column.title}`} id={column.id}>
                {({ setNodeRef, attributes, listeners, style, isDragging }) => (
                  <li
                    ref={setNodeRef}
                    {...attributes}
                    className={clsx(styles.column, isDragging && "z-50")}
                  >
                    <ColumnHead
                      title={column.title}
                      isPending={false}
                      dndListeners={
                        formattedColumns.length > 1 ? listeners : undefined
                      }
                      onUpdateTitle={async (value) =>
                        updateColumnHandler(column.id, value)
                      }
                    />
                    <Droppable id={column.id}>
                      {({ setNodeRef }) => (
                        <ul ref={setNodeRef} className={styles.tasks}>
                          {column.tasks.map((task) => (
                            <Draggable key={task.id} id={task.id}>
                              {({ setNodeRef, listeners, attributes }) => (
                                <li ref={setNodeRef} {...attributes}>
                                  <ColumnTask
                                    title={task.title}
                                    isPending={false}
                                    onUpdateTitle={async (value) =>
                                      updateTaskHandler(task.id, value)
                                    }
                                    dndListeners={listeners}
                                  />
                                </li>
                              )}
                            </Draggable>
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
                      )}
                    </Droppable>
                  </li>
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
        <DragOverlay modifiers={[restrictToHorizontalAxis]}>
          {draggableColumn && (
            <ColumnHead
              title={draggableColumn.title}
              isPending={false}
              dndListeners={{}}
              onUpdateTitle={async () => {}}
            />
          )}
        </DragOverlay>
        <DragOverlay>
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
