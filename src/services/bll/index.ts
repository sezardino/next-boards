import { PrismaService } from "@/lib/prisma";
import { AuthBllModule } from "./modules/auth";
import { UserBllModule } from "./modules/user";

import { prisma } from "@/lib/prisma";
import { BoardBllModule } from "./modules/board";
import { PomodoroBllModule } from "./modules/pomodoro";
import { ProfileBllModule } from "./modules/profile";

class BllService {
  user: UserBllModule;
  auth: AuthBllModule;
  profile: ProfileBllModule;
  board: BoardBllModule;
  pomodoro: PomodoroBllModule;

  constructor(prisma: PrismaService) {
    this.user = new UserBllModule(prisma);
    this.auth = new AuthBllModule(prisma, this.user);
    this.profile = new ProfileBllModule(prisma);
    this.board = new BoardBllModule(prisma);
    this.pomodoro = new PomodoroBllModule(prisma);
  }
}

export const bllService = new BllService(prisma);
