import axios from "axios";
import { env } from "../../config/env.js";

export async function searchGoogle(query, options = {}) {
  if (!env.serperApiKey) {
    throw new Error("SERPER_API_KEY is not configured. Add it to Backend/.env");
  }

  const { num = 10, gl = "in", hl = "en" } = options;

  const response = await axios.post(
    "https://google.serper.dev/search",
    { q: query, num, gl, hl },
    {
      headers: {
        "X-API-KEY": env.serperApiKey,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  return response.data?.organic ?? [];
}
