export default class {
  private readonly _node!: HTMLElement
  private _previousScrollHeightMinusTop!: number
  
  constructor(node: HTMLElement) {
    this._node = node;
    this._previousScrollHeightMinusTop = 0;
  }
  
  public restore = async (): Promise<void> => {
    this._node.scrollTop = this._node.scrollHeight - this._previousScrollHeightMinusTop;
  }
  
  public prepare = (): void => {
    this._previousScrollHeightMinusTop = this._node.scrollHeight - this._node.scrollTop;
  }
}

export interface ScrollPositionMaintainer {
  restore: (() => void),
  prepare: (() => void)
}

const scrollToY = (y: number, duration = 0, element: HTMLElement): void => {
  if (element.scrollTop === y) {
    return
  }
  
  const cosParameter = (element.scrollTop - y) / 2;
  let scrollCount = 0, oldTimestamp = null as unknown as number;
  
  const step = (newTimestamp: number): (number | void) => {
    if (oldTimestamp !== null) {
      scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;
      if (scrollCount >= Math.PI) {
        return element.scrollTop = y
      }
      element.scrollTop = cosParameter + y + cosParameter * Math.cos(scrollCount);
    }
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

export const scrollToTop = (element: HTMLElement, duration = 0): void => {
  scrollToY(0, duration, element);
}

export const scrollToId = (wrapper: HTMLElement, id: string, duration = 0): void => {
  const element = document.getElementById(id) as HTMLElement
  if (element) {
    const offset = Math.round(element.getBoundingClientRect().top);
    scrollToY(wrapper.scrollTop + offset, duration, wrapper);
  }
}

export const scrollToElement = (wrapper: HTMLElement, element: HTMLElement, duration = 0): void => {
  const offset = Math.round(element.getBoundingClientRect().top);
  scrollToY(wrapper.scrollTop + offset, duration, wrapper);
}
