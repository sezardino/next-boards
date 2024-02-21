import {
  KeyboardEvent,
  MouseEvent,
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@nextui-org/react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../Button";
import { Icon } from "../Icon";
import styles from "./InputForm.module.scss";

type InputFormValues = {
  value: string;
};

type Props = {
  initialValue?: string;
  onFormSubmit?: (value: string) => Promise<any>;
  isPending: boolean;
  label: string;
  placeholder: string;
  submit: string;
  cancel: string;
  disabled?: boolean;
};

export type InputFormProps = ComponentPropsWithoutRef<"form"> & Props;

const validationSchema = z.object({
  value: z.string().min(1),
});

export const InputForm: FC<InputFormProps> = (props) => {
  const {
    submit,
    cancel,
    label,
    placeholder,
    isPending,
    initialValue,
    disabled,
    onFormSubmit,
    className,
    ...rest
  } = props;
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InputFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      value: initialValue || "",
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    if (disabled || !onFormSubmit) return;

    await onFormSubmit(values.value);
    reset();
  });

  const keyDownHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (evt.key === "Enter") {
      submitHandler();
    }

    if (evt.key === "Escape") {
      reset();
    }
  };

  const resetButtonHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    reset();
    evt.currentTarget.blur();
  };

  const isDisabled = isPending || isSubmitting || disabled;

  return (
    <form
      {...rest}
      ref={formRef}
      className={cn(styles.element, "group", className)}
      onSubmit={submitHandler}
      aria-label={label}
    >
      <input
        {...register("value")}
        type="text"
        name="value"
        placeholder={placeholder}
        disabled={isDisabled}
        className={clsx(styles.input, "")}
        onKeyDown={keyDownHandler}
      />
      <footer className={clsx(styles.footer, "group-focus-within:flex")}>
        <Button
          type="submit"
          disabled={isDisabled}
          isIconOnly
          size="sm"
          aria-label={submit}
        >
          <Icon name="Check" size={16} />
        </Button>
        <Button
          disabled={isDisabled}
          isIconOnly
          size="sm"
          onClick={resetButtonHandler}
          aria-label={cancel}
        >
          <Icon name="X" size={16} />
        </Button>
      </footer>
    </form>
  );
};
