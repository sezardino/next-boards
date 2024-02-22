import {
  ComponentPropsWithoutRef,
  ForwardRefRenderFunction,
  forwardRef,
  useMemo,
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

import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import styles from "./BoardColumn.module.scss";

type PickedColumnHeadProps = Pick<ColumnHeadProps, "dndListeners">;

type Props = {
  columnsLength: number;
  column: { id: string; title: string; tasks: { id: string; title: string }[] };
  onUpdateColumn?: (title: string) => Promise<any>;
  onAddTask?: (title: string) => Promise<any>;
  onUpdateTask?: (id: string, title: string) => Promise<any>;
  isDragging?: boolean;
  isPlaceholder?: boolean;
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
    <Card
      as="li"
      {...rest}
      // @ts-ignore
      ref={ref}
      className={clsx(styles.element, isDragging && styles.dragging, className)}
    >
      {!isDragging && (
        <>
          <CardHeader
            as={ColumnHead}
            title={column.title}
            isPending={false}
            isDragging={isPlaceholder}
            dndListeners={columnsLength > 1 ? dndListeners : undefined}
            className={styles.head}
            onUpdateTitle={
              isPlaceholder
                ? undefined
                : async (value: string) => onUpdateColumn?.(value)
            }
          />

          <CardBody>
            <Droppable id={column.id}>
              {({ setNodeRef }) => (
                <ul ref={setNodeRef} className={styles.tasks}>
                  <SortableContext
                    items={taskIds}
                    strategy={horizontalListSortingStrategy}
                  >
                    {column.tasks?.map((task) => (
                      <Draggable
                        key={task.id}
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
                              title={task.title}
                              isPending={false}
                              isDragging={isDragging || isTaskDragging}
                              onUpdateTitle={async (value) =>
                                onUpdateTask?.(task.id, value)
                              }
                              dndListeners={listeners}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                  </SortableContext>

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
              )}
            </Droppable>
          </CardBody>
        </>
      )}
    </Card>
  );
};

export const BoardColumn = forwardRef<HTMLLIElement, BoardColumnProps>(
  BoardColumnComponent
);
