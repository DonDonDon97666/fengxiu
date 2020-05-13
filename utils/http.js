import {config} from "../config/config";
import {promisic} from "./util";
import {Token} from "../model/token";
import {codes} from "../config/exception-config";
import {HttpException} from "../core/http-exception";

class Http {
    static async request({url,
                            data,
                            refetch = true,
                            throwError = false,
                            method='GET'}){

        let res;
        try{
            res = await promisic(wx.request)({
                url : `${config.apiBaseUrl}${url}`,
                method : method,
                data : data,
                header : {
                    'content-type': 'application/json',
                    appKey : config.appKey,
                    'authorization': `Bearer ${wx.getStorageSync('token')}`
                }
            })
        }catch(e){
            if (throwError) {
                throw new HttpException(-1, codes[-1])
            }
            Http.showError(-1)
            res.data = null
            return res
        }

        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
            return res
        }else{
            if (code === '401') {
                // 二次重发
                if (refetch) {
                    Http._refetch({
                        url,
                        data,
                        method
                    })
                }
            }
            else{
                if (throwError) {
                    throw new HttpException(res.data.code, res.data.message, code)
                }
                if (code === '404') {
                    if (res.data.code !== undefined) {
                        res.data = null
                    }
                    return res
                }
                const error_code = res.data.error_code;
                Http.showError(error_code, res.data)
            } 
        }

        return res
    }

    static async _refetch(data) {
        const token = new Token()
        await token.getTokenFromServer()
        data.refetch = false
        return await Http.request(data)
    }

    static showError(error_code, serverError) {
        let tip
        if (!error_code) {
            tip = codes[9999]
        } else {
            if (codes[error_code] === undefined) {
                tip = serverError.message
            } else {
                tip = codes[error_code]
            }
        }

        wx.showToast({
            icon: "none",
            title: tip,
            duration: 3000
        })
    }

}
export {
    Http
}