/** Browser-safe URL for a comment image (proxies private Vercel Blob objects). */
export function commentImagePublicUrl(imageId: number): string {
  return `/api/comment-images/${imageId}`;
}
