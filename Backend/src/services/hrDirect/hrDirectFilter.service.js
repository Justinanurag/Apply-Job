const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const BLOCKED_EMAIL_DOMAINS = [
  "example.com",
  "test.com",
  "linkedin.com",
  "google.com",
  "facebook.com",
];

export const extractEmailsFromText = (text) => {
  if (!text) return [];
  const matches = text.match(EMAIL_REGEX) ?? [];
  return [...new Set(matches.map((e) => e.toLowerCase()))].filter((email) => {
    const domain = email.split("@")[1];
    return domain && !BLOCKED_EMAIL_DOMAINS.some((d) => domain.endsWith(d));
  });
};

export const hasRecruiterEmail = (item) => {
  const combined = `${item?.title ?? ""} ${item?.snippet ?? ""}`;
  return extractEmailsFromText(combined).length > 0;
};

export const filterHrDirectResults = (organic = []) =>
  organic
    .filter((item) => item?.link && hasRecruiterEmail(item))
    .map((item) => {
      const combined = `${item.title ?? ""} ${item.snippet ?? ""}`;
      const emails = extractEmailsFromText(combined);
      return {
        title: item.title ?? "",
        link: item.link,
        snippet: item.snippet ?? "",
        date: item.date ?? null,
        hrEmail: emails[0] ?? null,
        allEmails: emails,
      };
    })
    .filter((item) => item.hrEmail);
