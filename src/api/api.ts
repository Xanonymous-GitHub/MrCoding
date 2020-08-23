import axios from 'axios';
import {Response, ChatRoom, Error, Message, ReadMessage, authResponse, Admin} from "@/api/types/apiTypes";

axios.defaults.baseURL = 'https://mrcoding.org/api'
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'

const errorResolver = (e: any): Error => {
  if ('response' in e && 'data' in e.response && e.response.data instanceof Error) {
    return e.response.data
  } else {
    return {
      statusCode: e.status || 502,
      message: 'Unknown Error!'
    }
  }
}

const dualIdentityHeaders = (jwtToken?: string, userID?: string) => {
  return () => ({
    ...jwtToken && {Authorization: jwtToken},
    ...userID && {userID}
  })
}

export const getAllChatRooms = async (jwtToken: string): Response<Array<ChatRoom>> => {
  try {
    const {data} = await axios.get('/chatrooms', {
      headers: {
        Authorization: 'bearer ' + jwtToken
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getChatRoom = async (id: string): Response<ChatRoom> => {
  try {
    const {data} = await axios.get(`/chatrooms/${id}`)
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const setChatRoomClosingState = async (id: string, state: boolean, jwtToken: string): Response<ChatRoom> => {
  try {
    const {data} = await axios.patch(`/chatrooms/${id}/closed`, {
      closed: state
    }, {
      headers: {
        Authorization: 'bearer ' + jwtToken
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getHistory = async (id: string, lastTime: number, queryAmount: number, jwtToken?: string, userID?: string): Response<Array<Message>> => {
  try {
    const {data} = await axios.get(`/chatrooms/${id}/history?lastTime=${lastTime}&number=${queryAmount}`, {
      headers: dualIdentityHeaders(jwtToken, userID)
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getLatestMessage = async (id: string, jwtToken?: string, userID?: string): Response<Message> => {
  try {
    const {data} = await axios.get(`/chatrooms/${id}/message`, {
      headers: dualIdentityHeaders(jwtToken, userID)
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const sendMessage = async (id: string, context: string, jwtToken?: string, userID?: string): Response<Message> => {
  try {
    const {data} = await axios.post(`/chatrooms/${id}/message`, {
      context
    }, {
      headers: dualIdentityHeaders(jwtToken, userID)
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getLatestReadMessageId = async (id: string, jwtToken?: string, userID?: string): Response<ReadMessage> => {
  try {
    const {data} = await axios.get(`/chatrooms/${id}/history/lastRead`, {
      headers: dualIdentityHeaders(jwtToken, userID)
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const sendReadMessageId = async (id: string, messageID: string, jwtToken?: string, userID?: string): Response<ReadMessage> => {
  try {
    const {data} = await axios.patch(`/chatrooms/${id}/history/lastRead`, {
      messageID
    }, {
      headers: dualIdentityHeaders(jwtToken, userID)
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const auth = async (username: string, password: string): Response<authResponse> => {
  try {
    const {data} = await axios.post('/auth', {
      username,
      password
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getAllAdmins = async (jwtToken: string): Response<Array<Admin>> => {
  try {
    const {data} = await axios.get('/users', {
      headers: {
        Authorization: 'bearer ' + jwtToken
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getAdmin = async (adminID: string): Response<Admin> => {
  try {
    const {data} = await axios.get(`/users/${adminID}`)
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const changeAdminInfo = async (adminID: string, info: string, jwtToken: string): Response<Admin> => {
  try {
    const {data} = await axios.patch(`/users/${adminID}/info`, {
      info
    }, {
      headers: {
        Authorization: 'bearer ' + jwtToken
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const changeAvatar = async (adminID: string, avatar: string, jwtToken: string): Response<Admin> => {
  try {
    const {data} = await axios.patch(`/users/${adminID}/avatar`, {
      avatar
    }, {
      headers: {
        Authorization: 'bearer ' + jwtToken
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const jwtSignIn = async (jwtToken: string): Response<Admin> => {
  try {
    const {data} = await axios.get('/me', {
      headers: {
        Authorization: 'bearer ' + jwtToken
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}
