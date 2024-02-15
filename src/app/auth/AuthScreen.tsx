import { TabItem, Tabs } from "@/components/base/Tabs";
import { clsx } from "clsx";
import {
  useCallback,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { Grid } from "@/components/base/Grid/Grid";
import { AuthForm, AuthFormValues } from "../../components/forms/AuthForm";
import { Heading } from "../../components/ui/Heading/Heading";

type Props = {
  onSignIn: (values: AuthFormValues) => Promise<any>;
  onSignUp: (values: AuthFormValues) => Promise<any>;
};

export type AuthScreenType = "sign-in" | "sign-up";

export type AuthScreenProps = ComponentPropsWithoutRef<"div"> & Props;

export const AuthScreen: FC<AuthScreenProps> = (props) => {
  const { onSignIn, onSignUp, className, ...rest } = props;
  const [authType, setAuthType] = useState<AuthScreenType>("sign-in");

  const tabs = useMemo<TabItem<AuthScreenType>[]>(
    () => [
      { id: "sign-in", title: "Has account" },
      { id: "sign-up", title: "No account" },
    ],
    []
  );

  const headingText = useMemo(() => {
    if (authType === "sign-in")
      return {
        title: "Sign In",
        description: "Provide base data to sign in in system",
      };

    return {
      title: "Sign Up",
      description: "Provide base data to sign up in system",
    };
  }, [authType]);

  const signUpHandler = useCallback(
    async (values: AuthFormValues) => {
      try {
        await onSignUp(values);
        setAuthType("sign-in");
      } catch (error) {}
    },
    [onSignUp]
  );

  return (
    <Grid
      tag="section"
      gap="8"
      {...rest}
      className={clsx(
        "p-4 border border-default-200 rounded-md w-full max-w-sm mx-auto",
        className
      )}
    >
      <Grid gap="2">
        <Heading
          title={{ tag: "h1", text: headingText.title }}
          description={{ text: headingText.description }}
        />

        <Tabs
          items={tabs}
          title="Select action"
          selected={authType}
          onSelectedChange={setAuthType}
          className="w-full"
        />
      </Grid>

      <AuthForm
        isSignUp={authType === "sign-up"}
        triggerText={authType === "sign-in" ? "Sign In" : "Sign Up"}
        onFormSubmit={authType === "sign-in" ? onSignIn : signUpHandler}
      />
    </Grid>
  );
};
