declare module "*.scss";

interface _YupError<T> {
  key: string
  value: unknown
  path: string
}

type YupErrors<T extends {}> = _YupError<keyof T>[]

type ModelOrError<T extends {}> = T | YupErrors<T>