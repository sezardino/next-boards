"use client";

import { SecuritySettingsFormValues } from "@/components/forms/SecuritySettings/SecuritySettingsForm";
import { SettingsSecurityScreen } from "@/components/screens/SettingsSecurity/SettingsSecurityScreen";
import { useSecuritySettingsMutation } from "@/hooks/mutations/user/security-settings";
import { useMeQuery } from "@/hooks/queries/user/me";
import { useCallback } from "react";

export const SettingsSecurityPageWrapper = () => {
  const { data: currentUser } = useMeQuery();

  const { mutateAsync: updateSettings, isPending: isUpdateSettingsLoading } =
    useSecuritySettingsMutation();

  const updateSettingsHandler = useCallback(
    async (data: SecuritySettingsFormValues) => {
      if (!currentUser?.id) throw new Error("User not found");

      return await updateSettings({
        newPassword: data.newPassword,
        oldPassword: data.password,
      });
    },
    [currentUser, updateSettings]
  );

  return (
    <SettingsSecurityScreen
      settingsAction={{
        action: updateSettingsHandler,
        isPending: isUpdateSettingsLoading,
      }}
    />
  );
};
