export async function GET() {
  try {
    const res = await fetch("https://iran-market.github.io/data/popular.json");
    const data = await res.json();

    // پیدا کردن قیمت تتر
    const usdtItem = data.find(item => item.symbol === "USDT" || item.name?.includes("تتر"));
    const usdtRate = usdtItem?.price || 172000;

    return Response.json({ 
      usdt: Math.round(usdtRate),
      btc: 0
    });
  } catch (error) {
    return Response.json({ usdt: 172000, btc: 0 });
  }
}