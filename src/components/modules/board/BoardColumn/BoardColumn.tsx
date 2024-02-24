import { ComponentPropsWithoutRef, FC, useMemo } from "react";

import { InputForm } from "@/components/base/InputForm/InputForm";
import {
  ColumnHead,
  ColumnHeadProps,
} from "@/components/ui/ColumnHead/ColumnHead";
import { ColumnTask } from "@/components/ui/ColumnTask/ColumnTask";
import clsx from "clsx";

import { DraggableColumn } from "@/components/screens/Board/BoardScreen";
import { SortableContext } from "@dnd-kit/sortable";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Sortable } from "../../dnd/Sortable";
import styles from "./BoardColumn.module.scss";

type PickedColumnHeadProps = Pick<ColumnHeadProps, "dndListeners">;

type Props = {
  columnsLength: number;
  column: DraggableColumn;
  onUpdateColumn?: (title: string) => Promise<any>;
  onAddTask?: (title: string) => Promise<any>;
  onUpdateTask?: (id: string, title: string) => Promise<any>;
  isDragging?: boolean;
  isPlaceholder?: boolean;
};

export type BoardColumnProps = ComponentPropsWithoutRef<"div"> &
  Props &
  PickedColumnHeadProps;

export const BoardColumn: FC<BoardColumnProps> = (props) => {
  const {
    isDragging,
    isPlaceholder,
    dndListeners,
    columnsLength,
    onAddTask,
    onUpdateTask,
    onUpdateColumn,
    column,
    children,
    className,
    ...rest
  } = props;

  const taskIds = useMemo(
    () => column.tasks?.map((task) => task.id) || [],
    [column.tasks]
  );

  return (
    // @ts-ignore
    <Card
      {...rest}
      className={clsx(styles.element, isDragging && styles.dragging, className)}
    >
      <CardHeader
        as={ColumnHead}
        title={column.title}
        isPending={false}
        isDragging={isPlaceholder}
        dndListeners={columnsLength > 1 ? dndListeners : undefined}
        onUpdateTitle={
          isPlaceholder
            ? undefined
            : async (value: string) => onUpdateColumn?.(value)
        }
      />
      <SortableContext key={column.id} items={taskIds}>
        <CardBody>
          <ul className={styles.tasks}>
            {column.tasks.map((task) => (
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
                      isPending={false}
                      isDragging={isDragging || isTaskDragging}
                      onUpdateTitle={async (value) =>
                        onUpdateTask?.(task.id, value)
                      }
                      dndListeners={listeners}
                    />
                  </li>
                )}
              </Sortable>
            ))}

            <li>
              <InputForm
                label="Create task"
                placeholder="Create task"
                cancel="Cancel task creation"
                submit="Create task"
                isPending={false}
                disabled={isPlaceholder}
                onFormSubmit={
                  onAddTask
                    ? async (value) => onAddTask(value)
                    : () => Promise.resolve()
                }
              />
            </li>
          </ul>
        </CardBody>
      </SortableContext>
    </Card>
  );
};
