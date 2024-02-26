import { EntityStatus } from "@prisma/client";

export type ActionProp<Dto, Res> = {
  action: (dto: Dto) => Promise<Res>;
  isPending: boolean;
};

export type DataProp<Data> = {
  data?: Data;
  isLoading: boolean;
};

export type EntityStatusWithoutDeleted = Extract<
  EntityStatus,
  "ACTIVE" | "INACTIVE"
>;
