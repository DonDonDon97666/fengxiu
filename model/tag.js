import {Http} from "../utils/http";

class Tag{
    static SEARCH_TAG = 1

    static async getSearchTag(){
        const res = await Http.request({
            url:`tag/type/${Tag.SEARCH_TAG}`
        }) 
        return res.data
    }
}

export{
    Tag
}