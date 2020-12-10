import appStore from '@/store/app'
import getUserDataByJwtToken from "@/utils/jwtSignIn";
import {getAccessToken, getLiffProfile, initializeLiff, isExternalBrowser, liffId} from "@/api/liffUserService";
import {bindLineUserUidToChatroom, liffAuth} from "@/api/api";
import {authResponse, UserType} from "@/api/types/apiTypes";

export default async function autoLogin(): Promise<void> {
  if (!appStore.isLoggedIn) {
    // judge where is there, in LINE, or external browser but has 'liff' query string after path? or just admin?
    if (isExternalBrowser()) {
      appStore.SET_USER_TYPE(UserType.ADMIN)
      await getUserDataByJwtToken()
    } else {
      await initializeLiff(liffId)
      appStore.SET_USER_TYPE(UserType.LIFFUSER)
    }
  }
}

export const liffLogin = async (chatroomId?: string): Promise<void> => {
  if (!(await getUserDataByJwtToken())) {
    try {
      // init the liff instance.
      await initializeLiff(liffId)
      // fetch the accessToken of this line user.
      const lineAccessToken = getAccessToken() as string
      
      // send the accessToken to server to create a new liffUser and then get the jwtToken.
      const {token} = await liffAuth(lineAccessToken) as authResponse
      
      // bind the liffUser to the chatroom.
      const profile = await getLiffProfile()
      chatroomId ? await bindLineUserUidToChatroom(chatroomId, profile.userId) : 0
      
      // use the jwtToken to get the liffUser's profile.
      await getUserDataByJwtToken(token)
    } catch (e) {
      alert(e)
    }
  }
}
