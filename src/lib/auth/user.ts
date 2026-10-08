import type { UserProfile } from "@/types";

export function getUserDisplayName(name: string, email: string) {
  if (name.trim()) {
    return name.trim();
  }

  const localPart = email.split("@")[0];
  return localPart && localPart.length > 0 ? localPart : "there";
}

export function toUserIdentity(user: {
  id: string;
  name: string;
  email: string;
}): Pick<UserProfile, "id" | "name" | "email"> {
  return {
    id: user.id,
    name: getUserDisplayName(user.name, user.email),
    email: user.email,
  };
}
