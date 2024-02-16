"use client";

import { Grid } from "@/components/base/Grid/Grid";
import styles from "./HomeScreen.module.scss";

import { IconNames } from "@/components/base/Icon";
import { SearchForm } from "@/components/base/SearchForm";
import { Typography } from "@/components/base/Typography/Typography";
import { BoardForm, BoardFormValues } from "@/components/forms/Board/BoardForm";
import { BoardCard } from "@/components/modules/board/BoardCard/BoardCard";
import { Heading } from "@/components/ui/Heading/Heading";
import { ModalWithDescription } from "@/components/ui/ModalWithDescription/ModalWithDescription";
import {
  AllBoardsResponse,
  CreateBoardDto,
  CreateBoardResponse,
} from "@/services/bll/modules/board/dto";
import { ActionProp, DataProp, EntityStatusWithoutDeleted } from "@/types";
import { Button, Select, SelectItem, Skeleton } from "@nextui-org/react";
import { EntityStatus } from "@prisma/client";
import clsx from "clsx";
import { ComponentPropsWithoutRef, FC, useCallback, useState } from "react";

type Props = {
  // TODO: need to add properly disabled state to form
  search: string;
  onSearchChange: (value: string) => void;
  createBoardAction: ActionProp<CreateBoardDto, CreateBoardResponse>;
  boards: DataProp<AllBoardsResponse["boards"]>;
  statusFilter: EntityStatusWithoutDeleted;
  onStatusFilterChange: (status: EntityStatusWithoutDeleted) => void;
};

export type HomeScreenProps = ComponentPropsWithoutRef<"section"> & Props;

const statusFilters: { value: EntityStatusWithoutDeleted; label: string }[] = [
  { label: "Active", value: EntityStatus.ACTIVE },
  { label: "Archive", value: EntityStatus.INACTIVE },
];

export const HomeScreen: FC<HomeScreenProps> = (props) => {
  const {
    statusFilter,
    onStatusFilterChange,
    boards,
    createBoardAction,
    search,
    onSearchChange,
    className,
    ...rest
  } = props;
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  const createBoardHandler = useCallback(
    async (values: BoardFormValues) => {
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
          <div className={styles.filters}>
            {/* TODO: add select with check active/archive */}
            <SearchForm placeholder="Search" onSearch={onSearchChange} />
            <Select
              items={statusFilters}
              defaultSelectedKeys={[statusFilter]}
              labelPlacement="outside"
              className={styles.filter}
              onSelectionChange={(selection) =>
                onStatusFilterChange(
                  Array.from(selection)[0] as EntityStatusWithoutDeleted
                )
              }
              aria-label="Filter boards by status (active/archive)"
            >
              {(filter) => (
                <SelectItem
                  key={filter.value}
                  value={filter.value}
                  textValue={filter.label}
                >
                  <Typography tag="span">{filter.label}</Typography>
                </SelectItem>
              )}
            </Select>
          </div>

          <Button
            color="primary"
            onClick={() => setIsCreateBoardModalOpen(true)}
          >
            Create board
          </Button>
        </div>
        <ul className={styles.list}>
          {boards.isLoading &&
            new Array(10).fill(0).map((_, i) => (
              <li key={i}>
                <Skeleton className={styles.skeleton} />
              </li>
            ))}

          {!boards.isLoading &&
            boards.data?.map((board) => (
              <li key={board.id}>
                <BoardCard
                  href=""
                  title={board.title}
                  columns={board._count.columns}
                  tasks={board._count.tasks}
                  description={board.description}
                  icon={board.icon as IconNames}
                />
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
