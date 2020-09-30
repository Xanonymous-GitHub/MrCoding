export default class {
  private readonly _node!: HTMLElement
  private _previousScrollHeightMinusTop!: number
  
  constructor(node: HTMLElement) {
    this._node = node;
    this._previousScrollHeightMinusTop = 0;
  }
  
  public restore = async () => {
    this._node.scrollTop = this._node.scrollHeight - this._previousScrollHeightMinusTop;
  }
  
  public prepare = () => {
    this._previousScrollHeightMinusTop = this._node.scrollHeight - this._node.scrollTop;
  }
}

export interface ScrollPositionMaintainer {
  restore: (() => void),
  prepare: (() => void)
}
