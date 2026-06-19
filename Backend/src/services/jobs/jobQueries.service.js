const JOB_PLATFORMS = [
  { source: "linkedin", site: "site:linkedin.com/jobs" },
  { source: "naukri", site: "site:naukri.com" },
  { source: "wellfound", site: "site:wellfound.com" },
  { source: "indeed", site: "site:indeed.com" },
  { source: "glassdoor", site: "site:glassdoor.com" },
];

export const buildSearchQueries = (keyword, location) => {
  const locationSuffix = location?.trim() ? ` ${location.trim()}` : "";

  return JOB_PLATFORMS.map(({ source, site }) => ({
    source,
    query: `${site} "${keyword.trim()}"${locationSuffix}`,
  }));
};

/** Build role queries from user profile skills / preferred roles */
export const buildQueriesFromProfile = (profile) => {
  const keywords = new Set();

  for (const role of profile?.preferredRoles ?? []) {
    if (role?.trim()) keywords.add(role.trim());
  }

  for (const skill of profile?.skills ?? []) {
    if (skill?.trim()) keywords.add(`${skill.trim()} Developer`);
  }

  if (profile?.currentRole?.trim()) {
    keywords.add(profile.currentRole.trim());
  }

  if (keywords.size === 0) {
    keywords.add("Software Developer");
  }

  const location = profile?.preferredLocations?.[0] ?? profile?.location ?? "India";

  return [...keywords].flatMap((keyword) =>
    buildSearchQueries(keyword, location).map((q) => ({ ...q, keyword }))
  );
};
