// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator;

@ccclass
export default class PlayBtnComponent extends cc.Component {
  private idleDuration: number = 0.5;
  private idleDelta: number = 0.05;

  private clickQuickDuration: number = 0.05;
  private clickEndDelta: number = 0.1;

  protected start() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.clickStart, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.clickEnd, this);
    this.playIdleAction();
    this.initAnimation();
  }

  private initAnimation(): void {
    const animation = this.getComponent(cc.Animation);
    animation.on(
      'finished',
      () => {
        this.playIdleAction();
      },
      this
    );
  }

  public showBtnEvent(): void {
    this.showPlayBtn();
  }
  private clickStart(): void {
    this.node.stopAllActions();
    this.node.scale = 0.8;
    this.node.color = cc.Color.GRAY;
    this.playClickAction();
  }
  private clickEnd(): void {
    this.node.stopAllActions();
    this.node.scale = 1;
    this.node.color = cc.Color.WHITE;
    this.playClickAction();
  }
  public showPlayBtn(): void {
    const animation = this.getComponent(cc.Animation);
    animation.play('showPlay');
  }
  public playClickAction(): void {
    this.node.stopAllActions();
    const { clickQuickDuration, clickEndDelta } = this;
    const quickAction = this.getClickScaleAction(clickEndDelta, clickQuickDuration);
    const action1 = cc.sequence(
      quickAction,
      cc.callFunc(() => this.playIdleAction())
    );
    this.node.runAction(action1);
  }
  public playIdleAction(): void {
    this.node.stopAllActions();
    const { idleDuration, idleDelta } = this;
    this.node.runAction(this.getIdleAction(idleDuration, idleDelta));
  }
  private getIdleAction(duration: number, delta: number): cc.ActionInterval {
    const { scale } = this.node;
    const max = scale + delta;
    const min = scale - delta;
    return cc.sequence([cc.scaleTo(duration, max, min), cc.scaleTo(duration, min, max)]).repeatForever();
  }
  private getClickScaleAction(delta: number, duration: number): cc.ActionInterval {
    const { scale } = this.node;
    const action1 = cc.sequence(
      cc.scaleTo(duration, scale + delta, scale + delta),
      cc.scaleTo(duration, scale, scale),
      cc.scaleTo(duration, scale + delta / 2, scale + delta / 2),
      cc.scaleTo(duration, scale, scale)
    );
    return action1;
  }
}
