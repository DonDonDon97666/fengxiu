/**
 * @作者 吴延昭
 * @创建时间 2020/3/29 10:19
 */
import {promisic} from "./util";
import {px2rpx} from "../miniprogram_npm/lin-ui/utils/util";

const getSystemSize = async function () {
    const res = await promisic(wx.getSystemInfo)()
    return {
        windowHeight: res.windowHeight,
        windowWidth: res.windowWidth,
        screenHeight: res.screenHeight,
        screenWidth: res.screenWidth
    }
}

const getWindowHeightRpx = async function(){
    const res = await getSystemSize()
    const h = px2rpx(res.windowHeight)
    return h
}

export {
    getSystemSize,
    getWindowHeightRpx
}