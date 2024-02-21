import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useRef,
  useState,
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
  const [isManualFocus, setIsManualFocus] = useState(false);

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
    setIsManualFocus(false);
  });

  const keyDownHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (evt.key === "Enter") {
      submitHandler();
    }

    if (evt.key === "Escape") {
      reset();
      evt.currentTarget.blur();
    }
  };

  const blurHandler = (evt: FocusEvent<HTMLInputElement, Element>) => {
    setIsManualFocus(true);

    register("value").onBlur(evt);
  };

  const resetButtonHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    reset();
    evt.currentTarget.blur();
    setIsManualFocus(false);
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
        className={clsx(styles.input, isManualFocus && styles.focus)}
        onKeyDown={keyDownHandler}
        onBlur={blurHandler}
      />
      <footer
        className={clsx(
          styles.footer,
          isManualFocus ? styles.visible : "group-focus-within:flex"
        )}
      >
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
