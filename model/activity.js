/**
 * @作者 吴延昭
 * @创建时间 2020/3/2 14:32
 */
import {Http} from "../utils/http";

class Activity {

    static activityName = 'a-2';

    static async getHomeLocationD(){
        const res = await Http.request({
            url: `activity/name/${Activity.activityName}`
        });
        return res.data;
    }
}

export {
    Activity
}