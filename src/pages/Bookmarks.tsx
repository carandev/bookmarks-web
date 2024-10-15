import { useAuth0 } from "@auth0/auth0-react";
import BookmarkService from "../services/BookmarksService";
import { useEffect, useState } from "react";
import Bookmark from "../data/responses/Bookmark";
import { Link } from "wouter";

const Bookmarks = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bookmarkService = new BookmarkService();

  const callApi = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const bookmarks = await bookmarkService.getBookmarks(token);

      setBookmarks(bookmarks);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      callApi();
    }
  }, [isAuthenticated]);

  if (loading || isLoading) {
    return <div>Cargando ...</div>;
  } else if (!isAuthenticated) {
    return <div>Por favor, inicie sesión</div>;
  }

  return (
    <div>
      <div>
        <Link href="/bookmarks/new">Crear marcador</Link>
      </div>
      {bookmarks.length != 0 ? (
        bookmarks.map((bookmark) => (
          <div key={bookmark.id}>
            <h2>{bookmark.title}</h2>
            <p>{bookmark.url}</p>
          </div>
        ))
      ) : (
        <p>No hay marcadores registrados</p>
      )}
    </div>
  );
};

export default Bookmarks;
