import { type FC } from "react";

import { Icon } from "@/components/base/Icon";
import { InputForm } from "@/components/base/InputForm/InputForm";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Card, CardHeader, CardProps } from "@nextui-org/react";
import clsx from "clsx";
import styles from "./ColumnTask.module.scss";

type Props = {
  title: string;
  onUpdateTitle?: (title: string) => Promise<any>;
  isPending: boolean;
  dndListeners?: SyntheticListenerMap;
  isDragging?: boolean;
  isPlaceholder?: boolean;
};

export type ColumnTaskProps = CardProps & Props;

export const ColumnTask: FC<ColumnTaskProps> = (props) => {
  const {
    isPlaceholder,
    isDragging,
    dndListeners,
    title,
    onUpdateTitle,
    isPending,
    className,
    ...rest
  } = props;

  return (
    <Card {...rest} className={clsx(styles.element, className)}>
      <CardHeader className={styles.header}>
        <InputForm
          label="Change task name"
          placeholder="Change task name"
          cancel="Cancel task name change"
          submit="Change task name"
          initialValue={title}
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
