/** Normalize merged profile fields before Prisma update */
export const sanitizeMergedProfile = (merged) => {
  const data = { ...merged };

  if (data.experience != null) {
    const exp = Number(data.experience);
    data.experience = Number.isFinite(exp) ? Math.round(exp) : null;
  }

  if (data.remotePreference != null && !["Remote", "Hybrid", "Onsite"].includes(data.remotePreference)) {
    data.remotePreference = null;
  }

  for (const key of Object.keys(data)) {
    if (data[key] === undefined) delete data[key];
  }

  return data;
};
