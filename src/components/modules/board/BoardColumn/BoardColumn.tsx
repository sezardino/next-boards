import {
  ComponentPropsWithoutRef,
  ForwardRefRenderFunction,
  forwardRef,
} from "react";

import { InputForm } from "@/components/base/InputForm/InputForm";
import {
  ColumnHead,
  ColumnHeadProps,
} from "@/components/ui/ColumnHead/ColumnHead";
import { ColumnTask } from "@/components/ui/ColumnTask/ColumnTask";
import clsx from "clsx";
import { Draggable } from "../../dnd/Draggable";
import { Droppable } from "../../dnd/Dropable";

import styles from "./BoardColumn.module.scss";

type PickedColumnHeadProps = Pick<ColumnHeadProps, "dndListeners">;

type Props = {
  columnsLength: number;
  column: { id: string; title: string; tasks: { id: string; title: string }[] };
  onUpdateColumn?: (title: string) => Promise<any>;
  onAddTask?: (title: string) => Promise<any>;
  onUpdateTask?: (id: string, title: string) => Promise<any>;
  isDragging?: boolean;
};

export type BoardColumnProps = ComponentPropsWithoutRef<"li"> &
  Props &
  PickedColumnHeadProps;

const BoardColumnComponent: ForwardRefRenderFunction<
  HTMLLIElement,
  BoardColumnProps
> = (props, ref) => {
  const {
    isDragging,
    dndListeners,
    columnsLength,
    onAddTask,
    onUpdateTask,
    onUpdateColumn,
    column,
    className,
    ...rest
  } = props;

  return (
    <li {...rest} ref={ref} className={clsx(styles.element, className)}>
      <ColumnHead
        title={column.title}
        isPending={false}
        dndListeners={columnsLength > 1 ? dndListeners : undefined}
        onUpdateTitle={
          isDragging ? undefined : async (value) => onUpdateColumn?.(value)
        }
      />
      <Droppable id={column.id}>
        {({ setNodeRef }) => (
          <ul ref={setNodeRef} className={styles.tasks}>
            {column.tasks.map((task) => (
              <Draggable key={task.id} id={task.id}>
                {({ setNodeRef, listeners, attributes, style }) => (
                  <li ref={setNodeRef} {...attributes} style={style}>
                    <ColumnTask
                      title={task.title}
                      isPending={false}
                      onUpdateTitle={
                        isDragging
                          ? undefined
                          : async (value) => onUpdateTask?.(task.id, value)
                      }
                      dndListeners={listeners}
                    />
                  </li>
                )}
              </Draggable>
            ))}
            {!isDragging && onAddTask && (
              <li>
                <InputForm
                  label="Create task"
                  placeholder="Create task"
                  cancel="Cancel task creation"
                  submit="Create task"
                  isPending={false}
                  onFormSubmit={async (value) => onAddTask(value)}
                />
              </li>
            )}
          </ul>
        )}
      </Droppable>
    </li>
  );
};

export const BoardColumn = forwardRef<HTMLLIElement, BoardColumnProps>(
  BoardColumnComponent
);
