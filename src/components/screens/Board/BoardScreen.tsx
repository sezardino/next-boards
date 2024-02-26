"use client";

import {
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
} from "react";

import { Icon } from "@/components/base/Icon";
import { TabItem, Tabs } from "@/components/base/Tabs";
import { Typography } from "@/components/base/Typography/Typography";
import { KanbanView } from "@/components/modules/board/KanbanView/KanbanView";
import { BoardView } from "@/services/bll/modules/board/dto";
import { BoardInformation } from "@/services/bll/modules/board/dto/information";
import {
  AddColumnResponse,
  UpdateColumnDto,
  UpdateColumnResponse,
} from "@/services/bll/modules/column/dto";
import {
  AddTaskDto,
  AddTaskResponse,
  UpdateTaskDto,
  UpdateTaskResponse,
} from "@/services/bll/modules/task/dto";
import { ActionProp, DataProp } from "@/types";
import clsx from "clsx";
import styles from "./BoardScreen.module.scss";
import { useBoardScreen } from "./use-board-screen";

export type BoardScreenProps = ComponentPropsWithoutRef<"div"> & {
  view: DataProp<BoardView>;
  board: DataProp<BoardInformation>;
  addColumnAction: ActionProp<string, AddColumnResponse>;
  addTaskAction: ActionProp<Omit<AddTaskDto, "boardId">, AddTaskResponse>;
  updateColumnAction: ActionProp<
    Omit<UpdateColumnDto, "boardId">,
    UpdateColumnResponse
  >;
  updateTaskAction: ActionProp<
    Omit<UpdateTaskDto, "boardId">,
    UpdateTaskResponse
  >;
};

export type DraggableTask = BoardView["tasks"][number];
export type DraggableColumn = Omit<BoardView["columns"][number], "tasks"> & {
  tasks: DraggableTask[];
};

type BoardViewType = "list" | "kanban";

export const BoardScreen: FC<BoardScreenProps> = (props) => {
  const {
    view,
    board,
    addColumnAction,
    addTaskAction,
    updateColumnAction,
    updateTaskAction,
    className,
    ...rest
  } = props;

  const {
    formattedColumns,
    addColumn,
    updateColumnTitle,
    updateColumnOrder,
    //
    addTask,
    updateTaskTitle,
    updateTaskColumnBaseOnColumn,
    updateTaskOrder,
  } = useBoardScreen({
    columns: view.data?.columns,
    tasks: view.data?.tasks,
    onUpdateColumn: updateColumnAction.action,
    onUpdateTask: updateTaskAction.action,
    onAddColumn: addColumnAction.action,
    onAddTask: addTaskAction.action,
  });

  const [viewType, setViewType] = useState<BoardViewType>("kanban");

  const tabs = useMemo<TabItem<BoardViewType>[]>(
    () => [
      {
        id: "kanban",
        title: (
          <div className={styles.tab}>
            <Icon name="Kanban" />
            <Typography tag="span" styling="xs">
              Kanban
            </Typography>
          </div>
        ),
      },
      {
        id: "list",
        title: (
          <div className={styles.tab}>
            <Icon name="List" />{" "}
            <Typography tag="span" styling="xs">
              List
            </Typography>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section {...rest} className={clsx(styles.element, className)}>
      <header className={styles.header}>
        <Typography tag="h1" styling="xl">
          {board.data?.title}
        </Typography>
        <Tabs
          title="Select view"
          variant="underlined"
          items={tabs}
          selected={viewType}
          className={styles.tabs}
          onSelectedChange={setViewType}
        />
      </header>
      <div className={styles.board}>
        {viewType === "kanban" && (
          <KanbanView
            columns={formattedColumns}
            className={styles.kanban}
            onAddColumn={addColumn}
            onAddTask={addTask}
            onColumnDropOnColumn={updateColumnOrder}
            onUpdateColumnTitle={updateColumnTitle}
            onUpdateTaskTitle={updateTaskTitle}
            onChangeTaskColumn={updateTaskAction.action}
            onDropTaskOnTaskInSameColumn={updateTaskOrder}
            onChangeTaskOrderInOtherColumns={updateTaskOrder}
            onOverTaskOnColumn={updateTaskColumnBaseOnColumn}
          />
        )}

        {viewType === "list" && <div>Come soon...</div>}
      </div>
    </section>
  );
};
