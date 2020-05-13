import {Http} from "../utils/http";

class Sku{
    static async getSkusByIds(ids) {
        const res = await Http.request({
            url: `sku?ids=${ids}`
        })
        return res.data
    }
}

export {
    Sku
}