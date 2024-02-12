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
    const userResponse = await this.userModule.getByEmail(dto.email);

    if (!userResponse) this.throw(SignInError.NotFound);

    const { password, ...user } = userResponse;

    const isPasswordMatch = hashService.compare(dto.password, password);

    if (!isPasswordMatch) this.throw(SignInError.WrongCredentials);

    return user;
  }

  async signUp(dto: SignUpRequest) {
    const userResponse = await this.userModule.getByEmail(dto.email);

    if (userResponse) this.throw(SignUpError.EmailAlreadyExists);

    return this.userModule.create(dto);
  }
}
