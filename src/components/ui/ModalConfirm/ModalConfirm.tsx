import { type FC } from "react";

import {
  ModalWithDescription,
  ModalWithDescriptionProps,
} from "../ModalWithDescription/ModalWithDescription";

import { Button, ButtonProps } from "@/components/base/Button";

type Props = {
  confirm?: Omit<ButtonProps, "ref">;
  cancel?: Omit<ButtonProps, "ref">;
};

type OmittedProps = Omit<ModalWithDescriptionProps, "footer">;

export type ModalConfirmProps = OmittedProps & Props;

export const ModalConfirm: FC<ModalConfirmProps> = (props) => {
  const { cancel, confirm, className, ...rest } = props;

  return (
    <ModalWithDescription
      {...rest}
      footer={
        <>
          {cancel && <Button {...cancel} />}
          {confirm && <Button {...confirm} />}
        </>
      }
    />
  );
};
