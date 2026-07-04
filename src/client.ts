import type {
  DegeniteClientOptions,
  NonceResponse,
  VerifyPayload,
  SessionInfo,
  PositionsResponse,
  BuyRequest,
  SellRequest,
  TradeResult,
  TradingMode,
} from "./types.js";

/**
 * Unofficial community client for talking to a DEGENITE-compatible trading API.
 *
 * This SDK only talks to the *public* HTTP surface an instance already exposes
 * (auth, positions, buy/sell, mode). It has no knowledge of, and does not
 * attempt to reproduce, the internal scoring/risk engine — that logic lives
 * server-side and is intentionally out of scope for this package.
 */
export class DegeniteClient {
  private baseUrl: string;
  private fetchImpl: typeof fetch;
  private cookieJar: string | null = null;

  constructor(options: DegeniteClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    if (this.cookieJar) headers.set("Cookie", this.cookieJar);

    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) this.cookieJar = setCookie;

    if (!res.ok) {
      let message = `Request to ${path} failed with status ${res.status}`;
      try {
        const body = await res.json();
        if (body?.error) message = body.error;
      } catch {
        // ignore parse failure, use default message
      }
      throw new Error(message);
    }

    return (await res.json()) as T;
  }

  /** Step 1 of wallet login: request a nonce/message to sign. */
  async requestNonce(walletAddress: string): Promise<NonceResponse> {
    return this.request<NonceResponse>("/api/auth/nonce", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });
  }

  /** Step 2 of wallet login: submit the signed message to establish a session. */
  async verify(payload: VerifyPayload): Promise<SessionInfo> {
    return this.request<SessionInfo>("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async me(): Promise<SessionInfo> {
    return this.request<SessionInfo>("/api/auth/me");
  }

  async logout(): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  }

  async getPositions(): Promise<PositionsResponse> {
    return this.request<PositionsResponse>("/api/positions");
  }

  async buy(req: BuyRequest): Promise<TradeResult> {
    return this.request<TradeResult>("/api/buy", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async sell(req: SellRequest): Promise<TradeResult> {
    return this.request<TradeResult>("/api/sell", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async setMode(mode: TradingMode): Promise<{ mode: TradingMode }> {
    return this.request<{ mode: TradingMode }>("/api/mode", {
      method: "POST",
      body: JSON.stringify({ mode }),
    });
  }
}
