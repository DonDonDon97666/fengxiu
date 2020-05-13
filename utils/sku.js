/**
 * @创建时间 2020-04-17 19:15
 */
import {Joiner} from "./joiner";

const parseSpecValue = function (specs) {
    if(!specs){
        return null
    }
    const joiner = new Joiner('; ', 2)
    specs.map(spec=>{
        joiner.join(spec.value)
    })
    return joiner.getStr()
}


export {
    parseSpecValue
}

