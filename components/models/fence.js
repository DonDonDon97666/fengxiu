/**
 * @作者 吴延昭
 * @创建时间 2020/3/11 17:08
 */
import {Cell} from "./cell";

class Fence {
    cells = []
    specs
    title
    id

    constructor(specs) {
        this.specs = specs
        this.title = specs[0].key
        this.id = specs[0].key_id
    }

    /*pushValueTitle(title){
        this.valueTitles.push(title)
    }*/

    init() {
        this._initCells()
    }

    _initCells() {
        this.specs.forEach(spec => {
            const existed = this.cells.some(cell => {
                return cell.id === spec.value_id
            })
            if (existed) {
                return
            }
            const cell = new Cell(spec)
            this.cells.push(cell)
        })
    }

    setFenceSketch(skuList) {
        this.cells.forEach(cell => {
            this._setCellSkuImg(cell, skuList)
        })
    }

    _setCellSkuImg(cell, skuList) {
        const cellCode = cell.getCellCode()
        const matchedSku = skuList.find(sku => sku.code.includes(cellCode))
        if (matchedSku) {
            cell.skuImg = matchedSku.img
        }
    }
}

export {
    Fence
}