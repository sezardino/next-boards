"use client";

import { MAX_LOGIN_LENGTH } from "@/const/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useEffect,
  useMemo,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../base/Button";
import { Grid } from "../../base/Grid/Grid";
import { Input } from "../../base/Input/Input";

export type AuthFormValues = {
  login: string;
  password: string;
  passwordConfirmation?: string;
};

type Props = {
  onFormSubmit: (values: AuthFormValues) => Promise<any>;
  isSignUp: boolean;
  triggerText: string;
};

export type AuthFormProps = ComponentPropsWithoutRef<"form"> & Props;

const initialValues = {
  login: "",
  password: "",
  passwordConfirmation: "",
};

export const AuthForm: FC<AuthFormProps> = (props) => {
  const { triggerText, isSignUp, onFormSubmit, className, ...rest } = props;

  const validationSchema = useMemo(
    () =>
      z
        .object({
          login: z
            .string()
            .max(MAX_LOGIN_LENGTH, `Max ${MAX_LOGIN_LENGTH} characters`),
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
    [isSignUp]
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    reset,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
  });

  const submitHandler = handleSubmit(async (values) => {
    try {
      await onFormSubmit(values);
      reset();
    } catch (error) {}
  });

  useEffect(() => {
    const values = getValues();

    if (!values.login) setError("login", {});
    if (!values.password) setError("password", {});
    if (!values.passwordConfirmation) setError("passwordConfirmation", {});
  }, [isSignUp]);

  return (
    <Grid
      tag="form"
      gap="4"
      {...rest}
      className={className}
      onSubmit={submitHandler}
    >
      <Input
        {...register("login")}
        label="Login"
        placeholder="FunnyCat123"
        errorMessage={errors.login?.message}
      />
      <Input
        {...register("password")}
        label="Password"
        type="password"
        placeholder="******"
        errorMessage={errors.password?.message}
      />
      {isSignUp && (
        <Input
          {...register("passwordConfirmation")}
          label="Password"
          type="password"
          placeholder="******"
          errorMessage={errors.passwordConfirmation?.message}
        />
      )}

      <Button type="submit">{triggerText}</Button>
    </Grid>
  );
};
