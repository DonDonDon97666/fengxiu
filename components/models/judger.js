/**
 * @作者 吴延昭
 * @创建时间 2020/3/17 10:24
 */
import {SkuCode} from "./sku-code";
import {CellStatus} from "../../core/enum";
import {SkuPending} from "./sku-pending";
import {Joiner} from "../../utils/joiner";

class Judger {

    fenceGroup
    pathDic = []
    skuPending

    constructor(fenceGroup){
        this.fenceGroup = fenceGroup
        this._initPathDic()
        this._initSkuPending()
    }

    isSkuIntact(){
        return this.skuPending.isSkuIntact()
    }

    getDeterminateSku(){
        const code = this.skuPending.getSkuCode()
        const sku = this.fenceGroup.getSku(code)
        return sku
    }

    getCurrentValues(){
        return this.skuPending.getCurrentSpecValues()
    }

    getMissingKeys(){
        const missingKeysIndex = this.skuPending.getMissingSpecKeysIndex()
        return missingKeysIndex.map(i=>{
            return this.fenceGroup.getFenceTitleByIndex(i)
        })
    }

    _initSkuPending(){
        const specsLength = this.fenceGroup.fences.length
        this.skuPending = new SkuPending(specsLength)
        const sku = this.fenceGroup.getDefaultSku()
        if(!sku){
            return
        }

        this.skuPending.init(sku)

        this._initDefaultCell()
        this.judge(null, null, null, true)
    }

    _initDefaultCell(){
        this.skuPending.pending.forEach(cell=>{
            this.fenceGroup.setCellStatusByID(cell.id, CellStatus.SELECTED)
        })
    }

    _initPathDic(){
        this.fenceGroup.spu.sku_list.forEach(sku=>{
            const skuCode = new SkuCode(sku.code)
            this.pathDic = this.pathDic.concat(skuCode.totalSegments)
        })
    }

    judge(cell, x, y, isInit=false){

        if(!isInit){
            this._changeCurrentCellStatus(cell, x, y)
        }

        this.fenceGroup.eachCell((cell, x, y) => {
            const path = this._findPotentialPath(cell, x, y)
            if(!path){
                return
            }
            const isIn = this._isInDic(path)
            if(isIn){
                this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
            }
            else{
                this.fenceGroup.setCellStatusByXY(x, y, CellStatus.FORBIDDEN)
            }
        })
    }

    _isInDic(path){
        return this.pathDic.includes(path)
    }

    _findPotentialPath(cell, x, y){
        const joiner = new Joiner('#')

        for(let i=0; i<this.fenceGroup.fences.length; i++){
            //每行已选的Cell
            const selectedCell = this.skuPending.findSelectedCellByX(i)

            if(x === i){
                //当前行
                if(this.skuPending.isSelected(cell, x)){
                    return
                }
                const cellCode = this._getCellCode(cell.spec)
                joiner.join(cellCode)
            }
            else{
                //不是当前行
                if(selectedCell){
                    const otherRowCellCode = this._getCellCode(selectedCell.spec)
                    joiner.join(otherRowCellCode)
                }
            }
        }

        return joiner.getStr()
    }

    _getCellCode(spec){
        return spec.key_id + '-' + spec.value_id
    }

    _changeCurrentCellStatus(cell, x, y){
        if(cell.status === CellStatus.WAITING){
            this.fenceGroup.setCellStatusByXY(x, y, CellStatus.SELECTED)
            this.skuPending.insertCell(cell, x)
        }
        else if(cell.status === CellStatus.SELECTED){
            this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
            this.skuPending.removeCell(x)
        }
    }
}

export {
    Judger
}