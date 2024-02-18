import { hashService } from "@/services/hash";
import { BllModule } from "../../utils";
import { SignUpDto } from "../auth/dto";
import {
  MeResponseError,
  UserGeneralSettingsDto,
  UserGeneralSettingsError,
  UserSecuritySettingsDto,
  UserSecuritySettingsError,
} from "./dto";

export class UserBllModule extends BllModule {
  getByLogin(login: string) {
    return this.prismaService.user.findUnique({
      where: { login },
      select: { id: true, login: true, name: true, password: true },
    });
  }

  getById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async currentUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, login: true, name: true },
    });

    if (!user) this.throw(MeResponseError.NotFound);

    return user;
  }

  async create(dto: SignUpDto) {
    const hashedPassword = await hashService.hash(dto.password);

    return this.prismaService.user.create({
      data: {
        login: dto.login,
        password: hashedPassword,
      },
    });
  }

  async generalSettings(dto: UserGeneralSettingsDto, userId: string) {
    const neededUser = await this.getById(userId);

    if (!neededUser) this.throw(UserGeneralSettingsError.NotFound);

    return await this.prismaService.user.update({
      where: { id: userId },
      data: { login: dto.login, name: dto.name },
      select: { id: true, login: true, name: true },
    });
  }

  async securitySettings(dto: UserSecuritySettingsDto, userId: string) {
    const neededUser = await this.getById(userId);

    if (!neededUser) this.throw(UserSecuritySettingsError.NotFound);

    const isPasswordValid = await hashService.compare(
      dto.oldPassword,
      neededUser.password
    );

    if (!isPasswordValid) this.throw(UserSecuritySettingsError.NotMatch);

    const hashedPassword = await hashService.hash(dto.newPassword);

    this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
