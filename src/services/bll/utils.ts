import { PrismaService } from "@/lib/prisma";

export abstract class BllModule {
  constructor(protected readonly prismaService: PrismaService) {}
}
