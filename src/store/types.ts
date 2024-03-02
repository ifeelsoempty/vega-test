export type ServerEntity<T> = {
  data: T,
  isLoading: boolean,
  requested: boolean,
}