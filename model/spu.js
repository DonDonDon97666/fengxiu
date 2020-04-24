/**
 * @作者 吴延昭
 * @创建时间 2020/3/11 16:14
 */
import {Http} from "../utils/http";

class Spu{

    static async getDetail(pid){
        const res = await Http.request({
            url:`spu/id/${pid}/detail`
        })
        return res.data
    }

    static isNoSpec(spu){
        if(spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0){
            return true
        }
        return false
    }
}

export {
    Spu
}