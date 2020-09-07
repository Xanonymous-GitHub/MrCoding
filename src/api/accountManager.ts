import appStore from '@/store/app'
import adminDataFetcher from "@/utils/adminDataFetcher";

export default async function autoLogin(): Promise<void> {
  if (!appStore.isLoggedIn) {
    // judge where is there, in LINE, or external browser but has 'liff' query string after path? or just admin?
    
    // if the role is a admin
    await adminDataFetcher()
  }
}
