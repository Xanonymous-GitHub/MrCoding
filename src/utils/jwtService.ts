import appStore from '@/store/app'
import {Admin, LiffUser} from '@/api/types/apiTypes'
import {getJwtTokenFromLocalStorage} from '@/utils/jwtTokenController'
import {jwtSignIn} from "@/api/api";

export default async function (key?: string): Promise<boolean> {
  const token = key || appStore.getJwtKey || await getJwtTokenFromLocalStorage()
  if (token) {
    const user = (await jwtSignIn(token)) as unknown as (Admin | LiffUser)
    if (user && !('statusCode' in user) && ('_id' in user)) {
      await appStore.setCurrentUserJwtToken(token)
      await appStore.setCurrentUser(user)
      return true
    }
  }
  return false
}
