import {Action, Module, Mutation, VuexModule, getModule} from 'vuex-module-decorators'
import {Message, themeModes, Admin, User} from '@/api/types/apiTypes'
import getBase64ImgPath from '@/utils/requestAvatar'
import {getSpecificAdmin} from '@/api/api'
import store from '@/store/index'

@Module({name: 'app', stateFactory: true, namespaced: true, store, dynamic: true})
class AppStore extends VuexModule {
  private themeMode = themeModes.AUTO;
  
  private currentUser: Admin | User = {
    _id: '',
    username: '',
    avatar: ''
  }
  
  private otherUsers: Array<Admin | User> = [
    {
      _id: '',
      username: '',
      cc: false,
      avatar: ''
    }
  ]
  
  private currentChatroomMessagesBox: Array<Message> = []
  
  private currentChatRoomId = ''
  
  private currentUserJwtToken = ''
  
  private sendingLogInRequest = false
  
  // private liffInstance = {}
  
  private static async newUser(originalData: User | Admin): Promise<User | Admin> {
    if (originalData && 'avatar' in originalData && originalData.avatar) {
      originalData.avatar = await getBase64ImgPath(originalData.avatar)
    }
    return originalData
  }
  
  // @Mutation
  // INIT_LIFF_INSTANCE(){
  //
  // }
  
  @Mutation
  SET_THEME_MODE(mode: themeModes): void {
    this.themeMode = mode
  }
  
  @Mutation
  SET_CURRENT_USER(originalData: User | Admin): void {
    this.currentUser = originalData
  }
  
  @Mutation
  ADD_OTHER_USER(otherUser: User | Admin): void {
    this.otherUsers.push(otherUser)
  }
  
  @Mutation
  CREATE_MSG({newMsg, insertPosition}: { newMsg: Message, insertPosition: number }): void {
    if (insertPosition) {
      this.currentChatroomMessagesBox.splice(insertPosition, 0, newMsg)
    } else {
      this.currentChatroomMessagesBox.push(newMsg)
    }
    console.log(this.currentChatroomMessagesBox)
  }
  
  @Mutation
  SET_CHATROOM_ID(id: string): void {
    this.currentChatRoomId = id
  }
  
  @Mutation
  SET_CURRENT_USER_JWT_TOKEN(jwtToken: string): void {
    this.currentUserJwtToken = jwtToken
  }
  
  @Mutation
  SET_SENDING_LOGIN_REQUEST(status: boolean): void {
    this.sendingLogInRequest = status
  }
  
  @Mutation
  CLEAN_CURRENT_CHATROOM_MESSAGES_BOX(): void {
    this.currentChatroomMessagesBox = []
  }
  
  @Action({commit: 'CREATE_MSG'})
  async createMsg({newMsg, insertPosition}: { newMsg: Message, insertPosition?: (number | undefined) }): Promise<{ newMsg: Message, insertPosition?: (number | undefined) }> {
    const currentUser = this.getCurrentUser
    if (newMsg.author !== (currentUser as (Admin | User))._id) {
      let otherUser = this.getOtherUsers.find(user => user._id === newMsg.author)
      if (!otherUser) {
        otherUser = (await getSpecificAdmin(newMsg.author)) as unknown as Admin
        if (otherUser) {
          await this.addOtherUser(otherUser)
        }
      }
    }
    return {newMsg, insertPosition}
  }
  
  @Action({commit: 'SET_CURRENT_USER'})
  async setCurrentUser(originalData: User | Admin): Promise<User | Admin> {
    return await AppStore.newUser(originalData)
  }
  
  @Action({commit: 'ADD_OTHER_USER'})
  async addOtherUser(originalData: User | Admin): Promise<User | Admin> {
    return await AppStore.newUser(originalData)
  }
  
  @Action({commit: 'SET_CURRENT_USER_JWT_TOKEN'})
  setCurrentUserJwtToken(jwtToken: string): string {
    return jwtToken
  }
  
  get isDarkMode(): boolean {
    return this.themeMode === themeModes.DARK
  }
  
  get getMessage(): Array<Message> {
    return this.currentChatroomMessagesBox
  }
  
  get getCurrentUser(): (Admin | User) | undefined {
    return this.currentUser
  }
  
  get getOtherUsers(): Array<Admin | User> {
    return this.otherUsers
  }
  
  get getCurrentChatRoomId(): string {
    return this.currentChatRoomId
  }
  
  get getJwtKey(): string | undefined {
    return this.currentUserJwtToken
  }
  
  get isLoggedIn(): boolean {
    return Boolean(this.currentUser._id)
  }
  
  get isSendingLogInRequest(): boolean {
    return this.sendingLogInRequest
  }
}

export default getModule(AppStore)
