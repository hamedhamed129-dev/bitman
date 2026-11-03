export async function GET() {
  try {
    const [usdtRes, btcRes] = await Promise.all([
      fetch("https://api.nobitex.ir/v2/orderbook/USDTIRT"),
      fetch("https://api.nobitex.ir/v2/orderbook/BTCIRT")
    ]);

    const usdtData = await usdtRes.json();
    const btcData = await btcRes.json();

    const usdtRate = usdtData.lastTradePrice 
      ? Math.round(Number(usdtData.lastTradePrice) / 10) 
      : 172000;

    const btcRate = btcData.lastTradePrice 
      ? Math.round(Number(btcData.lastTradePrice) / 10) 
      : 0;

    return Response.json({ 
      usdt: usdtRate,
      btc: btcRate
    });
  } catch (error) {
    return Response.json({ usdt: 172000, btc: 0 });
  }
}