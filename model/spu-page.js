/**
 * @作者 吴延昭
 * @创建时间 2020/3/6 16:58
 */
import {Page} from "../utils/page";

class SpuPage{

    static latestUrl = 'spu/latest';

    static getLastestPage(){
        return new Page({
            url:SpuPage.latestUrl
        },3)
    }
}

export {
    SpuPage
}