import { PrismaService } from "@/lib/prisma";
import { AuthBllModule } from "./modules/auth";
import { UserBllModule } from "./modules/user";

import { prisma } from "@/lib/prisma";

class BllService {
  user: UserBllModule;
  auth: AuthBllModule;

  constructor(prisma: PrismaService) {
    this.user = new UserBllModule(prisma);
    this.auth = new AuthBllModule(prisma, this.user);
  }
}

export const bllService = new BllService(prisma);
