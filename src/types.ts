export interface DegeniteClientOptions {
  /** Base URL of a DEGENITE-compatible API deployment, e.g. https://your-instance.example.com */
  baseUrl: string;
  /** Optional custom fetch implementation (useful for Node < 18 or testing) */
  fetchImpl?: typeof fetch;
}

export interface NonceResponse {
  message: string;
  nonce: string;
}

export interface VerifyPayload {
  walletAddress: string;
  signature: string;
  nonce: string;
}

export interface SessionInfo {
  profileId: string;
  walletAddress: string;
}

export interface EntrySnapshot {
  honeypot: boolean;
  renouncedMint: boolean;
  renouncedFreeze: boolean;
  burnRatio: number;
  top10: number;
}

export interface Position {
  id?: string;
  address: string;
  symbol: string;
  chain: string;
  sizeSol: number;
  entry: EntrySnapshot;
  entryPrice: number;
  curPrice: number;
  pnl: number;
}

export interface PortfolioSnapshot {
  equitySol: number;
  exposureSol: number;
  openPositions: number;
  realizedPnlSol: number;
}

export interface PositionsResponse {
  positions: Position[];
  portfolio: PortfolioSnapshot;
}

export interface BuyRequest {
  chain: string;
  address: string;
  sizeSol: number;
}

export interface SellRequest {
  address: string;
}

export interface TradeResult {
  ok: boolean;
  txSignature?: string;
  filledPrice?: number;
  message?: string;
}

export type TradingMode = "PAPER" | "LIVE";
