import io from 'socket.io-client';
import appStore from "@/store/app";

const isProduction = process.env.NODE_ENV === 'production'

const getWebSocketExtraHeaders = (): { Authorization?: string } => {
  const jwtKey = appStore.getJwtKey
  return {
    ...jwtKey && {Authorization: 'bearer ' + jwtKey}
  }
}

const ioConfig = {
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
}

const socketSeed = () => io(isProduction ? '/' : 'localhost:3000', ioConfig);

export type ioType = SocketIOClient.Socket

export default new Promise($export => $export(socketSeed))
