import { PrismaService } from "@/lib/prisma";
import { AuthBllModule } from "./modules/auth";
import { UserBllModule } from "./modules/user";

import { prisma } from "@/lib/prisma";
import { BoardBllModule } from "./modules/board";
import { ProfileBllModule } from "./modules/profile";
import { TaskBllModule } from "./modules/task";
import { ColumnBllModule } from "./modules/column";

class BllService {
  user: UserBllModule;
  auth: AuthBllModule;
  profile: ProfileBllModule;
  board: BoardBllModule;
  task: TaskBllModule;
  column: ColumnBllModule;

  constructor(prisma: PrismaService) {
    this.user = new UserBllModule(prisma);
    this.auth = new AuthBllModule(prisma, this.user);
    this.profile = new ProfileBllModule(prisma);
    this.board = new BoardBllModule(prisma);
    this.task = new TaskBllModule(prisma);
    this.column = new ColumnBllModule(prisma);
  }
}

export const bllService = new BllService(prisma);
