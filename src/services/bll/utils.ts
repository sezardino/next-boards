import { PrismaService } from "@/lib/prisma";

export type BllModuleError<T extends string> = { error: T };

export const isBllModuleError = (
  error: unknown
): error is BllModuleError<string> =>
  typeof error === "object" && error !== null && "error" in error;

export abstract class BllModule {
  constructor(protected readonly prismaService: PrismaService) {}

  protected throw(error: string): never {
    throw { error };
  }
}
