import { hashService } from "@/services/hash";
import { BllModule } from "../../utils";
import { SignUpDto } from "../auth/dto";
import {
  UserBaseSettingsDto,
  UserPasswordSettingsDto,
  UserPasswordSettingsError,
} from "./dto";

export class UserBllModule extends BllModule {
  getByLogin(login: string) {
    return this.prismaService.user.findUnique({ where: { login } });
  }

  getById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
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

  async updateBaseSettings(data: UserBaseSettingsDto, userId: string) {
    const neededUser = await this.getById(userId);

    if (!neededUser) this.throw(UserPasswordSettingsError.NotFound);

    return this.prismaService.user.update({ where: { id: userId }, data });
  }

  async updatePassword(dto: UserPasswordSettingsDto, userId: string) {
    const neededUser = await this.getById(userId);

    if (!neededUser) this.throw(UserPasswordSettingsError.NotFound);

    const isPasswordValid = await hashService.compare(
      dto.oldPassword,
      neededUser.password
    );

    if (!isPasswordValid) this.throw(UserPasswordSettingsError.NotMatch);

    const hashedPassword = await hashService.hash(dto.newPassword);

    return this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
