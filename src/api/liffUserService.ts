import liff from '@line/liff';

export interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export const initializeLiff = async (myLiffId: string, successCallback?: (() => void)): Promise<void> => {
  await liff.init({liffId: myLiffId}, successCallback)
  await liff.ready;
}

export const getLiffProfile = async (): Promise<Profile> => {
  return await liff.getProfile();
}

export const isExternalBrowser = (): boolean => {
  return !liff.isInClient()
}

export const getAccessToken = (): (string | null) => {
  return liff.getAccessToken()
}

export const liffId = '1654852713-gR9j0RyE'
