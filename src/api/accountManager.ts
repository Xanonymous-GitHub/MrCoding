import appStore from '@/store/app'
import adminDataFetcher from "@/utils/adminDataFetcher";
import {Route} from "vue-router";
import {getAccessToken, getLiffProfile, initializeLiff, isExternalBrowser, liffLogin} from "@/api/liff";
import router from "@/router";

const getLineUserProfile = async (): Promise<void> => {
  const liffProfile = await getLiffProfile()
  await appStore.setCurrentUser({
    _id: liffProfile.userId,
    username: liffProfile.displayName,
    avatar: liffProfile.pictureUrl
  })
  console.log('current user is : ', appStore.getCurrentUser)
}

export default async function autoLogin(route?: Route): Promise<void> {
  if (!appStore.isLoggedIn) {
    // judge where is there, in LINE, or external browser but has 'liff' query string after path? or just admin?
    console.log(route || undefined)
    if (route && 'liff.state' in route.query) {
      // if the role is a line user
      const chatroomId = route.query['liff.state'].slice(1)
      // TODO route still has a lot of problems.
      if (chatroomId) {
        try {
          await initializeLiff('1654852713-gR9j0RyE', async () => {
            if (isExternalBrowser()) {
              await liffLogin('https://mrcoding.org/chatroom' + '?chatroomId=' + chatroomId)
            }
            await getLineUserProfile()
          })
        } catch (e) {
          console.log(`liff.state init error ${e}`);
        }
      } else {
        window.location.replace('/')
      }
    } else if (route && 'chatroomId' in route.query) {
      const chatroomId = route.query['chatroomId']
      // conclusion: the secondary liff.init is not success.
      await initializeLiff('1654852713-gR9j0RyE', async () => await getLineUserProfile())
      await router.replace('/chatroom/' + chatroomId)
    } else {
      if (isExternalBrowser()) {
        // if the role is a admin
        console.log('will execute adminDataFetcher!')
        await adminDataFetcher()
      } else {
        try {
          console.log('will execute getLineUserProfile!')
          await initializeLiff('1654852713-gR9j0RyE')
          appStore.ADD_LINE_ACCESS_TOKEN(getAccessToken() as string)
          await getLineUserProfile()
        } catch (e) {
          console.log(`getLineUserProfile error ${e}`)
        }
      }
    }
  }
}
