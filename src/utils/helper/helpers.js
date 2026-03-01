// 1. Import your configs object

import { configs } from "../config/configs";

// 2. Create the helper function
export const getImageUrl = (path) => {
  // If the path is empty/null, return a placeholder image
  if (!path) {
    return "https://placehold.co/600x400?text=No+Image";
  }

  // If the path is already a full link (e.g., Google or Facebook image), return it as is
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }

  // Otherwise, combine your config URL with the database path
  // Example: http://127.0.0.1:8000/storage/ + courses/web.jpg
  return `${configs.image_url}${path}`;
};