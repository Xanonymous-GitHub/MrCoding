import {Action, Module, Mutation, VuexModule, getModule} from 'vuex-module-decorators'
import {Message, ThemeModes, Admin, LiffUser, UserType} from '@/api/types/apiTypes'
import getBase64ImgPath from '@/utils/requestAvatar'
import {getSpecificUser} from '@/api/api'
import store from '@/store/index'

@Module({name: 'app', stateFactory: true, namespaced: true, store, dynamic: true})
class AppStore extends VuexModule {
  private themeMode = ThemeModes.AUTO;
  private userType = UserType.UNKNOWN;
  
  private currentUser: Admin | LiffUser = {
    _id: '',
    username: '',
    avatar: ''
  }
  
  private otherUsers: Array<Admin | LiffUser> = [
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
  
  private static async newUser(originalData: LiffUser | Admin): Promise<LiffUser | Admin> {
    if (originalData && 'avatar' in originalData && originalData.avatar) {
      originalData.avatar = await getBase64ImgPath(originalData.avatar)
    }
    return originalData
  }
  
  @Mutation
  SET_THEME_MODE(mode: ThemeModes): void {
    this.themeMode = mode
  }
  
  @Mutation
  SET_USER_TYPE(type: UserType): void {
    this.userType = type
  }
  
  @Mutation
  SET_CURRENT_USER(originalData: LiffUser | Admin): void {
    this.currentUser = originalData
  }
  
  @Mutation
  ADD_OTHER_USER(otherUser: LiffUser | Admin): void {
    this.otherUsers.push(otherUser)
  }
  
  @Mutation
  CREATE_MSG({newMsg, insertPosition}: { newMsg: Message, insertPosition: number }): void {
    if (insertPosition) {
      this.currentChatroomMessagesBox.splice(insertPosition, 0, newMsg)
    } else {
      this.currentChatroomMessagesBox.push(newMsg)
    }
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
    if (newMsg.author !== (currentUser as (Admin | LiffUser))._id) {
      let otherUser = this.getOtherUsers.find(user => user._id === newMsg.author)
      if (!otherUser) {
        otherUser = (await getSpecificUser(newMsg.author)) as unknown as (Admin | LiffUser)
        if (otherUser) {
          await this.addOtherUser(otherUser)
        }
      }
    }
    return {newMsg, insertPosition}
  }
  
  @Action({commit: 'SET_CURRENT_USER'})
  async setCurrentUser(originalData: LiffUser | Admin): Promise<LiffUser | Admin> {
    return await AppStore.newUser(originalData)
  }
  
  @Action({commit: 'ADD_OTHER_USER'})
  async addOtherUser(originalData: LiffUser | Admin): Promise<LiffUser | Admin> {
    return await AppStore.newUser(originalData)
  }
  
  @Action({commit: 'SET_CURRENT_USER_JWT_TOKEN'})
  setCurrentUserJwtToken(jwtToken: string): string {
    return jwtToken
  }
  
  get isDarkMode(): boolean {
    return this.themeMode === ThemeModes.DARK
  }
  
  get getUserType(): UserType {
    return this.userType
  }
  
  get getMessage(): Array<Message> {
    return this.currentChatroomMessagesBox
  }
  
  get getCurrentUser(): (Admin | LiffUser) | undefined {
    return this.currentUser
  }
  
  get getOtherUsers(): Array<Admin | LiffUser> {
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
