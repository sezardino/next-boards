import { BllModule } from "../../utils";
import { PomodoroSettingsError, PomodoroSettingsRequest } from "./dto";

export class PomodoroBllModule extends BllModule {
  async updateSettings(dto: PomodoroSettingsRequest, userId: string) {
    const neededSettings = await this.prismaService.pomodoro.findUnique({
      where: { userId },
    });

    if (!neededSettings) this.throw(PomodoroSettingsError.NotFound);

    return this.prismaService.pomodoro.update({
      where: { userId },
      data: dto,
    });
  }
}
