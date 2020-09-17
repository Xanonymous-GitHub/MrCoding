import liff from '@line/liff';

export interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export const initializeLiff = async (myLiffId: string, successCallback?: (() => void)): Promise<void> => {
  await liff.init({liffId: myLiffId}, successCallback);
  await liff.ready;
}

export const liffLogin = async (redirectUri?: string | undefined): Promise<void> => {
  if (!liff.isLoggedIn()) {
    await liff.login({redirectUri})
  }
}

export const getLiffProfile = async (): Promise<Profile> => {
  const profile = await liff.getProfile()
  console.log('userprofile is : ' + profile)
  return profile;
}

export const isExternalBrowser = (): boolean => {
  return !liff.isInClient()
}

export const getAccessToken = (): (string | null) => {
  return liff.getAccessToken();
}
