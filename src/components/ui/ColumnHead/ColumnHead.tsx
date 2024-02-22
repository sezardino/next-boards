import { type ComponentPropsWithoutRef, type FC } from "react";

import { Icon } from "@/components/base/Icon";
import { InputForm } from "@/components/base/InputForm/InputForm";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import clsx from "clsx";
import styles from "./ColumnHead.module.scss";

type Props = {
  title: string;
  onUpdateTitle?: (title: string) => Promise<any>;
  isPending: boolean;
  dndListeners?: SyntheticListenerMap;
  isDragging?: boolean;
};

export type ColumnHeadProps = ComponentPropsWithoutRef<"div"> & Props;

export const ColumnHead: FC<ColumnHeadProps> = (props) => {
  const {
    title,
    onUpdateTitle,
    isPending,
    isDragging,
    dndListeners,
    className,
    ...rest
  } = props;

  return (
    <div {...rest} className={clsx(styles.element, className)}>
      <InputForm
        label="Change column name"
        placeholder="Change column name"
        cancel="Cancel column name change"
        submit="Change column name"
        initialValue={title}
        isPending={isPending}
        disabled={!onUpdateTitle}
        onFormSubmit={onUpdateTitle ? onUpdateTitle : () => Promise.resolve()}
      />
      {(isDragging || dndListeners) && (
        <button type="button" {...dndListeners}>
          <Icon name="GripVertical" />
        </button>
      )}
    </div>
  );
};
