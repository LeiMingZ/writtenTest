import CellComponent from './CellComponent';
import MatrixTool from './MatrixTool';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Question1 extends cc.Component {
  @property(cc.EditBox)
  private xInput: cc.EditBox = null;
  @property(cc.EditBox)
  private yInput: cc.EditBox = null;

  @property(cc.Button)
  private generateBtn: cc.Button = null;

  @property({
    step: 1,
    min: 10,
  })
  private row = 10;
  @property({
    step: 1,
    min: 10,
  })
  private col = 10;
  @property(cc.Node)
  private gridNode: cc.Node = null;
  @property(cc.Prefab)
  private cellPrefab: cc.Prefab = null;
  @property
  private spaceX = 5;
  @property
  private spaceY = 5;

  private nodePool: cc.NodePool = null;
  private colorArr = [];
  private percentX = 0;
  private percentY = 0;
  private matrixTool: MatrixTool = null;
  private sumPercent = 100;

  // LIFE-CYCLE CALLBACKS:
  protected onLoad(): void {}
  protected start() {
    this.colorArr = [cc.Color.BLUE, cc.Color.CYAN, cc.Color.GRAY, cc.Color.MAGENTA, cc.Color.ORANGE];
    this.nodePool = new cc.NodePool();
    this.generateBtn && this.generateBtn.node.on('click', this.generateGrid, this);
    this.getMatrixTool();
    this.editBoxHandle();
  }
  private getMatrixTool(): MatrixTool {
    if (this.matrixTool) return this.matrixTool;
    this.matrixTool = new MatrixTool(this.row, this.col, this.sumPercent, this.colorArr.length);
    return this.matrixTool;
  }

  private generateGrid(): void {
    if (!this.gridNode || !this.cellPrefab) return;
    this.clearAllNode();
    const tool = this.getMatrixTool();
    const [row, col] = tool.getRowCol();
    const { width, height, anchorX, anchorY } = this.gridNode;
    const startX = -width * anchorX;
    const startY = height * anchorY;
    const cellWidth = (width - (row - 1) * this.spaceX) / row;
    const cellHeight = (height - (col - 1) * this.spaceY) / col;
    const { spaceX, spaceY } = this;
    for (let c = 1; c <= col; c++) {
      let cellY = startY - cellHeight / 2 - c * (cellHeight + spaceY);
      for (let r = 1; r <= row; r++) {
        let cellX = startX + cellWidth / 2 + r * (cellWidth + spaceX);
        const index = (c - 1) * row + r;
        this.addCell(cellWidth, cellHeight, cellX, cellY, index);
      }
    }
    console.log(this.gridNode.children.length);
  }
  private addCell(w: number, h: number, x: number, y: number, index: number): void {
    const node = this.getNodeFromPool();
    node.width = w;
    node.height = h;
    node.x = x;
    node.y = y;
    node.parent = this.gridNode;
    const label = node.getComponentInChildren(cc.Label);
    label.string = index.toString();
    const comp = node.getComponent(CellComponent);
    if (comp) comp.setTag(index);
    node.on(cc.Node.EventType.TOUCH_END, this.CellTouchEvent, this);
  }
  private CellTouchEvent(event: cc.Event): void {
    const node = event.currentTarget;
    const comp = node.getComponent(CellComponent);
    if (!comp) return;
    const tool = this.getMatrixTool();
    const { tag } = comp;
    let index = -1;
    if (tag === 1) {
      index = tool.randomColorIndex(tag - 1);
    } else {
      index = tool.randomDestColorIndex(tag - 1, this.percentX, this.percentY);
    }
    console.log(index);

    if (index !== -1) node.color = this.colorArr[index];
  }
  private getNodeFromPool(): cc.Node {
    let cell: cc.Node = null;
    if (this.nodePool.size() > 0) {
      cell = this.nodePool.get();
    } else {
      cell = cc.instantiate(this.cellPrefab);
    }
    return cell;
  }
  private clearAllNode(): void {
    const { children } = this.gridNode;
    for (let i = children.length - 1; i >= 0; i--) {
      this.nodePool.put(children[i]);
    }
  }
  private editBoxHandle(): void {
    this.xInput.node.on(
      'editing-did-ended',
      (edit: cc.EditBox) => {
        const str = edit.string;
        let nu = parseInt(str);
        if (isNaN(nu)) {
          edit.string = '0';
          console.warn('请输入有效数字');
          return;
        }
        nu = nu > this.sumPercent - this.percentX ? this.sumPercent - this.percentX : nu;
        edit.string = nu.toString();
        this.percentX = nu;
        console.log(str);
      },
      this
    );
    this.yInput.node.on(
      'editing-did-ended',
      (edit: cc.EditBox) => {
        const str = edit.string;
        let nu = parseInt(str);
        if (isNaN(nu)) {
          edit.string = '0';
          console.warn('请输入有效数字');
          return;
        }
        nu = nu > this.sumPercent - this.percentY ? this.sumPercent - this.percentY : nu;
        edit.string = nu.toString();
        this.percentY = nu;
        console.log(str);
      },
      this
    );
  }
}
