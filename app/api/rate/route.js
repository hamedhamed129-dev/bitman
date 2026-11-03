export async function GET() {
  try {
    const res = await fetch("https://api.nobitex.ir/v2/orderbook/USDTIRT");
    const data = await res.json();

    if (data.lastTradePrice) {
      const tomanRate = Math.round(Number(data.lastTradePrice) / 10);
      return Response.json({ rate: tomanRate });
    }

    return Response.json({ rate: 172000 });
  } catch (error) {
    return Response.json({ rate: 172000 });
  }
}