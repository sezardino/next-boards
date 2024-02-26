"use client";

import {
  useCallback,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { Button } from "@/components/base/Button";
import { Grid } from "@/components/base/Grid/Grid";
import { Typography } from "@/components/base/Typography/Typography";
import { BoardForm, BoardFormValues } from "@/components/forms/Board/BoardForm";
import { Heading } from "@/components/ui/Heading/Heading";
import { ModalConfirm } from "@/components/ui/ModalConfirm/ModalConfirm";
import { BoardBaseDataResponse } from "@/services/bll/modules/board/dto";
import { ActionProp, DataProp } from "@/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import clsx from "clsx";
import styles from "./BoardSettingsScreen.module.scss";

export type BoardSettingsScreenProps = ComponentPropsWithoutRef<"div"> & {
  board: DataProp<BoardBaseDataResponse>;
  updateBoardAction: ActionProp<BoardFormValues, any>;
  onDeleteBoard: () => Promise<void>;
  onArchiveBoard: () => Promise<void>;
};

export const BoardSettingsScreen: FC<BoardSettingsScreenProps> = (props) => {
  const {
    updateBoardAction,
    board,
    onArchiveBoard,
    onDeleteBoard,
    className,
    ...rest
  } = props;
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formKey = useMemo(
    () =>
      board.data && !("error" in board.data)
        ? `${board.data.title}-${board.data.description}-${board.data.icon}`
        : undefined,
    [board.data]
  );

  const modalHandler = useCallback(
    async (type: "archive" | "delete") => {
      try {
        if (type === "archive") {
          await onArchiveBoard();
          setIsArchiveModalOpen(false);
        } else {
          await onDeleteBoard();
          setIsDeleteModalOpen(false);
        }
      } catch (error) {}
    },
    [onArchiveBoard, onDeleteBoard]
  );

  const dangerZoneItems = useMemo(
    () => [
      {
        title: "Delete board",
        action: "Delete",
        handler: () => setIsDeleteModalOpen(true),
      },
      {
        title: "Archive board",
        action: "Archive",
        handler: () => setIsArchiveModalOpen(true),
      },
    ],
    []
  );

  return (
    <>
      <Grid
        {...rest}
        tag="section"
        gap="4"
        className={clsx(styles.element, className)}
      >
        <Heading title={{ tag: "h1", text: `Base settings` }} withDivider />
        <Grid gap="4">
          <BoardForm
            key={formKey}
            withConfirm
            type="update"
            board={board.data}
            isLoading={board.isLoading || updateBoardAction.isPending}
            onFormSubmit={updateBoardAction.action}
          />
          <Card className="border border-danger-500">
            <CardHeader>
              <Heading
                title={{
                  tag: "h2",
                  styling: "lg",
                  text: "Danger zone",
                  color: "danger",
                }}
                withDivider
                className="w-full color-danger-500 border-danger-500"
              />
            </CardHeader>
            <CardBody>
              <ul className={styles.list}>
                {dangerZoneItems.map((item, index) => (
                  <li key={index} className={styles.item}>
                    <Typography
                      tag="h3"
                      styling="md"
                      className="text-danger-500"
                    >
                      {item.title}
                    </Typography>
                    <Button size="sm" color="danger" onClick={item.handler}>
                      {item.action}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Grid>
      </Grid>

      <ModalConfirm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        heading={{
          title: {
            tag: "h2",
            styling: "lg",
            text: "Delete board",
            color: "danger",
          },
          description: {
            text: "Are you sure you want to delete this board? This action is irreversible.",
            styling: "sm",
            color: "default-500",
          },
        }}
        confirm={{
          children: "Delete",
          color: "danger",
          onClick: () => modalHandler("delete"),
        }}
        cancel={{
          children: "Cancel",
          color: "default",
          onClick: () => setIsDeleteModalOpen(false),
        }}
      />

      <ModalConfirm
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        heading={{
          title: {
            tag: "h2",
            styling: "lg",
            text: "Archive board",
            color: "danger",
          },
          description: {
            text: "Are you sure you want to archive this board? It will be moved to the archive and you will be not able to restore it.",
            styling: "sm",
            color: "default-500",
          },
        }}
        confirm={{
          children: "Archive",
          color: "danger",
          onClick: () => modalHandler("archive"),
        }}
        cancel={{
          children: "Cancel",
          color: "default",
          onClick: () => setIsArchiveModalOpen(false),
        }}
      />
    </>
  );
};
