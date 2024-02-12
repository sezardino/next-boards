import { PrismaService } from "@/lib/prisma";

export type BllModuleError<T extends string> = { error: T };

export abstract class BllModule {
  constructor(protected readonly prismaService: PrismaService) {}

  protected throw(error: string): never {
    throw { error };
  }
}
