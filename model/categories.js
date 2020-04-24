/**
 * @作者 吴延昭
 * @创建时间 2020/3/29 13:02
 */
import {Http} from "../utils/http";

class Categories {
    roots = []
    subs = []

    async getAll() {
        const res = await Http.request({
            url: `category/all`
        })

        this.roots = res.data.roots
        this.subs = res.data.subs
    }

    getRoots() {
        return this.roots
    }

    getRoot(rootID) {
        return this.roots.find(r => r.id == rootID)
    }

    getSubs(parentID) {
        return this.subs.filter(sub => sub.parent_id == parentID)
    }
}

export {
    Categories
}