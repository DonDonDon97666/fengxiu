/**
 * @作者 吴延昭
 * @创建时间 2020/3/11 17:08
 */
import {Matrix} from "./matrix";
import {Fence} from "./fence";

class FenceGroup {
    spu
    skuList = []
    fences

    constructor(spu) {
        this.spu = spu
        this.skuList = spu.sku_list
    }

    /*initFenceGroup(){
        const matrix = this._createMatrix(this.skuList)
        const fenceGroup = []
        let curCol = -1
        matrix.each((element, row, col) => {
            //遍历新的一列，创建一个新的fence
            if(curCol !== col){
                curCol = col
                fenceGroup[curCol] = this._createFence()
            }
            fenceGroup[curCol].pushValueTitle(element.value)
        })
    }*/

    getSku(code) {
        const fullCode = this.spu.id + '$' + code
        const sku = this.spu.sku_list.find(sku => sku.code === fullCode)
        return sku ? sku : null
    }

    getFenceTitleByIndex(index) {
        return this.fences[index].title
    }

    initFenceGroup() {
        const matrix = this._createMatrix(this.skuList)
        const fenceGroup = []

        const AT = matrix.transpose()
        AT.forEach(element => {
            const fence = new Fence(element)
            fence.init()
            if(this._hasSketchSku() && this._isSketchSku(fence.id)){
                fence.setFenceSketch(this.skuList)
            }
            fenceGroup.push(fence)
        })
        this.fences = fenceGroup
    }

    /*_createFence(){
        const fence = new Fence()
        return fence
    }*/

    eachCell(cb) {
        for (let i = 0; i < this.fences.length; i++) {
            for (let j = 0; j < this.fences[i].cells.length; j++) {
                const cell = this.fences[i].cells[j]
                cb(cell, i, j)
            }
        }
    }

    _createMatrix(skuList) {
        const matrix = []
        skuList.forEach(sku => {
            matrix.push(sku.specs)
        })

        return new Matrix(matrix)
    }

    getDefaultSku() {
        const defaultSkuID = this.spu.default_sku_id
        if (!defaultSkuID) {
            return
        }
        return this.skuList.find(sku => sku.id === defaultSkuID)
    }

    setCellStatusByID(cellID, status) {
        this.eachCell(cell => {
            if (cell.id === cellID) {
                cell.status = status
            }
        })
    }

    setCellStatusByXY(x, y, status) {
        this.fences[x].cells[y].status = status
    }

    _hasSketchSku() {
        return this.spu.sketch_spec_id ? true : false
    }

    _isSketchSku(fenceID) {
        return this.spu.sketch_spec_id === fenceID ? true : false
    }
}

export {
    FenceGroup
}