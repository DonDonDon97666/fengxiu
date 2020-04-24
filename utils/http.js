import {config} from "../config/config";
import {promisic} from "./util";

class Http {
    static async request({url,data,method='GET'}){
        return await promisic(wx.request)({
            url : `${config.apiBaseUrl}${url}`,
            method : method,
            data : data,
            header : {
                appKey : config.appKey
            }
        });
    }
}
export {
    Http
}