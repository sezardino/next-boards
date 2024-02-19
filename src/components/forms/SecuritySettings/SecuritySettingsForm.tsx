import { Button } from "@/components/base/Button";
import { Grid } from "@/components/base/Grid/Grid";
import { Input } from "@/components/base/Input/Input";
import { ModalConfirm } from "@/components/ui/ModalConfirm/ModalConfirm";
import { MAX_LOGIN_LENGTH, MAX_NAME_LENGTH } from "@/const/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./SecuritySettingsForm.module.scss";

export type SecuritySettingsFormValues = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

type Props = {
  onFormSubmit: (values: SecuritySettingsFormValues) => Promise<any>;
  isPending: boolean;
};

export type SecuritySettingsFormProps = ComponentPropsWithoutRef<"form"> &
  Props;

const validationSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .max(MAX_LOGIN_LENGTH, `Max ${MAX_LOGIN_LENGTH} characters`),
    newPassword: z
      .string({ required_error: "New password is required" })
      .max(MAX_NAME_LENGTH, `Max ${MAX_NAME_LENGTH} characters`),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .max(MAX_NAME_LENGTH, `Max ${MAX_NAME_LENGTH} characters`),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SecuritySettingsForm: FC<SecuritySettingsFormProps> = (props) => {
  const { isPending, onFormSubmit, className, ...rest } = props;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SecuritySettingsFormValues>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    if (values.newPassword && !isConfirmModalOpen) {
      setIsConfirmModalOpen(true);
      return;
    }

    try {
      await onFormSubmit(values);
      setIsConfirmModalOpen(false);
      reset();
    } catch (error) {}
  });

  return (
    <>
      <Grid
        {...rest}
        tag="form"
        gap="4"
        className={clsx(styles.element, className)}
        onSubmit={submitHandler}
      >
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              {...field}
              label="Current Password"
              placeholder="********"
              type="password"
              disabled={isPending}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          render={({ field }) => (
            <Input
              {...field}
              label="New Password"
              placeholder="********"
              type="password"
              disabled={isPending}
              errorMessage={errors.newPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <Input
              {...field}
              label="Confirm New Password"
              placeholder="********"
              type="password"
              disabled={isPending}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          type="submit"
          disabled={!isDirty || isPending}
          className={styles.submit}
        >
          Save changes
        </Button>
      </Grid>

      <ModalConfirm
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        heading={{
          title: { tag: "h3", text: "Change Password" },
          description: {
            text: "Are you sure you want to change your password?",
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
