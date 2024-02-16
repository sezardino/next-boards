import { type ComponentPropsWithoutRef, type FC } from "react";

import { Button } from "@/components/base/Button";
import { Icon, IconNames } from "@/components/base/Icon";
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import { Typography } from "@/components/base/Typography/Typography";
import { PROJECT_ICONS, PROJECT_ICONS_MAP } from "@/const/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./BoardForm.module.scss";

export type BoardFormValues = {
  title: string;
  description: string;
  icon: IconNames;
};

type Props = {
  onFormSubmit: (values: BoardFormValues) => Promise<any>;
  onCancelClick: () => void;
};

export type BoardFormProps = ComponentPropsWithoutRef<"form"> & Props;

const defaultValues: BoardFormValues = {
  title: "",
  description: "",
  icon: "Grid",
};

const validationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  icon: z
    .string()
    .optional()
    .refine(
      (icon) => (icon ? PROJECT_ICONS.includes(icon as IconNames) : true),
      "Invalid icon"
    ),
});

export const BoardForm: FC<BoardFormProps> = (props) => {
  const { onCancelClick, onFormSubmit, className, ...rest } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BoardFormValues>({
    defaultValues,
    resolver: zodResolver(validationSchema),
  });

  const submitHandler = handleSubmit(async (values) => {
    try {
      await onFormSubmit(values);
      // reset();
    } catch (error) {}
  });

  return (
    <form
      {...rest}
      className={clsx(styles.element, className)}
      onSubmit={submitHandler}
    >
      <div className={styles.wrapper}>
        <Input
          {...register("title")}
          errorMessage={errors.title?.message}
          label="Title"
          placeholder="Study"
        />
        <Autocomplete
          {...register("icon")}
          defaultItems={PROJECT_ICONS_MAP}
          defaultSelectedKey={defaultValues.icon}
          errorMessage={errors.icon?.message}
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

        <Textarea
          {...register("description")}
          label="Description"
          placeholder="Learning"
          description="Short description needed for describe board"
          errorMessage={errors.description?.message}
          className={styles.description}
        />
      </div>
      <footer className={styles.footer}>
        <Button onClick={onCancelClick}>Cancel</Button>
        <Button type="submit" color="primary">
          Create new board
        </Button>
      </footer>
    </form>
  );
};
