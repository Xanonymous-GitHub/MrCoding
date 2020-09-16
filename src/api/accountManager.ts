import appStore from '@/store/app'
import adminDataFetcher from "@/utils/adminDataFetcher";
import {Route} from "vue-router";
import {getLiffProfile, initializeLiff, isExternalBrowser, liffLogin} from "@/api/liff";
import router from "@/router";
// import liff from "@line/liff";

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
      await initializeLiff('1654852713-gR9j0RyE', async () => {
        await getLineUserProfile()
      })
      await router.replace('/chatroom/' + chatroomId)
      // window.location.replace('https://mrcoding.org/chatroom/' + chatroomId)
    } else {
      console.log('will execute adminDataFetcher!')
      // if the role is a admin
      await adminDataFetcher()
    }
  }
}
