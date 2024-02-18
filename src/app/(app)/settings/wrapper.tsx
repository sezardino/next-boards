"use client";

import { GeneralSettingsFormValues } from "@/components/forms/GeneralSettings/GeneralSettingsForm";
import { SettingsScreen } from "@/components/screens/Settings/SettingsScreen";
import { useGeneralSettingsMutation } from "@/hooks/mutations/user/genera-settings";
import { useMeQuery } from "@/hooks/queries/user/me";
import { useCallback } from "react";

export const SettingsPageWrapper = () => {
  const { data: currentUser, isFetching: isCurrentUserLoading } = useMeQuery();

  const { mutateAsync: updateSettings, isPending: isUpdateSettingsLoading } =
    useGeneralSettingsMutation();

  const updateSettingsHandler = useCallback(
    async (data: GeneralSettingsFormValues) => {
      if (!currentUser?.id) throw new Error("User not found");

      return await updateSettings({
        login: data.login !== currentUser.login ? data.login : undefined,
        name: data.name !== currentUser.name ? data.name : undefined,
      });
    },
    [currentUser, updateSettings]
  );

  return (
    <SettingsScreen
      user={{ data: currentUser, isLoading: isCurrentUserLoading }}
      settingsAction={{
        action: updateSettingsHandler,
        isPending: isUpdateSettingsLoading,
      }}
    />
  );
};
