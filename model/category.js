/**
 * @作者 吴延昭
 * @创建时间 2020/3/1 20:28
 */
import {Http} from "../utils/http";

class Category {
    static async getGridCategory(){
        const res = await Http.request({
           url:'category/grid/all'
        });
        return res.data;
    }
}

export {
    Category
}