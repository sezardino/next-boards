"use client";

import { AuthScreen } from "@/app/auth/AuthScreen";
import { AuthFormValues } from "@/components/forms/AuthForm";

import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { toast } from "sonner";

const AuthPage = () => {
  const loginHandler = useCallback(async (values: AuthFormValues) => {
    let res = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (res?.ok) {
      toast("Success login", { description: "Welcome back!" });

      // router.replace(PublicPageUrls.home);
      return;
    } else {
      console.log(res);
      toast("Error login", { description: "Something went wrong" });
    }

    return res;
  }, []);

  const signUpHandler = useCallback(async (values: AuthFormValues) => {
    console.log("Sign up", values);
  }, []);

  return <AuthScreen onSignIn={loginHandler} onSignUp={signUpHandler} />;
};

export default AuthPage;
