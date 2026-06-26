export const HR_HIRING_KEYWORDS = [
  "Hiring",
  "We are hiring",
  "Immediate joiners",
  "Send resume to",
  "Share your CV",
  "Email your resume",
];

const HR_PLATFORMS = [
  { source: "linkedin", site: "site:linkedin.com" },
  { source: "linkedin", site: "site:linkedin.com/posts" },
  { source: "naukri", site: "site:naukri.com" },
  { source: "wellfound", site: "site:wellfound.com" },
  { source: "indeed", site: "site:indeed.com" },
];

export const buildHrDirectQueries = (roleKeyword, location) => {
  const role = roleKeyword?.trim() || "Software Developer";
  const locationSuffix = location?.trim() ? ` ${location.trim()}` : "";

  const queries = [];

  for (const hiringPhrase of HR_HIRING_KEYWORDS) {
    for (const { source, site } of HR_PLATFORMS) {
      queries.push({
        source,
        hiringPhrase,
        roleKeyword: role,
        query: `${site} "${hiringPhrase}" "${role}" email${locationSuffix}`,
      });
    }
  }

  return queries;
};

export const buildHrQueriesFromProfile = (profile) => {
  const roles = new Set();

  for (const role of profile?.preferredRoles ?? []) {
    if (role?.trim()) roles.add(role.trim());
  }

  for (const skill of profile?.skills ?? []) {
    if (skill?.trim()) roles.add(`${skill.trim()} Developer`);
  }

  if (profile?.currentRole?.trim()) roles.add(profile.currentRole.trim());

  if (roles.size === 0) roles.add("Software Developer");

  const location = profile?.preferredLocations?.[0] ?? profile?.location ?? "India";

  return [...roles].flatMap((roleKeyword) =>
    buildHrDirectQueries(roleKeyword, location).map((q) => ({ ...q, roleKeyword }))
  );
};
