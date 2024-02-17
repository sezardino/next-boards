"use client";

import { AuthFormValues } from "@/components/forms/AuthForm";
import { AuthScreen } from "@/components/screens/Auth/AuthScreen";
import { PageUrls } from "@/const/url";
import { useSignUpMutation } from "@/hooks/mutations/auth/sign-up";
import { Metadata } from "next";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export const metadata: Metadata = {
  title: "Authorization",
};

const AuthPage = () => {
  const { mutateAsync: signUp } = useSignUpMutation();
  const router = useRouter();

  const loginHandler = useCallback(
    async (values: AuthFormValues) => {
      let res = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (res?.ok) {
        toast("Success login", { description: "Welcome back!" });

        router.replace(PageUrls.home);
        return;
      } else {
        toast("Error login", { description: res?.error });
        return Promise.reject();
      }

      return res;
    },
    [router]
  );

  return <AuthScreen onSignIn={loginHandler} onSignUp={signUp} />;
};

export default AuthPage;
