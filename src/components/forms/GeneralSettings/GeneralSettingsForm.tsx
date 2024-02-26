import { Button } from "@/components/base/Button";
import { Grid } from "@/components/base/Grid/Grid";
import { Input } from "@/components/base/Input/Input";
import { ModalConfirm } from "@/components/ui/ModalConfirm/ModalConfirm";
import { MAX_LOGIN_LENGTH, MAX_NAME_LENGTH } from "@/const/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { isDirty, z } from "zod";
import styles from "./GeneralSettingsForm.module.scss";

export type GeneralSettingsFormValues = {
  login: string;
  name: string;
};

type Props = {
  initialValues: GeneralSettingsFormValues;
  onFormSubmit: (values: GeneralSettingsFormValues) => Promise<any>;
};

export type GeneralSettingsFormProps = ComponentPropsWithoutRef<"form"> & Props;

const validationSchema = z.object({
  login: z.string().max(MAX_LOGIN_LENGTH, `Max ${MAX_LOGIN_LENGTH} characters`),
  name: z.string().max(MAX_NAME_LENGTH, `Max ${MAX_NAME_LENGTH} characters`),
});

export const GeneralSettingsForm: FC<GeneralSettingsFormProps> = (props) => {
  const { initialValues, onFormSubmit, className, ...rest } = props;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<GeneralSettingsFormValues>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
  });

  const submitHandler = handleSubmit(async (values) => {
    if (values.login !== initialValues.login && !isConfirmModalOpen) {
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
          name="login"
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Login"
              placeholder="FunnyCat123"
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Name"
              placeholder="John Doe"
              errorMessage={error?.message}
            />
          )}
        />

        <Button type="submit" disabled={!isDirty} className={styles.submit}>
          Save changes
        </Button>
      </Grid>

      <ModalConfirm
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        heading={{
          title: { tag: "h3", text: "Change Login" },
          description: {
            text: "Are you sure you want to change your login? You will need to use the new login to sign in.",
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
