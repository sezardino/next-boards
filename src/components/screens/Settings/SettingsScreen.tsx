"use client";

import {
  GeneralSettingsForm,
  GeneralSettingsFormValues,
} from "@/components/forms/GeneralSettings/GeneralSettingsForm";
import styles from "./SettingsScreen.module.scss";

import { Heading } from "@/components/ui/Heading/Heading";
import {
  MeResponse,
  UserGeneralSettingsResponse,
} from "@/services/bll/modules/user/dto";
import { ActionProp, DataProp } from "@/types";
import clsx from "clsx";
import { ComponentPropsWithoutRef, FC } from "react";

type Props = {
  user: DataProp<MeResponse>;
  settingsAction: ActionProp<
    GeneralSettingsFormValues,
    UserGeneralSettingsResponse
  >;
};

export type SettingsScreenProps = ComponentPropsWithoutRef<"section"> & Props;

export const SettingsScreen: FC<SettingsScreenProps> = (props) => {
  const { settingsAction, user, className, ...rest } = props;

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: "General Settings" }}
        description={{ text: "you can update general data." }}
        withDivider
      />

      {user.data && !user.isLoading && (
        <GeneralSettingsForm
          initialValues={{ login: user.data.login, name: user.data.name }}
          onFormSubmit={settingsAction.action}
        />
      )}
    </section>
  );
};
