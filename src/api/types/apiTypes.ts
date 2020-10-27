export type Response<T> = Promise<T | ResponseError>

export interface ResponseError {
  readonly statusCode?: number,
  readonly message?: string
}

export interface LiffUser {
  readonly _id: string, // line uuid or admin mongo id.
  username: string, // admins' self-set name, or the line user's displayName.
  avatar?: string, // user avatar url (at the first time)
  info?: string, // user profile
}

export interface Admin extends LiffUser {
  readonly cc: boolean // show that if the user is verified by us(dev team)
}

export interface ChatRoom {
  readonly _id: string, // mongoose id, absolutely unique, is the route path at /:chatroom
  closed: boolean // show that if this room is closed or not.
  readonly name: string // the chatroom's name provided by server.
  avatar: string // the chatroom owner's line avatar provided by server.
  base64Avatar?: string // a place to save the base64 avatar url.
}

export interface Message {
  readonly _id: string, // mongoose id, absolutely unique
  readonly author: string, // admin _id or liffUserID
  read: boolean, // show that if this is read by someone (the other user in same chatroom)
  context?: string, // text content of this msg, will change to contain not only texts but also medias
  chatroomID: string, // the chatroom's [_id](mongoose id, absolutely unique)
  updatedAt: number, // the last time of edit or create
  readonly createdAt?: number // deprecated unUseful parameter from server,
  observer?: boolean // record that the msg is going to be the top of observer. (not from server property)
}

export interface ReadMessage {
  readonly _id: string, // mongoose id, absolutely unique
}

export interface SentMessage {
  readonly context: string // the type of a message that will be sent.
}

export interface authResponse {
  readonly token: string
}

export interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export enum ThemeModes {
  AUTO = 'AUTO',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export enum UserType {
  LIFFUSER = 'LIFFUSER',
  ADMIN = 'ADMIN',
  UNKNOWN = 'UNKNOWN'
}
