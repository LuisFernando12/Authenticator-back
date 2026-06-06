import { IGenerateToken } from '../interface/generate-token.interface';
import { StringValue } from '../type/string-value.type';

export const JWT_SERVICE_PORT = Symbol('JWT_SERVICE_PORT');
export abstract class JwtServicePort {
  abstract signAsync(
    payload: IGenerateToken,
    expiresIn: StringValue,
  ): Promise<string>;
  abstract verifyAsync(token: string): Promise<any>;
}
