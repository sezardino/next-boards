import { useState, type ComponentPropsWithoutRef, type FC } from "react";

import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Input } from "@/components/base/Input/Input";
import { Textarea } from "@/components/base/Textarea";
import { Typography } from "@/components/base/Typography/Typography";
import { ModalConfirm } from "@/components/ui/ModalConfirm/ModalConfirm";
import { BOARD_ICONS, BOARD_ICONS_MAP, BoardIcon } from "@/const/icons";
import { BoardBaseDataResponse } from "@/services/bll/modules/board/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./BoardForm.module.scss";

export type BoardFormValues = {
  title: string;
  description: string;
  icon: string;
};

type Props = {
  onFormSubmit: (values: BoardFormValues) => Promise<any>;
  board?: BoardBaseDataResponse;
  isLoading: boolean;
  onCancelClick?: () => void;
  type?: "create" | "update";
  withConfirm?: boolean;
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
  icon: z.string().refine((icon) => BOARD_ICONS.includes(icon as BoardIcon), {
    message: "Invalid icon",
    path: ["icon"],
  }),
});

export const BoardForm: FC<BoardFormProps> = (props) => {
  const {
    withConfirm = false,
    isLoading,
    type = "create",
    board,
    onCancelClick,
    onFormSubmit,
    className,
    ...rest
  } = props;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<BoardFormValues>({
    defaultValues: board && !("error" in board) ? board : defaultValues,
    resolver: zodResolver(validationSchema),
  });

  const submitHandler = handleSubmit(async (values) => {
    if (withConfirm && !isConfirmModalOpen) return setIsConfirmModalOpen(true);

    try {
      await onFormSubmit(values);
      setIsConfirmModalOpen(false);
      reset();
    } catch (error) {}
  });

  return (
    <>
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            )}
          />
        </div>

        <footer className={styles.footer}>
          {onCancelClick && <Button onClick={onCancelClick}>Cancel</Button>}
          <Button type="submit" color="primary" disabled={isLoading}>
            {type === "create" ? "Create new board" : "Save changes"}
          </Button>
        </footer>
      </form>

      <ModalConfirm
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        heading={{
          title: { tag: "h3", text: "Change data" },
          description: {
            text: "Are you sure you want to change the data?",
          },
        }}
        confirm={{
          children: "Change data",
          onClick: submitHandler,
          color: "primary",
        }}
        cancel={{
          children: "Cancel",
          variant: "bordered",
          onClick: () => setIsConfirmModalOpen(false),
        }}
      />
    </>
  );
};
