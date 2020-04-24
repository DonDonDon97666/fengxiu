/**
 * @作者 吴延昭
 * @创建时间 2020/3/17 10:23
 */
import {combination} from "../../utils/util";

class SkuCode{
    code
    spuID
    totalSegments = []

    constructor(code){
        this.code = code
        this._splitToSegments()
    }

    _splitToSegments(){
        const spuAndSpec = this.code.split('$')
        this.spuID = spuAndSpec[0]

        const specCodeArr = spuAndSpec[1].split('#');
        const length = specCodeArr.length

        for(let i=1; i<=length; i++){
            const segments = combination(specCodeArr, i)
            const newSegments = segments.map(segs=>{
                return segs.join('#')
            })
            this.totalSegments = this.totalSegments.concat(newSegments)
        }
    }
}

export {
    SkuCode
}