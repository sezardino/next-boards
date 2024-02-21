import { type FC } from "react";

import { Icon } from "@/components/base/Icon";
import { InputForm } from "@/components/base/InputForm/InputForm";
import { Card, CardHeader, CardProps } from "@nextui-org/react";
import clsx from "clsx";
import styles from "./ColumnTask.module.scss";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type Props = {
  title: string;
  onUpdateTitle: (title: string) => Promise<any>;
  isPending: boolean;
  dndListeners?: SyntheticListenerMap;
};

export type ColumnTaskProps = CardProps & Props;

export const ColumnTask: FC<ColumnTaskProps> = (props) => {
  const { dndListeners, title, onUpdateTitle, isPending, className, ...rest } =
    props;

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
          onFormSubmit={onUpdateTitle}
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
