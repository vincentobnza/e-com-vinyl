import { albumsApi, type Album, type PaginatedResponse } from "@/api/albums";

export async function searchAlbums(
  query: string,
  page = 1,
): Promise<PaginatedResponse<Album>> {
  const { data } = await albumsApi.list({
    search: query.trim(),
    page,
  });
  return data;
}
