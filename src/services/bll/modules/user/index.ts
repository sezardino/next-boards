import { hashService } from "@/services/hash";
import { BllModule } from "../../utils";
import { SignUpRequest } from "../auth/dto";
import {
  UserBaseSettingsRequest,
  UserPasswordSettingsError,
  UserPasswordSettingsRequest,
} from "./dto";

export class UserBllModule extends BllModule {
  getByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  getById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async create(dto: SignUpRequest) {
    const hashedPassword = await hashService.hash(dto.password);

    return this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });
  }

  async updateBaseSettings(data: UserBaseSettingsRequest, userId: string) {
    const neededUser = await this.getById(userId);

    if (!neededUser) this.throw(UserPasswordSettingsError.NotFound);

    return this.prismaService.user.update({ where: { id: userId }, data });
  }

  async updatePassword(dto: UserPasswordSettingsRequest, userId: string) {
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
