/**
 * @作者 吴延昭
 * @创建时间 2020/3/28 13:53
 */
import {Http} from "../utils/http";

class SaleExplain {
    static async getFixed() {
        const res = await Http.request({
            url: `sale_explain/fixed`
        })

        return res.data.map(e => {
            return e.text
        })
    }
}

export {
    SaleExplain
}