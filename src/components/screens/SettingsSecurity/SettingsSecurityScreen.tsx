"use client";

import styles from "./SettingsSecurityScreen.module.scss";

import {
  SecuritySettingsForm,
  SecuritySettingsFormValues,
} from "@/components/forms/SecuritySettings/SecuritySettingsForm";
import { Heading } from "@/components/ui/Heading/Heading";
import { UserSecuritySettingsResponse } from "@/services/bll/modules/user/dto";
import { ActionProp } from "@/types";
import clsx from "clsx";
import { ComponentPropsWithoutRef, FC } from "react";

type Props = {
  settingsAction: ActionProp<
    SecuritySettingsFormValues,
    UserSecuritySettingsResponse
  >;
};

export type SettingsSecurityScreenProps = ComponentPropsWithoutRef<"section"> &
  Props;

export const SettingsSecurityScreen: FC<SettingsSecurityScreenProps> = (
  props
) => {
  const { settingsAction, className, ...rest } = props;

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: "Security Settings" }}
        description={{
          text: "You can update settings for secure your account.",
        }}
        withDivider
      />

      <SecuritySettingsForm
        onFormSubmit={settingsAction.action}
        isPending={settingsAction.isPending}
      />
    </section>
  );
};
