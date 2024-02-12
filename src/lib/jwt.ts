import jwt, { VerifyErrors } from "jsonwebtoken";

export type JWTError = VerifyErrors;

type GenerateArgs = {
  payload: Record<string, any>;
  expiresIn: number;
};

export class JWT {
  constructor(private readonly secret: string) {}

  generate(args: GenerateArgs): string {
    const { payload, expiresIn } = args;

    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify<T extends Record<string, any>>(token: string): T | null {
    const decoded = jwt.verify(token, this.secret);

    return decoded as T;
  }

  decode<T extends Record<string, any>>(token: string): T | null {
    const decoded = jwt.decode(token);

    return decoded as T;
  }
}
