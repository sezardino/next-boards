export type ActionProps<Dto, Res> = {
  action: (dto: Dto) => Promise<Res>;
  isPending: boolean;
};
