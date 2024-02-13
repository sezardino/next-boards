import { TabItem, Tabs } from "@/components/base/Tabs";
import { clsx } from "clsx";
import {
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { Grid } from "@/components/base/Grid";
import { AuthForm } from "../../components/forms/AuthForm";
import { Heading } from "../ui/Heading";

type Props = {};

type AuthType = "login" | "register";

export type AuthScreenProps = ComponentPropsWithoutRef<"div"> & Props;

export const AuthScreen: FC<AuthScreenProps> = (props) => {
  const { className, ...rest } = props;
  const [authType, setAuthType] = useState<AuthType>("login");

  const tabs = useMemo<TabItem<AuthType>[]>(
    () => [
      { id: "login", title: "Has account" },
      { id: "register", title: "No account" },
    ],
    []
  );

  const headingText = useMemo(() => {
    if (authType === "login")
      return {
        title: "Sign In",
        description: "Provide base data to sign in in system",
      };

    return {
      title: "Sign Up",
      description: "Provide base data to sign up in system",
    };
  }, [authType]);

  return (
    <Grid
      tag="section"
      gap={8}
      {...rest}
      className={clsx(
        "p-4 border border-default-200 rounded-md w-full max-w-sm mx-auto",
        className
      )}
    >
      <Grid gap={2}>
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
        type={authType}
        triggerText={authType === "login" ? "Sign In" : "Sign Up"}
        onFormSubmit={() => undefined}
      />
    </Grid>
  );
};
