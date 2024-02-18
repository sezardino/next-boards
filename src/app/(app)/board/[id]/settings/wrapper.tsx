"use client";

import { BoardSettingsScreen } from "@/components/screens/BoardSettings/BoardSettingsScreen";

export const BoardSettingsPageWrapper = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  return <BoardSettingsScreen boardId={id} />;
};
