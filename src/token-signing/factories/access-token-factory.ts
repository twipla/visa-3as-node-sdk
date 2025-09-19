import dayjs from "dayjs";
import { AccessToken } from "../access-token";
import { RS256TokenSigner } from "../rs256-signer";
import { TokenHeader, TokenPayload } from "../types";

export class AccessTokenFactory {
  public ROLE_INTP = "intp";
  public ROLE_INTPC = "intpc";

  static getAccessToken(config: AccessTokenConfig): AccessToken {
    const header: TokenHeader = { kid: config.kid, alg: config.alg };
    const payload: TokenPayload = {
      roles: [config.claims.role],
      intp_id: config.claims.intpId,
      intpc_id: config.claims.intpcId,
      exp: config.expAt || dayjs().add(10, "minutes").unix(),
      iat: dayjs().unix(),
    };

    return new AccessToken({
      header,
      payload,
      signer: new RS256TokenSigner(config.privateKey),
    });
  }
}

export type AccessTokenConfig = {
  kid: string;
  alg: string;
  privateKey: string;
  claims: {
    role: "intp" | "intpc";
    intpId: string;
    intpcId?: string;
  };
  // unix timestamp (seconds)
  expAt?: number;
};
