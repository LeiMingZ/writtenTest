// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CellComponent extends cc.Component {
  @property
  private tag = 0;
  @property
  private colorIndex = -1;

  start() {
    this.node.on(cc.Node.EventType.TOUCH_END, () => {}, this);
  }
  public setTag(tag: number): void {
    this.tag = tag;
  }
  public getTag(): number {
    return this.tag;
  }
  public getColorIndex(): number {
    return this.colorIndex;
  }
  public setColorIndex(index: number): void {
    this.colorIndex = index;
  }

  // update (dt) {}
}
