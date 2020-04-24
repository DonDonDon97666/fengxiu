/**
 * @作者 吴延昭
 * @创建时间 2020/3/20 11:49
 */
import {Cell} from "./cell";
import {Joiner} from "../../utils/joiner";

class SkuPending {
    pending = []
    size

    constructor(size) {
        this.size = size
    }

    init(sku) {
        for (let i = 0; i < sku.specs.length; i++) {
            const cell = new Cell(sku.specs[i])
            this.insertCell(cell, i)
        }
    }

    getSkuCode() {
        const joiner = new Joiner('#')
        this.pending.forEach(cell => {
            joiner.join(cell.getCellCode())
        })
        return joiner.getStr()
    }

    getCurrentSpecValues() {
        const values = this.pending.map(cell => {
            return cell ? cell.spec.value : null
        })
        return values
    }

    getMissingSpecKeysIndex() {
        const keysIndex = []
        for (let i = 0; i < this.size; i++) {
            if(!this.pending[i]){
                keysIndex.push(i)
            }
        }
        return keysIndex
    }

    isSkuIntact() {
        for (let i = 0; i < this.size; i++) {
            if (this._isEmptyPart(i)) {
                return false
            }
        }
        return true
    }

    _isEmptyPart(index) {
        return this.pending[index] ? false : true
    }

    insertCell(cell, x) {
        this.pending[x] = cell
    }

    removeCell(x) {
        this.pending[x] = null
    }

    findSelectedCellByX(x) {
        return this.pending[x]
    }

    isSelected(cell, x) {
        const pending = this.pending[x]
        if (!pending) {
            return false
        }
        return pending.id === cell.id
    }


}

export {
    SkuPending
}