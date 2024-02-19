import {
  FocusEvent,
  KeyboardEvent,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { cn } from "@nextui-org/react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { Icon } from "../Icon";
import styles from "./InputForm.module.scss";

type InputFormValues = {
  value: string;
};

type Props = {
  initialValue?: string;
  onFormSubmit: (value: string) => Promise<any>;
  isPending: boolean;
  label: string;
  placeholder: string;
  submit: string;
  cancel: string;
};

export type InputFormProps = ComponentPropsWithoutRef<"form"> & Props;

export const InputForm: FC<InputFormProps> = (props) => {
  const {
    submit,
    cancel,
    label,
    placeholder,
    isPending,
    initialValue,
    onFormSubmit,
    className,
    ...rest
  } = props;
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InputFormValues>({
    defaultValues: {
      value: initialValue || "",
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    await onFormSubmit(values.value);
    setIsFooterVisible(false);
    reset();
  });

  const blurHandler = (evt: FocusEvent<HTMLInputElement>) => {
    register("value").onBlur(evt);

    if (evt.currentTarget.value === initialValue) setIsFooterVisible(false);
  };

  const focusHandler = (evt: FocusEvent<HTMLInputElement>) =>
    setIsFooterVisible(true);

  const keyDownHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      submitHandler();
      evt.currentTarget.blur();
    }

    if (evt.key === "Escape") {
      reset();
      evt.currentTarget.blur();
    }
  };

  const isDisabled = isPending || isSubmitting;

  return (
    <form
      {...rest}
      className={cn(styles.element, className)}
      onSubmit={submitHandler}
      aria-label={label}
    >
      <input
        {...register("value")}
        type="text"
        name="value"
        placeholder={placeholder}
        disabled={isDisabled}
        className={styles.input}
        onBlur={blurHandler}
        onFocus={focusHandler}
        onKeyDown={keyDownHandler}
      />
      <footer
        className={clsx(styles.footer, isFooterVisible && styles.visible)}
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
          type="reset"
          disabled={isDisabled}
          isIconOnly
          size="sm"
          aria-label={cancel}
        >
          <Icon name="X" size={16} />
        </Button>
      </footer>
    </form>
  );
};
