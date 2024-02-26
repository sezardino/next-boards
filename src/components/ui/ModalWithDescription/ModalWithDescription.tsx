import { type FC } from "react";
import { Modal, ModalProps } from "../../base/Modal";
import { Heading, HeadingProps } from "../Heading/Heading";

import styles from "./ModalWithDescription.module.scss";

type Props = {
  heading: HeadingProps;
};

type OmittedProps = Omit<ModalProps, "header">;

export type ModalWithDescriptionProps = OmittedProps & Props;

export const ModalWithDescription: FC<ModalWithDescriptionProps> = (props) => {
  const { heading, ...rest } = props;

  return (
    <Modal
      {...rest}
      header={<Heading {...heading} className={styles.header} />}
    />
  );
};
