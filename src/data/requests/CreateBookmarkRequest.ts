export default interface CreateBookmarkRequest {
  url: string;
  title: string;
  userId: number;
  tags: string[];
}
