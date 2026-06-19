/**
 * Parse Serper/Google date strings into a Date when possible.
 * Examples: "3 days ago", "1 week ago", "Mar 10, 2022"
 */
export const parsePostedDate = (dateStr) => {
  if (!dateStr?.trim()) {
    return { postedAt: null, postedText: null };
  }

  const text = dateStr.trim();

  const relative = text.match(
    /^(\d+)\s+(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago$/i
  );

  if (relative) {
    const num = Number.parseInt(relative[1], 10);
    const unit = relative[2].toLowerCase();
    const postedAt = new Date();

    if (unit.startsWith("minute")) postedAt.setMinutes(postedAt.getMinutes() - num);
    else if (unit.startsWith("hour")) postedAt.setHours(postedAt.getHours() - num);
    else if (unit.startsWith("day")) postedAt.setDate(postedAt.getDate() - num);
    else if (unit.startsWith("week")) postedAt.setDate(postedAt.getDate() - num * 7);
    else if (unit.startsWith("month")) postedAt.setMonth(postedAt.getMonth() - num);
    else if (unit.startsWith("year")) postedAt.setFullYear(postedAt.getFullYear() - num);

    return { postedAt, postedText: text };
  }

  const parsed = Date.parse(text);
  if (!Number.isNaN(parsed)) {
    return { postedAt: new Date(parsed), postedText: text };
  }

  return { postedAt: null, postedText: text };
};

export const extractPostedFromSnippet = (snippet) => {
  if (!snippet) return { postedAt: null, postedText: null };

  const patterns = [
    /(?:posted|published)\s+(\d+\s+\w+\s+ago)/i,
    /(\d+\s+(?:minutes?|hours?|days?|weeks?|months?|years?)\s+ago)/i,
    /(?:on\s+)?((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = snippet.match(pattern);
    if (match?.[1]) {
      return parsePostedDate(match[1]);
    }
  }

  return { postedAt: null, postedText: null };
};

export const resolvePostedDate = (item) => {
  if (item?.date) {
    return parsePostedDate(item.date);
  }

  return extractPostedFromSnippet(item?.snippet);
};
