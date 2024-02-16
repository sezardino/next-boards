"use client";

import { Grid } from "@/components/base/Grid/Grid";
import styles from "./HomeScreen.module.scss";

import { SearchForm } from "@/components/base/SearchForm";
import { BoardForm, BoardFormValues } from "@/components/forms/Board/BoardForm";
import { BoardCard } from "@/components/modules/board/BoardCard/BoardCard";
import { Heading } from "@/components/ui/Heading/Heading";
import { ModalWithDescription } from "@/components/ui/ModalWithDescription/ModalWithDescription";
import {
  CreateBoardDto,
  CreateBoardResponse,
} from "@/services/bll/modules/board/dto";
import { ActionProps } from "@/types";
import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { ComponentPropsWithoutRef, FC, useCallback, useState } from "react";

type Props = {
  // TODO: need to add properly disabled state to form
  search: string;
  onSearchChange: (value: string) => void;
  createBoardAction: ActionProps<CreateBoardDto, CreateBoardResponse>;
};

export type HomeScreenProps = ComponentPropsWithoutRef<"section"> & Props;

export const HomeScreen: FC<HomeScreenProps> = (props) => {
  const { createBoardAction, search, onSearchChange, className, ...rest } =
    props;
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  const createBoardHandler = useCallback(
    async (values: BoardFormValues) => {
      console.log(values);
      await createBoardAction.action(values);
      setIsCreateBoardModalOpen(false);
    },
    [createBoardAction]
  );

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <Heading
        title={{ tag: "h1", text: "Active boards" }}
        description={{ text: "Manage your boards" }}
        withDivider
      />

      <Grid gap="4">
        <div className={styles.wrapper}>
          <div>
            {/* TODO: add select with check active/archive */}
            <SearchForm placeholder="Search" onSearch={onSearchChange} />
          </div>

          <Button
            color="primary"
            onClick={() => setIsCreateBoardModalOpen(true)}
          >
            Create board
          </Button>
        </div>

        <ul className={styles.list}>
          {new Array(10).fill(0).map((_, i) => (
            <li key={i}>
              <BoardCard href="" title={i.toString()} columns={0} tasks={0} />
            </li>
          ))}
        </ul>
      </Grid>

      <ModalWithDescription
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        size="xl"
        heading={{
          title: { text: "Create board", tag: "h2" },
          description: { text: "Create new board from scratch" },
          withDivider: true,
        }}
      >
        <BoardForm
          onFormSubmit={createBoardHandler}
          onCancelClick={() => setIsCreateBoardModalOpen(false)}
        />
      </ModalWithDescription>
    </section>
  );
};
