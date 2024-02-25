import { Fragment, JSX } from "react";

import { Icon } from "@/components/base/Icon";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  ScrollShadow,
} from "@nextui-org/react";
import clsx from "clsx";
import styles from "./DndColumn.module.scss";

type Props<T extends { id: string }> = {
  isDragging?: boolean;
  header: JSX.Element;
  footer?: JSX.Element;
  items: T[];
  itemRenderFun: (item: T) => JSX.Element;
  dndListeners?: SyntheticListenerMap;
};

export type DndColumnProps<T extends { id: string }> = CardProps & Props<T>;

export const DndColumn = <T extends { id: string }>(
  props: DndColumnProps<T>
) => {
  const {
    isDragging,
    dndListeners,
    header,
    footer,
    items,
    itemRenderFun,
    children,
    className,
    ...rest
  } = props;

  return (
    <Card
      {...rest}
      className={clsx(styles.element, isDragging && styles.dragging, className)}
    >
      <CardHeader className={styles.header}>
        {header}
        {(isDragging || dndListeners) && (
          <button type="button" {...dndListeners}>
            <Icon name="GripVertical" />
          </button>
        )}
      </CardHeader>
      <ScrollShadow as={CardBody} className={styles.body}>
        <ul className={styles.tasks}>
          {items.map((item) => (
            <Fragment key={item.id}>{itemRenderFun(item)}</Fragment>
          ))}
        </ul>
      </ScrollShadow>

      {footer && <CardFooter className={styles.footer}>{footer}</CardFooter>}
    </Card>
  );
};
