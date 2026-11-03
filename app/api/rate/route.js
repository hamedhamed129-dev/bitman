export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    const data = await res.json();

    const btcRate = data.bitcoin?.usd ? Math.round(data.bitcoin.usd) : 0;

    return Response.json({ 
      usdt: 172000,
      btc: btcRate
    });
  } catch (error) {
    return Response.json({ usdt: 172000, btc: 0 });
  }
}