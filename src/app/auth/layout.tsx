import { FC, PropsWithChildren } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return <main className="min-h-screen grid content-center">{children}</main>;
};

export default AuthLayout;
