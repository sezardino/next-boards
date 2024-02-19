import { type ComponentPropsWithoutRef, type FC } from "react";

import { Icon } from "@/components/base/Icon";
import { InputForm } from "@/components/base/InputForm/InputForm";
import clsx from "clsx";
import styles from "./ColumnHead.module.scss";

type Props = {
  title: string;
  onUpdateTitle: (title: string) => Promise<any>;
  isPending: boolean;
};

export type ColumnHeadProps = ComponentPropsWithoutRef<"div"> & Props;

export const ColumnHead: FC<ColumnHeadProps> = (props) => {
  const { title, onUpdateTitle, isPending, className, ...rest } = props;

  return (
    <div {...rest} className={clsx(styles.element, className)}>
      <InputForm
        label="Change column name"
        placeholder="Change column name"
        cancel="Cancel column name change"
        submit="Change column name"
        initialValue={title}
        isPending={isPending}
        onFormSubmit={onUpdateTitle}
      />
      <button type="button">
        <Icon name="GripVertical" />
      </button>
    </div>
  );
};
