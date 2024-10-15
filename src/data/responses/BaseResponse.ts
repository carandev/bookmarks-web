export default interface BaseResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
