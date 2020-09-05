import {Action, Module, Mutation, VuexModule, getModule} from 'vuex-module-decorators'
import {Message, themeModes, Admin, User, MessageContainerType} from '@/api/types/apiTypes'
import getBase64ImgPath from '@/utils/requestAvatar'
import {getAdmin} from '@/api/api'
import store from '@/store/index'

@Module({name: 'app', stateFactory: true, namespaced: true, store, dynamic: true})
class AppStore extends VuexModule {
  private themeMode = themeModes.AUTO;
  
  private currentUser: Admin | User = {
    _id: ''
  }
  
  private otherUsers: Array<Admin | User> = [
    {
      _id: '',
      username: '',
      cc: false,
      avatar: ''
    }
  ]
  
  private messages: MessageContainerType = {
    chatroom: []
  }
  
  private currentChatRoomId = ''
  
  private currentUserJwtToken = ''
  
  private static async newUser(originalData: User | Admin): Promise<User | Admin> {
    if (originalData && 'avatar' in originalData && originalData.avatar) {
      originalData.avatar = await getBase64ImgPath(originalData.avatar)
    }
    return originalData
  }
  
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
      this.messages.chatroom.splice(insertPosition, 0, newMsg)
    } else {
      this.messages.chatroom.push(newMsg)
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
  
  @Action({commit: 'CREATE_MSG'})
  async createMsg({newMsg, insertPosition}: { newMsg: Message, insertPosition?: (number | undefined) }): Promise<{ newMsg: Message, insertPosition?: (number | undefined) }> {
    const currentUser = this.getCurrentUser
    if (newMsg.author !== (currentUser as (Admin | User))._id) {
      let otherUser = this.getOtherUsers.find(user => user._id === newMsg.author)
      if (!otherUser) {
        otherUser = (await getAdmin(newMsg.author)) as unknown as Admin
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
  
  get getMessage(): MessageContainerType {
    return this.messages
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
}

export default getModule(AppStore)
