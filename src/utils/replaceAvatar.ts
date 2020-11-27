export default (avatar: string | undefined, container: HTMLElement): void => {
  if (avatar && avatar !== '') {
    const avatarContainer = container.querySelector('.avatar') as HTMLDivElement
    const defaultAvatar = avatarContainer.childNodes[0] as HTMLElement
    avatarContainer.removeChild(defaultAvatar)
    const realAvatar = document.createElement("div") as HTMLDivElement
    realAvatar.setAttribute("style", `
      background-image: url("${avatar}");
      background-position: center center;
      background-size: cover;
      width: inherit;
      height: inherit;
    `)
    realAvatar.setAttribute("alt", "")
    avatarContainer.appendChild(realAvatar)
  }
}
