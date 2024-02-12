import { hashService } from "@/services/hash";
import { BllModule } from "../../utils";
import { SignUpRequest } from "../auth/dto";

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
}
