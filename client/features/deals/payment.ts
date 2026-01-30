export const buildTonTransferLink = (params: {
  address: string;
  amountTon: number;
  memo?: string;
}) => {
  const { address, amountTon, memo } = params;
  const amountNano = Math.round(amountTon * 1e9);
  const search = new URLSearchParams();
  if (Number.isFinite(amountNano) && amountNano > 0) {
    search.set("amount", amountNano.toString());
  }
  if (memo) {
    search.set("text", memo);
  }
  const query = search.toString();
  return `ton://transfer/${address}${query ? `?${query}` : ""}`;
};

export const buildTonTransferLinkFromNano = (params: {
  address: string;
  amountNano: string | bigint;
  memo?: string;
}) => {
  const { address, amountNano, memo } = params;
  const nanoValue = typeof amountNano === "bigint" ? amountNano : BigInt(amountNano);
  const search = new URLSearchParams();
  if (nanoValue > 0n) {
    search.set("amount", nanoValue.toString());
  }
  if (memo) {
    search.set("text", memo);
  }
  const query = search.toString();
  return `ton://transfer/${address}${query ? `?${query}` : ""}`;
};

export const buildTonConnectTransaction = (params: {
  address: string;
  amountTon: number;
}) => {
  const { address, amountTon } = params;
  const amountNano = Math.round(amountTon * 1e9);

  return {
    validUntil: Math.floor(Date.now() / 1000) + 60,
    messages: [
      {
        address,
        amount: amountNano.toString(),
      },
    ],
  };
};
