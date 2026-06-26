import axios from "axios";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const fetchResumeTextFromUrl = async (url) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
  });

  const buffer = Buffer.from(response.data);
  const contentType = response.headers["content-type"] ?? "";
  const lowerUrl = url.toLowerCase();

  if (contentType.includes("pdf") || lowerUrl.endsWith(".pdf")) {
    const parsed = await pdfParse(buffer);
    return parsed.text?.trim() ?? "";
  }

  if (
    contentType.includes("word") ||
    contentType.includes("document") ||
    lowerUrl.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() ?? "";
  }

  return buffer.toString("utf8").slice(0, 8000);
};
