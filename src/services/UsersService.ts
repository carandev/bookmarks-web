import CreateBookmarkRequest from "../data/requests/CreateBookmarkRequest";
import BaseResponse from "../data/responses/BaseResponse";
import Bookmark from "../data/responses/Bookmark";
import User from "../data/responses/User";
import ApiEndpoints from "../utils/ApiEndpoints";
const baseUrl = ApiEndpoints.USERS;

class UsersService {
  async getUsers(accessToken: string): Promise<User[]> {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: BaseResponse<User[]> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  }

  async getUser(auth0Id: string, accessToken: string): Promise<User> {
    const encondedId = encodeURIComponent(auth0Id);

    const response = await fetch(`${baseUrl}/auth0/${encondedId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: BaseResponse<User> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  }

  async addUser(accessToken: string, request: CreateBookmarkRequest) {
    const response = await fetch("/bookmarks", {
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

  async removeBookmark(id: number, accessToken: string) {
    // Remove a bookmark from the server
    return fetch(`/bookmarks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

export default UsersService;
