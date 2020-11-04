export default (avatar: string | undefined, container: HTMLElement): void => {
  if (avatar && avatar !== '') {
    const avatarContainer = container.querySelector('.avatar') as HTMLDivElement
    const defaultAvatar = avatarContainer.childNodes[0] as HTMLElement
    avatarContainer.removeChild(defaultAvatar)
    const realAvatar = document.createElement("img") as HTMLImageElement
    realAvatar.setAttribute("src", avatar)
    realAvatar.setAttribute("alt", "")
    avatarContainer.appendChild(realAvatar)
  }
}
