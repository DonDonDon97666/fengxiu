import {Http} from "../utils/http";

class Theme{

    static locationA = 't-1';
    static locationE = 't-2';
    static locationF = 't-3';
    static locationH = 't-4';

    themes = [];

    getHomeLocationA(){
        return this.themes.find(theme => theme.name === Theme.locationA)
    }

    getHomeLocationE(){
        return this.themes.find(theme => theme.name === Theme.locationE)
    }

    getHomeLocationF(){
        return this.themes.find(theme => theme.name === Theme.locationF)
    }

    getHomeLocationH(){
        return this.themes.find(theme => theme.name === Theme.locationH)
    }

    async getHomeThemes(){
        const res = await Http.request({
            url : 'theme/by/names',
            data : {
                names : `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`
            }
        });
        this.themes = res.data;
    }

    static async getHomeSpuByName(name){
        const res = await Http.request({
            url:`theme/name/${name}/with_spu`
        });
        return res.data;
    }

    static async getHomeLocationESpu(){
        return await Theme.getHomeSpuByName(Theme.locationE);
    }
}

export {
    Theme
}