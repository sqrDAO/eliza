
export interface SwapParams {
    chain: string;
    fromToken: string;
    toToken: string;
    amount: string;
    slippage?: number;
}

export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: bigint;
    data: string;
    chainId: number;
}
