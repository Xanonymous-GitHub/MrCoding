export async function setJwtToLocalStorageWithExpire(jwtToken: string): Promise<void> {
  await localStorage.setItem('jwtToken', jwtToken)
  await localStorage.setItem('jwtTokenExpireTime', (Date.now() + 20 * 86400 * 1000).toString())
}

export async function getJwtTokenFromLocalStorage(): Promise<string | void> {
  const currentUserJwtToken = await localStorage.getItem('jwtToken')
  const jwtExpireTime = await parseInt(localStorage.getItem('jwtTokenExpireTime') as string)
  if (currentUserJwtToken) {
    
    try {
      if (jwtExpireTime && Date.now() < jwtExpireTime) {
        return currentUserJwtToken
      }
    } catch (e) {
      localStorage.removeItem('jwtToken')
    }
  }
}
