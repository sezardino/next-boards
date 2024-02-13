"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useEffect,
  useMemo,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../base/Button";
import { Grid } from "../base/Grid";
import { Input } from "../base/Input";
import { type } from "os";

export type AuthFormValues = {
  email: string;
  password: string;
  passwordConfirmation?: string;
};

type Props = {
  onFormSubmit: (values: AuthFormValues) => void;
  isSignUp: boolean;
  triggerText: string;
};

export type AuthFormProps = ComponentPropsWithoutRef<"form"> & Props;

const initialValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
};

export const AuthForm: FC<AuthFormProps> = (props) => {
  const { triggerText, isSignUp, onFormSubmit, className, ...rest } = props;

  const validationSchema = useMemo(
    () =>
      z
        .object({
          email: z.string().email(),
          password: z.string().min(6),
          passwordConfirmation: isSignUp
            ? z.string().min(6)
            : z.string().optional(),
        })
        .refine(
          (data) =>
            isSignUp ? data.password === data.passwordConfirmation : true,
          {
            path: ["passwordConfirmation"],
            message: "Passwords do not match",
          }
        ),
    [type]
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
  });

  const submitHandler = handleSubmit((values) => {
    console.log(values);
  });

  useEffect(() => {
    const values = getValues();

    if (!values.email) setError("email", {});
    if (!values.password) setError("password", {});
    if (!values.passwordConfirmation) setError("passwordConfirmation", {});
  }, [type]);

  return (
    <Grid
      tag="form"
      gap={4}
      {...rest}
      className={className}
      onSubmit={submitHandler}
    >
      <Input
        {...register("email")}
        label="Email"
        errorMessage={errors.email?.message}
      />
      <Input
        {...register("password")}
        label="Password"
        type="password"
        errorMessage={errors.password?.message}
      />
      {isSignUp && (
        <Input
          {...register("passwordConfirmation")}
          label="Password"
          type="password"
          errorMessage={errors.email?.message}
        />
      )}

      <Button type="submit">{triggerText}</Button>
    </Grid>
  );
};
