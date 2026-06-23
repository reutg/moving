export type GoogleProfile = {
  given_name?: string | null;
  family_name?: string | null;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  email_verified?: boolean;
  sub?: string;
};

type ParsedGoogleName = {
  firstName: string | null;
  lastName: string | null;
};

export const parseGoogleName = (profile: GoogleProfile): ParsedGoogleName => {
  if (profile.given_name || profile.family_name) {
    return {
      firstName: profile.given_name ?? null,
      lastName: profile.family_name ?? null,
    };
  }

  const name = profile.name?.trim();
  if (!name) {
    return { firstName: null, lastName: null };
  }

  const parts = name.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0] ?? null, lastName: null };
  }

  return {
    firstName: parts[0] ?? null,
    lastName: parts.slice(1).join(" "),
  };
};

export const mapGoogleProfileToUser = (profile: GoogleProfile) => {
  const { firstName, lastName } = parseGoogleName(profile);

  return {
    id: profile.sub,
    name: profile.name,
    email: profile.email,
    image: profile.picture,
    emailVerified: profile.email_verified ? new Date() : null,
    firstName,
    lastName,
  };
};
