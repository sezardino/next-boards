import {
  useCallback,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { InputForm } from "@/components/base/InputForm/InputForm";
import {
  DraggableColumn,
  DraggableTask,
} from "@/components/screens/Board/BoardScreen";
import { ColumnTask } from "@/components/ui/ColumnTask/ColumnTask";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { Sortable } from "../../dnd/Sortable";
import { DndColumn } from "../DndColumn/DndColumn";
import styles from "./KanbanView.module.scss";

export interface KanbanViewProps extends ComponentPropsWithoutRef<"ul"> {
  columns: DraggableColumn[];
  onAddTask: (dto: { title: string; columnId: string }) => void;
  onAddColumn: (title: string) => void;
  onUpdateTaskTitle: (dto: { taskId: string; title: string }) => void;
  onUpdateColumnTitle: (dto: { columnId: string; title: string }) => void;
  // dnd
  onColumnDropOnColumn: (dto: {
    columnId: string;
    newColumnId: string;
  }) => void;
  onChangeTaskColumn: (dto: { taskId: string; newColumnId: string }) => void;
  onDropTaskOnTaskInSameColumn: (dto: {
    taskId: string;
    newTaskId: string;
  }) => void;
  onChangeTaskOrderInOtherColumns: (dto: {
    taskId: string;
    newTaskId: string;
    newColumnId: string;
  }) => void;
  onOverTaskOnColumn: (dto: { taskId: string; newColumnId: string }) => void;
}

export const KanbanView: FC<KanbanViewProps> = (props) => {
  const {
    columns,
    onAddTask,
    onAddColumn,
    onUpdateTaskTitle,
    onUpdateColumnTitle,
    onColumnDropOnColumn,
    onChangeTaskColumn,
    onDropTaskOnTaskInSameColumn,
    onChangeTaskOrderInOtherColumns,
    onOverTaskOnColumn,
    className,
    ...rest
  } = props;

  const [draggableColumn, setDraggableColumn] =
    useState<DraggableColumn | null>(null);
  const [draggableTask, setDraggableTask] = useState<DraggableTask | null>(
    null
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
        const columnId = active.id.toString();
        const newColumnId = over.id.toString();

        onColumnDropOnColumn({ columnId, newColumnId });
      }

      if (isActiveTask && isOverColumn) {
        console.log("task drop on column");
        onChangeTaskColumn({
          taskId: active.id.toString(),
          newColumnId: over.id.toString(),
        });
      }

      // task drop on task
      if (isActiveTask && isOverTask) {
        console.log("task drop on task");
        const isSameColumn =
          draggableTask?.columnId === over.data.current?.task.columnId;

        if (isSameColumn) {
          console.log("task drop on task in same column");
          onDropTaskOnTaskInSameColumn({
            taskId: active.id.toString(),
            newTaskId: over.id.toString(),
          });
        } else if (!isSameColumn) {
          console.log("task drop on task in other column");
          onChangeTaskOrderInOtherColumns({
            taskId: active.id.toString(),
            newTaskId: over.id.toString(),
            newColumnId: over.data.current.task.columnId,
          });
        }
      }

      setDraggableColumn(null);
      setDraggableTask(null);
    },
    [
      draggableTask?.columnId,
      onColumnDropOnColumn,
      onChangeTaskColumn,
      onChangeTaskOrderInOtherColumns,
      onDropTaskOnTaskInSameColumn,
    ]
  );

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

        onOverTaskOnColumn({
          taskId: active.id.toString(),
          newColumnId: over.id.toString(),
        });
      }

      if (isOverTask && isActiveTask) {
        const isSameColumn =
          over.data.current.task.columnId === active.data.current.task.columnId;

        if (isSameColumn) return;

        onOverTaskOnColumn({
          taskId: active.id.toString(),
          newColumnId: over.data.current.task.columnId,
        });
      }
    },
    [onOverTaskOnColumn]
  );

  return (
    <DndContext
      onDragEnd={dragEndHandler}
      onDragStart={dragStartHandler}
      onDragOver={dragOverHandler}
    >
      <ul {...rest} className={clsx(styles.element, className)}>
        <SortableContext items={columns.map((c) => c.id)}>
          {columns.map((column) => (
            <Sortable
              key={`${column.id}-${column.title}`}
              id={column.id}
              data={{ column }}
            >
              {({ setNodeRef, attributes, listeners, isDragging, style }) => (
                <SortableContext items={column.tasks.map((t) => t.id)}>
                  <li
                    ref={setNodeRef}
                    {...attributes}
                    style={style}
                    className={styles.item}
                  >
                    <DndColumn
                      as="div"
                      isDragging={isDragging}
                      dndListeners={listeners}
                      items={column.tasks}
                      header={
                        <InputForm
                          label="Change column name"
                          placeholder="Change column name"
                          cancel="Cancel column name change"
                          submit="Change column name"
                          initialValue={column.title}
                          disabled={isDragging}
                          onFormSubmit={async (title) =>
                            onUpdateColumnTitle({ columnId: column.id, title })
                          }
                        />
                      }
                      footer={
                        <InputForm
                          label="Create task"
                          placeholder="Create task"
                          cancel="Cancel task creation"
                          submit="Create task"
                          disabled={isDragging}
                          className={styles.form}
                          onFormSubmit={async (title) =>
                            onAddTask({ title, columnId: column.id })
                          }
                        />
                      }
                      itemRenderFun={(task) => (
                        <Sortable
                          key={`${task.id}-${task.title}`}
                          id={task.id}
                          data={{ task: { ...task, columnId: column.id } }}
                        >
                          {({
                            setNodeRef,
                            listeners,
                            attributes,
                            style,
                            isDragging: isTaskDragging,
                          }) => (
                            <li ref={setNodeRef} {...attributes} style={style}>
                              <ColumnTask
                                task={task}
                                isDragging={isDragging || isTaskDragging}
                                onUpdateTitle={(title) =>
                                  onUpdateTaskTitle({ taskId: task.id, title })
                                }
                                dndListeners={listeners}
                              />
                            </li>
                          )}
                        </Sortable>
                      )}
                      className={clsx(styles.column, isDragging && "z-50")}
                    />
                  </li>
                </SortableContext>
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
            onFormSubmit={onAddColumn}
          />
        </li>
      </ul>

      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {draggableColumn && (
              <DndColumn
                items={draggableColumn.tasks}
                header={
                  <InputForm
                    label="Change column name"
                    placeholder="Change column name"
                    cancel="Cancel column name change"
                    submit="Change column name"
                    initialValue={draggableColumn.title}
                    disabled={true}
                    onFormSubmit={async () => {}}
                  />
                }
                footer={
                  <InputForm
                    label="Create task"
                    placeholder="Create task"
                    cancel="Cancel task creation"
                    submit="Create task"
                    disabled={true}
                    className={styles.form}
                    onFormSubmit={async () => {}}
                  />
                }
                itemRenderFun={(task) => (
                  <li>
                    <ColumnTask
                      task={task}
                      isDragging={true}
                      onUpdateTitle={async (title) => {}}
                    />
                  </li>
                )}
              />
            )}
            {draggableTask && <ColumnTask task={draggableTask} isPlaceholder />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
};
