import appStore from '@/store/app'
import {Admin} from '@/api/types/apiTypes'
import {getJwtTokenFromLocalStorage} from '@/utils/jwtTokenController'
import {jwtSignIn} from "@/api/api";

export default async function (key?: string): Promise<boolean> {
  const token = key || appStore.getJwtKey || await getJwtTokenFromLocalStorage()
  if (token) {
    appStore.setCurrentUserJwtToken(token)
    const admin = (await jwtSignIn(token)) as unknown as Admin
    if (admin && !('statusCode' in admin) && ('_id' in admin)) {
      await appStore.setCurrentUser(admin)
      return true
    }
  }
  return false
}
