import axios from 'axios';
import {
  Response,
  ChatRoom,
  ResponseError,
  Message,
  ReadMessage,
  authResponse,
  Admin,
  LiffUser, NewAdmin, UploadedMedia
} from "@/api/types/apiTypes";
import {klona} from 'klona/full';

axios.defaults.baseURL = 'https://mrcoding.org/api'
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'

const npcServicesApiUrl = 'https://asia-northeast1-npc-services.cloudfunctions.net'

// eslint-disable-next-line
const errorResolver = (e: any): ResponseError => {
  if (e && e.response && e.response.data) {
    return e.response.data
  } else {
    return {
      statusCode: e.status || 502,
      message: 'Unknown Error!'
    }
  }
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

export const bindLineUserUidToChatroom = async (id: string, liffUserID: string): Response<ChatRoom> => {
  try {
    const {data} = await axios.patch(`/chatrooms/${id}/liffUserID`, {
      liffUserID
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getHistory = async (id: string, lastTime: number, queryAmount: number, jwtToken: string): Response<Array<Message>> => {
  try {
    const {data} = await axios.get(`/chatrooms/${id}/history?lastTime=${lastTime}&number=${queryAmount}`, {
      headers: {Authorization: 'bearer ' + jwtToken}
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getLatestMessage = async (id: string, jwtToken: string): Response<Message> => {
  try {
    const {data} = await axios.get(`/chatrooms/${id}/message`, {
      headers: {Authorization: 'bearer ' + jwtToken}
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const sendMessage = async (id: string, context: string, jwtToken: string): Response<Message> => {
  try {
    const {data} = await axios.post(`/chatrooms/${id}/message`, {
      context
    }, {
      headers: {Authorization: 'bearer ' + jwtToken}
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getLatestReadMessageId = async (id: string, jwtToken: string): Response<ReadMessage> => {
  try {
    const {data} = await axios.get(`/chatrooms/${id}/history/lastRead`, {
      headers: {Authorization: 'bearer ' + jwtToken}
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const sendReadMessageId = async (id: string, messageID: string, jwtToken: string): Response<ReadMessage> => {
  try {
    const {data} = await axios.patch(`/chatrooms/${id}/history/lastRead`, {
      messageID
    }, {
      headers: {Authorization: 'bearer ' + jwtToken}
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const adminAuth = async (username: string, password: string): Response<authResponse> => {
  try {
    const {data} = await axios.post('/authAdmin', {
      username,
      password
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const liffAuth = async (liffAccessToken: string): Response<authResponse> => {
  try {
    const {data} = await axios.post('/authLiff', {
      liffAccessToken
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getAllUsers = async (jwtToken: string): Response<Array<Admin | LiffUser>> => {
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

export const createAdmin = async (adminUserData: NewAdmin, jwtToken: string): Response<Admin> => {
  try {
    const {data} = await axios.post('/users/admin', {...adminUserData}, {
      headers: {
        Authorization: 'bearer ' + jwtToken
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}

export const getSpecificUser = async (id: string): Response<Admin | LiffUser> => {
  try {
    const {data} = await axios.get(`/users/${id}`)
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

export const changeAdminAvatar = async (adminID: string, avatar: string, jwtToken: string): Response<Admin> => {
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

export const changeAdminCC = async (adminID: string, cc: boolean, jwtToken: string): Response<Admin> => {
  try {
    const {data} = await axios.patch(`/users/${adminID}/cc`, {
      cc
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

export const jwtSignIn = async (jwtToken: string): Response<Admin | LiffUser> => {
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

export const uploadMedia = async (file: File, preferredType?: string): Response<UploadedMedia> => {
  const uploadMediaAxios = klona(axios)
  const formData = new FormData();
  formData.append("file", file)
  preferredType && formData.append("type", preferredType)
  try {
    const {data} = await uploadMediaAxios.post(npcServicesApiUrl + '/Image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  } catch (e) {
    return errorResolver(e)
  }
}
