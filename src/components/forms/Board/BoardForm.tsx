import { type ComponentPropsWithoutRef, type FC } from "react";

import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Input } from "@/components/base/Input/Input";
import { Textarea } from "@/components/base/Textarea";
import { Typography } from "@/components/base/Typography/Typography";
import { BOARD_ICONS, BOARD_ICONS_MAP, BoardIcon } from "@/const/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./BoardForm.module.scss";

export type BoardFormValues = {
  title: string;
  description: string;
  icon: BoardIcon;
};

type Props = {
  onFormSubmit: (values: BoardFormValues) => Promise<any>;
  initialValues?: BoardFormValues;
  onCancelClick?: () => void;
  type?: "create" | "update";
};

export type BoardFormProps = ComponentPropsWithoutRef<"form"> & Props;

const defaultValues: BoardFormValues = {
  title: "",
  description: "",
  icon: "Grid",
};

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 100;

const validationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(MAX_TITLE_LENGTH, `Max ${MAX_TITLE_LENGTH} characters`),
  description: z
    .string({ required_error: "Description is required" })
    .max(MAX_DESCRIPTION_LENGTH, `Max ${MAX_DESCRIPTION_LENGTH} characters`)
    .optional(),
  icon: z.enum(BOARD_ICONS, { invalid_type_error: "Wrong icon" }),
});

export const BoardForm: FC<BoardFormProps> = (props) => {
  const {
    type = "create",
    initialValues,
    onCancelClick,
    onFormSubmit,
    className,
    ...rest
  } = props;

  const { control, handleSubmit, reset } = useForm<BoardFormValues>({
    defaultValues: initialValues || defaultValues,
    resolver: zodResolver(validationSchema),
  });

  const submitHandler = handleSubmit(async (values) => {
    try {
      await onFormSubmit(values);
      reset();
    } catch (error) {}
  });

  return (
    <form
      {...rest}
      className={clsx(styles.element, className)}
      onSubmit={submitHandler}
    >
      <div className={styles.wrapper}>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              errorMessage={error?.message}
              label="Title"
              placeholder="Study"
            />
          )}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              defaultItems={BOARD_ICONS_MAP}
              defaultSelectedKey={defaultValues.icon}
              errorMessage={error?.message}
              label="Icon"
              placeholder="Grid2X2"
              classNames={{
                listboxWrapper: styles.listboxWrapper,
              }}
              labelPlacement="outside"
            >
              {(icon) => (
                <AutocompleteItem key={icon.value} textValue={icon.value}>
                  <div className={styles.item}>
                    <Icon name={icon.id} size={20} />
                    <Typography tag="small" styling="sm">
                      {icon.id}
                    </Typography>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <Textarea
              {...field}
              label="Description"
              placeholder="Learning"
              description="Short description needed for describe board"
              errorMessage={error?.message}
              className={styles.description}
            />
          )}
        />
      </div>

      <footer className={styles.footer}>
        {onCancelClick && <Button onClick={onCancelClick}>Cancel</Button>}
        <Button type="submit" color="primary">
          {type === "create" ? "Create new board" : "Save changes"}
        </Button>
      </footer>
    </form>
  );
};
