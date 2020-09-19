import appStore from '@/store/app'
import getUserDataByJwtToken from "@/utils/jwtService";
import {getAccessToken, initializeLiff, isExternalBrowser, liffId} from "@/api/liffUserService";
import {liffAuth} from "@/api/api";
import {Admin, authResponse, LiffUser, UserType} from "@/api/types/apiTypes";

export default async function autoLogin(): Promise<void> {
  if (!appStore.isLoggedIn) {
    // judge where is there, in LINE, or external browser but has 'liff' query string after path? or just admin?
    if (isExternalBrowser()) {
      appStore.SET_USER_TYPE(UserType.ADMIN)
      await getUserDataByJwtToken()
    } else {
      try {
        // init the liff instance.
        await initializeLiff(liffId)
        
        await appStore.createMsg({
          newMsg: {
            _id: 'test2',
            author: (appStore.getCurrentUser as (LiffUser | Admin))._id,
            read: false,
            context: 'inited.',
            chatroomID: appStore.getCurrentChatRoomId,
            updateAt: 123456789
          }
        })
        
        // fetch the accessToken of this line user.
        const lineAccessToken = getAccessToken() as string
        
        await appStore.createMsg({
          newMsg: {
            _id: 'test2',
            author: (appStore.getCurrentUser as (LiffUser | Admin))._id,
            read: false,
            context: 'accessToken is : ' + lineAccessToken,
            chatroomID: appStore.getCurrentChatRoomId,
            updateAt: 123456789
          }
        })
        
        // if get the accessToken successfully, confirm this is a liffuser.
        appStore.SET_USER_TYPE(UserType.LIFFUSER)
        
        await appStore.createMsg({
          newMsg: {
            _id: 'test2',
            author: (appStore.getCurrentUser as (LiffUser | Admin))._id,
            read: false,
            context: 'current User Type set. -> ' + appStore.getUserType,
            chatroomID: appStore.getCurrentChatRoomId,
            updateAt: 123456789
          }
        })
        
        // send the accessToken to server to create a new liffUser and then get the jwtToken.
        const {token} = await liffAuth(lineAccessToken) as authResponse
        
        await appStore.createMsg({
          newMsg: {
            _id: 'test2',
            author: (appStore.getCurrentUser as (LiffUser | Admin))._id,
            read: false,
            context: 'jwtToken is : ' + token,
            chatroomID: appStore.getCurrentChatRoomId,
            updateAt: 123456789
          }
        })
        
        // use the jwtToken to get the liffUser's profile.
        await getUserDataByJwtToken(token)
  
        await appStore.createMsg({
          newMsg: {
            _id: 'test2',
            author: (appStore.getCurrentUser as (LiffUser | Admin))._id,
            read: false,
            context: 'done.',
            chatroomID: appStore.getCurrentChatRoomId,
            updateAt: 123456789
          }
        })
        
      } catch (e) {
        console.log(`getLineUserProfile error ${e}`)
        
        await appStore.createMsg({
          newMsg: {
            _id: 'test2',
            author: (appStore.getCurrentUser as (LiffUser | Admin))._id,
            read: false,
            context: e,
            chatroomID: appStore.getCurrentChatRoomId,
            updateAt: 123456789
          }
        })
        
      }
    }
  }
}
