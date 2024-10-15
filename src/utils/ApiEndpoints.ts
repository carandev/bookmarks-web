const API_URL: string = import.meta.env.VITE_API_URL;

const BOOKMARKS: string = `${API_URL}/api/v1/bookmarks`;
const USERS: string = `${API_URL}/api/v1/users`;

export default {
  BOOKMARKS,
  USERS,
};
