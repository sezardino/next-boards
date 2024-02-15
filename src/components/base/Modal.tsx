import { ReactNode, type FC } from "react";

import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
  ModalProps as NextUIModalProps,
} from "@nextui-org/react";

type Props = {
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
};

type OmittedProps = Omit<NextUIModalProps, "backdrop" | "children">;

export type ModalProps = OmittedProps & Props;

export const Modal: FC<ModalProps> = (props) => {
  const { header, footer, children, ...rest } = props;

  return (
    <NextUIModal {...rest} backdrop="blur">
      <ModalContent>
        {header && <ModalHeader>{header}</ModalHeader>}
        {children && <ModalBody>{children}</ModalBody>}
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </NextUIModal>
  );
};
