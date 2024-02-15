import { PrismaService } from "@/lib/prisma";
import { hashService } from "@/services/hash";
import { BllModule } from "../../utils";
import { UserBllModule } from "../user";
import { SignInError, SignUpError, SignUpRequest } from "./dto";

export class AuthBllModule extends BllModule {
  constructor(
    readonly prismaService: PrismaService,
    private readonly userModule: UserBllModule
  ) {
    super(prismaService);
  }

  async signIn(dto: SignUpRequest) {
    const userResponse = await this.userModule.getByLogin(dto.login);

    if (!userResponse) this.throw(SignInError.WrongCredentials);

    const { password, ...user } = userResponse;

    const isPasswordMatch = await hashService.compare(dto.password, password);

    if (!isPasswordMatch) this.throw(SignInError.WrongCredentials);

    return user;
  }

  async signUp(dto: SignUpRequest) {
    const userResponse = await this.userModule.getByLogin(dto.login);

    if (userResponse) this.throw(SignUpError.LoginAlreadyExists);

    this.userModule.create(dto);
  }
}
