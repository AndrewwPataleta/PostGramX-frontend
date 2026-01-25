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
