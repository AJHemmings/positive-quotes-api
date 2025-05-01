import quotes from "./quotes.json";

export default function handler(req, res) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader(`Cache-Control`, `s-maxage=3600, stale-white-revalidate`);

  return res.status(200).json(randomQuote);
}
