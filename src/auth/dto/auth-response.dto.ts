import { AuthenticatedUser } from '../interfaces';

export class AuthResponseDTO {
  token: string;
  user: AuthenticatedUser;
}
