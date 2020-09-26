import {getHistory} from "@/api/api";
import appStore from "@/store/app";
import {Message} from "@/api/types/apiTypes";

export default async function (queryAmount: number): Promise<void> {
  const currentChatRoomId = appStore.getCurrentChatRoomId
  const lastQueriedMessageCreatedTime = appStore.getLastQueriedMessageCreatedTime
  const messages = await getHistory(currentChatRoomId, lastQueriedMessageCreatedTime, queryAmount, appStore.getJwtKey as string) as unknown as Array<Message>
  const amountOfMessages = messages.length
  let newLastQueriedMessageCreatedTime = lastQueriedMessageCreatedTime
  if (amountOfMessages) {
    newLastQueriedMessageCreatedTime = ((messages[amountOfMessages - 1].createdAt as number) - 1)
    for (const newMsg of messages.slice(0, amountOfMessages - 1)) {
      await appStore.createMsg({newMsg, insertAtTop: true})
    }
    const newMsg = messages[amountOfMessages - 1]
    // mark the last msg to be the observer.
    newMsg.observer = true
    await appStore.createMsg({newMsg, insertAtTop: true})
  }
  appStore.SET_LAST_QUERIED_MESSAGE_CREATED_TIME(newLastQueriedMessageCreatedTime)
}
