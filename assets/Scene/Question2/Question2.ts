// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Question2 extends cc.Component {
  @property(cc.Label)
  private aArrLabel: cc.Label = null;
  @property(cc.Label)
  private bArrLabel: cc.Label = null;
  @property(cc.Label)
  private findLabel: cc.Label = null;

  @property(cc.Label)
  private OLabel: cc.Label = null;

  private aArr: number[] = [];
  private bArr: number[] = [];
  private sum: number = 0;
  protected start(): void {
    this.OLabel.string = `
    aArr  m=aArr.length  时间复杂度是 O(m) \n 
    bArr  n = bArr.length 时间复杂度是 O(n) \n
    总的时间复杂度是 O(m+n)
   `;
  }

  /**
   * 使用hash表解决bArr的多次循环问题 不用hash 则时间复杂度是 O(n2)
   * aArr 的时间复杂度是 O(m)      m=aArr.length
   * bArr 的时间复杂度是 O(n)      n = bArr.length
   * 总的时间复杂度是 O(m+n)
   */
  private findSum(aArr: number[], bArr: number[], sum: number): boolean {
    if (aArr.length === 0 || bArr.length === 0) return false;
    let map = new Map<number, number>();
    let j = 0;
    for (let i = 0; i < aArr.length; i++) {
      const temp = sum - aArr[i];
      if (temp < 0) continue;
      if (map.has(temp)) return true;
      for (; j < bArr.length; j++) {
        if (bArr[j] === temp) return true;
        map.set(bArr[j], j);
      }
    }
    return false;
  }
  caseBtnEvent(): void {
    this.caseArr();
    this.commonEvent();
  }
  btnEvent(): void {
    this.generateArr();
    this.commonEvent();
  }
  commonEvent(): void {
    const { aArr, bArr, sum } = this;
    const bool = this.findSum(aArr, bArr, sum);
    const aArrStr = `数组A [ ${aArr.join(',')}]`;
    const bArrStr = `数组B  [${bArr.join(',')}]`;
    const findStr = `${sum}: ${bool}`;
    console.log(aArrStr);
    console.log(bArrStr);
    console.log(findStr);
    this.aArrLabel.string = aArrStr;
    this.bArrLabel.string = bArrStr;
    this.findLabel.string = findStr;
  }

  //生成测试数据
  private generateArr(): void {
    this.aArr.length = 0;
    this.bArr.length = 0;
    const randomCount = 7;
    const maxRandom = 300;
    const m = Math.floor(Math.random() * randomCount);
    const n = Math.floor(Math.random() * randomCount);
    for (let i = 0; i < m; i++) {
      this.aArr.push(Math.floor(Math.random() * maxRandom));
    }
    for (let i = 0; i < n; i++) {
      this.bArr.push(Math.floor(Math.random() * maxRandom));
    }
    const indexA = Math.floor(Math.random() * this.aArr.length);
    const indexB = Math.floor(Math.random() * this.bArr.length);
    const delta = Math.floor(Math.random() * 2);
    let bEle = !!this.bArr[indexB] ? this.bArr[indexB] : 0;
    let aEle = !!this.aArr[indexA] ? this.aArr[indexA] : 0;

    this.sum = bEle + aEle + delta;
  }
  private caseArr(): void {
    this.aArr = [10, 40, 5, 280];
    this.bArr = [234, 5, 2, 148, 23];
    this.sum = 42;
  }

  // update (dt) {}
}
