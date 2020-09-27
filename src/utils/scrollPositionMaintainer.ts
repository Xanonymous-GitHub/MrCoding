export default class {
  private _node!: HTMLElement
  private _previousScrollHeightMinusTop!: number
  
  constructor(node: HTMLElement) {
    this._node = node;
    this._previousScrollHeightMinusTop = 0;
  }
  
  public restore = () => {
    this._node.scrollTop = this._node.scrollHeight - this._previousScrollHeightMinusTop;
  }
  
  public prepareFor = () => {
    this._previousScrollHeightMinusTop = this._node.scrollHeight - this._node.scrollTop;
  }
}
