/**
 * @作者 吴延昭
 * @创建时间 2020/3/6 14:20
 */
import {Http} from "./http";

class Page{
    req
    start
    count
    isLocked = false
    url
    hasMoreData = true
    accumulator = []

    constructor(req, count=10, start=0){
        this.req = req;
        this.start = start;
        this.count = count;
        this.url = req.url
    }

    /**
     * 获取下一页数据
     */
    async getMoreData(){
        if(!this.hasMoreData){
            return
        }
        if(this._isLocked()){
            return;
        }
        const page = await this._realGetData();
        this._unLock();
        return page
    }

    /*
    根据页数判断是否有更多数据
     */
    _hasMoreData(totalPage, page){
        return page < totalPage-1
    }

    /**
     * 真正请求数据
     */
    async _realGetData(){
        const req = this._getRealReq();
        const res = await Http.request(req);
        if(!res){
            return null
        }
        if(res.data.total === 0){
            return {
                hasMoreData : false,
                items:[],
                calculateItems:[],
                empty:true
            }
        }

        this.hasMoreData = this._hasMoreData(res.data.total_page, res.data.page)
        if(this.hasMoreData){
            this.start +=this.count
        }

        this.accumulator = this.accumulator.concat(res.data.items)

        return {
            hasMoreData : this.hasMoreData,
            items : res.data.items,
            calculateItems: this.accumulator,
            empty:false
        }
    }

    /*
    获取请求，拼接请求url和count、start参数
     */
    _getRealReq(){
        let url = this.url
        if(url.includes('?')){
            url = url.concat(`&start=${this.start}&count=${this.count}`);
        }
        else{
            url = url.concat(`?start=${this.start}&count=${this.count}`);
        }
        this.req.url = url;
        return this.req;
    }

    /*
    判断是否有未返回的请求
     */
    _isLocked(){
        if(this.isLocked){
            return true;
        }
        this.isLocked = true;
        return false;
    }

    /**
     * 解锁
     */
    _unLock(){
        this.isLocked = false;
    }
}

export {
    Page
}