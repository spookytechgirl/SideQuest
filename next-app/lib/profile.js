export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const ALLOWED_AVATAR_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export function validateAvatar(file) {
  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    return "Choose a PNG, JPEG, or WebP image.";
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return "Choose an avatar smaller than 2 MB.";
  }

  return "";
}
