import {Page} from "../utils/page";

class Search{
    static search(q){
        return new Page({
            url:`search?q=${q}`
        })
    }
}

export{
    Search
}