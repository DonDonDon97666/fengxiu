import {Http} from "../utils/http";

class Banner {
    static locationB = 'b-1';
    static locationG = 'b-2';

    static async getHomeLocationB(){
        const res = await Http.request({
            url : `banner/name/${Banner.locationB}`
        });
        return res.data;
    }

    static async getHomeLocationG(){
        const res = await Http.request({
            url : `banner/name/${Banner.locationG}`
        });
        return res.data;
    }
}

export {
    Banner
}