/**
 * @作者 吴延昭
 * @创建时间 2020/3/11 20:20
 */

class Matrix {
    //矩阵对象，二维数组
    m

    constructor(matrix) {
        this.m = matrix
    }

    getRowNum() {
        return this.m.length
    }

    getColNum() {
        return this.m[0].length
    }

    /*each(cb) {
        for (let col = 0; col < this.getColNum(); col++) {
            for (let row = 0; row < this.getRowNum(); row++) {
                const element = this.m[row][col]
                cb(element, row, col)
            }
        }
    }*/

    transpose() {
        const desArr = []
        for (let col = 0; col < this.getColNum(); col++) {
            desArr[col] = []
            for (let row = 0; row < this.getRowNum(); row++) {
                desArr[col][row] = this.m[row][col]
            }
        }
        return desArr
    }
}

export {
    Matrix
}