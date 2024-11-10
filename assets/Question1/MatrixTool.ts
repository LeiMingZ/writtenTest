export default class MatrixTool {
  private matrix: number[][] = [];
  private initPercent: number = 0;
  constructor(
    private row: number = 10,
    private col: number = 10,
    private sumPercent: number = 100,
    private colorNu: number = 5
  ) {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        const index = this.getIndexByRowCol(i, j);
        this.matrix.push([i, j, -1, index]);
      }
    }
    this.initPercent = this.sumPercent / this.colorNu;
    console.log(this.matrix);
  }
  public getIndexByRowCol(row: number, col: number): number {
    if (row > this.row || col > this.col) return -1;
    if (row < 0 || col < 0) return -1;
    return row * this.col + col;
  }
  public getRowColByIndex(index: number): number[] {
    if (index > this.matrix.length) return null;
    const row = Math.floor(index / this.col);
    const col = index % this.col;
    return [row, col];
  }
  public getMatrix(): number[][] {
    return this.matrix;
  }
  public cellInfoByIndex(index: number): number[] {
    return this.matrix[index];
  }
  public cellInfoByRowCol(row: number, col: number): number[] {
    if (row > this.row || col > this.col) return null;
    const index = this.getIndexByRowCol(row, col);
    return this.matrix[index];
  }
  public randomColorIndex(index: number): number {
    const colorIndex = Math.floor(Math.random() * this.colorNu);
    if (this.matrix[index]) this.matrix[index][2] = colorIndex;
    return colorIndex;
  }
  public getRowCol(): number[] {
    return [this.row, this.col];
  }
  public randomDestColorIndex(index: number, percentX: number, percentY: number): number {
    if (index > this.matrix.length) return -1;
    const leftIndex = index - 1;
    const leftColorIndex = this.matrix[leftIndex][2];
    const topIndex = index - this.col;
    let topColorIndex = -1;
    let sumPercent = this.sumPercent;
    if (topIndex >= 0) topColorIndex = this.matrix[topIndex][2];
    console.log('左边颜色:', leftColorIndex, ' 上边颜色:', topColorIndex);
    //左上都没颜色
    if (leftColorIndex === -1 && topColorIndex === -1) {
      console.log('左上均没颜色，各颜色概率相同 普通随机');
      return this.randomColorIndex(index);
    }
    //格子
    const colorArr = new Array(this.colorNu).fill(0);
    const excludeArr = [];
    if (leftColorIndex !== -1 && topColorIndex !== -1) {
      if (leftColorIndex === topColorIndex) {
        const tempPercent = sumPercent - this.initPercent;
        percentY = percentY > tempPercent ? tempPercent : percentY;
        colorArr[leftColorIndex] += percentY + this.initPercent;
        excludeArr.push(leftColorIndex);
        console.log('左上同色值 增加y%', percentY);
      } else {
        const tempPercent = sumPercent - this.initPercent * 2;
        percentX = percentX * 2 > tempPercent ? tempPercent / 2 : percentX;
        colorArr[leftColorIndex] += percentX + this.initPercent;
        colorArr[topColorIndex] += percentX + this.initPercent;
        excludeArr.push(leftColorIndex, topColorIndex);
        console.log('左上不同色 各增加X%:', percentX);
      }
    } else {
      //只有一个临近点有色
      const tempPercent = sumPercent - this.initPercent;
      percentX = percentX > tempPercent ? tempPercent : percentX;
      if (topColorIndex !== -1) {
        colorArr[topColorIndex] += percentX + this.initPercent;
        excludeArr.push(topColorIndex);
        console.log('左没颜色 上有颜色 增加X%:', percentX);
      } else if (leftColorIndex !== -1) {
        colorArr[leftColorIndex] += percentX + this.initPercent;
        excludeArr.push(leftColorIndex);
        console.log('左有颜色 上没有颜色 增加X%:', percentX);
      }
    }
    const alreadyPercent = colorArr.reduce((nu, sum) => {
      sum += nu;
      return sum;
    }, 0);
    let average = (sumPercent - alreadyPercent) / (this.colorNu - excludeArr.length);
    for (let i = 0; i < colorArr.length; i++) {
      if (!excludeArr.includes(i)) {
        colorArr[i] = average;
      }
    }

    const randomNu = Math.floor(Math.random() * this.sumPercent);
    let sum = 0;
    const temp = colorArr.reduce((n, sum) => {
      sum += n;
      return sum;
    }, 0);

    console.log('各颜色的随机概率：', colorArr, '概率总和:', temp);
    for (let i = 0; i < colorArr.length; i++) {
      sum += colorArr[i];
      if (colorArr[i] === 0) continue;
      console.log('随机数:', randomNu, ' 当前范围:', sum);
      if (randomNu <= sum) {
        if (this.matrix[index]) this.matrix[index][2] = i;
        return i;
      }
    }
  }
}
