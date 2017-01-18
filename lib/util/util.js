export default {
    getParam(params){
        let result = '';
        for(let item in params){
            result += item + '=' + params[item] + '&';
        }

        result = result.substring(0, result.lastIndexOf('&'));

        return result;
    },
    getQueryString(name){
        var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));

        if(result == null || result.length < 1){

            return "";

        }

        return result[1];
    }
}
