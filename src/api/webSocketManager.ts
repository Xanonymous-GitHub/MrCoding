import io from 'socket.io-client';
import appStore from "@/store/app";
import {Admin, User} from "@/api/types/apiTypes";

const isProduction = process.env.NODE_ENV === 'production'

const getWebSocketExtraHeaders = (): { userID?: string, authorization?: string } => {
  const jwtKey = appStore.getJwtKey
  const userID = (appStore.getCurrentUser as (User | Admin))._id
  return {
    ...jwtKey && {Authorization: 'bearer ' + jwtKey},
    ...userID && {userID}
  }
}

const socket = io(isProduction ? '/' : 'localhost:3000', {
  path: '/socket.io',
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  autoConnect: false, // origin: true
  transportOptions: {
    polling: {
      extraHeaders: getWebSocketExtraHeaders()
    }
  },
});

export default socket
