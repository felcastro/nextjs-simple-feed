import { api } from "./api";

export interface SignUpDto {
  username: string;
  email: string;
  password: string;
}

export async function signUp(signUpDto: SignUpDto): Promise<void> {
  const url = "/auth/signup";
  await api.post(url, signUpDto);
}
