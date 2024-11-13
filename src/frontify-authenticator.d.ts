declare module "frontify-authenticator" {
  export type AuthConfiguration = {
    domain: string;
    clientId: string;
    scopes: string[];
  };

  export type AuthorizationUrl = {
    authorizationUrl: string;
    codeVerifier: string;
    sessionId: string;
  };

  export type Token = {
    bearerToken: {
      tokenType: string;
      expiresIn: number;
      accessToken: string;
      refreshToken: string;
      domain: string;
    };
    clientId: string;
    scopes: string[];
  };

  export type AuthConfigurationInput = {
    domain?: string;
    clientId: string;
    scopes: string[];
  };

  export type PopupConfiguration = {
    title?: string;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
  };

  export function authorize(
    configuration: AuthConfigurationInput,
    popupConfiguration?: PopupConfiguration,
  ): Promise<Token>;

  export function refresh(tokenInput: Token): Promise<Token>;

  export function revoke(tokenInput: Token): Promise<Token>;
}
