import { type FC } from "react";

import { Icon } from "@/components/base/Icon";
import { InputForm } from "@/components/base/InputForm/InputForm";
import { DraggableTask } from "@/components/screens/Board/BoardScreen";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Card, CardHeader, CardProps } from "@nextui-org/react";
import clsx from "clsx";
import styles from "./ColumnTask.module.scss";

type Props = {
  task: DraggableTask;
  onUpdateTitle?: (title: string) => Promise<any>;
  isPending: boolean;
  dndListeners?: SyntheticListenerMap;
  isDragging?: boolean;
  isPlaceholder?: boolean;
};

export type ColumnTaskProps = CardProps & Props;

export const ColumnTask: FC<ColumnTaskProps> = (props) => {
  const {
    task,
    isPlaceholder,
    isDragging,
    dndListeners,
    onUpdateTitle,
    isPending,
    className,
    ...rest
  } = props;

  return (
    <Card
      {...rest}
      className={clsx(styles.element, isDragging && styles.dragging, className)}
    >
      <CardHeader className={styles.header}>
        <InputForm
          label="Change task name"
          placeholder="Change task name"
          cancel="Cancel task name change"
          submit="Change task name"
          initialValue={task.title}
          isPending={isPending}
          disabled={isDragging || isPlaceholder || !onUpdateTitle}
          onFormSubmit={onUpdateTitle ? onUpdateTitle : () => Promise.resolve()}
        />
        {dndListeners && (
          <button type="button" {...dndListeners}>
            <Icon name="GripVertical" />
          </button>
        )}
      </CardHeader>
    </Card>
  );
};
