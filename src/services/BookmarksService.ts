import CreateBookmarkRequest from "../data/requests/CreateBookmarkRequest";
import BaseResponse from "../data/responses/BaseResponse";
import Bookmark from "../data/responses/Bookmark";
import ApiEndpoints from "../utils/ApiEndpoints";
import UpdateBookmarkRequest from "@/data/requests/UpdateBookmarkRequest.ts";
const baseUrl = ApiEndpoints.BOOKMARKS;

class BookmarkService {

  async create(accessToken: string, request: CreateBookmarkRequest) {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el marcador");
    }

    const data: BaseResponse<Bookmark> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }
  }

  async getBookmarks(accessToken: string): Promise<Bookmark[]> {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: BaseResponse<Bookmark[]> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data || [];
  }

  async updateBookmark(id: number, request: UpdateBookmarkRequest, accessToken: string): Promise<Bookmark | null> {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      const content: BaseResponse<null> = await response.json();

      throw new Error(`Error al actualizar marcador, ${content.message}`)
    }

    const updatedBookmark: BaseResponse<Bookmark> = await response.json();

    return updatedBookmark.data
  }

  async removeBookmark(id: number, accessToken: string) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const content: BaseResponse<null> = await response.json();

      throw new Error(`Error al eliminar marcador, ${content.message}`)
    }
  }
}

export default BookmarkService;
