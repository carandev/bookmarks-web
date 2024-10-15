import { useAuth0 } from "@auth0/auth0-react";
import CreateBookmarkRequest from "../data/requests/CreateBookmarkRequest";
import BookmarkService from "../services/BookmarksService";
import useUserStore from "../utils/useUserStore";
import { useLocation } from "wouter";

const CreateBookmark = () => {
  const { currentUser } = useUserStore();
  const { getAccessTokenSilently } = useAuth0();
  const [_, setLocation] = useLocation();
  const bookmarksService = new BookmarkService();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const url = e.target.url.value;

    const request: CreateBookmarkRequest = {
      title,
      url,
      userId: currentUser!.id,
      tags: [],
    };

    const token = await getAccessTokenSilently();
    await bookmarksService.create(token, request);
    setLocation("/bookmarks");
  };
  return (
    <div>
      <h2>Registrar marcadores</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Título</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="url">URL</label>
        <input type="text" id="url" name="url" />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default CreateBookmark;
