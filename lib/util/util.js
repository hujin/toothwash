export default {
    getParam(params){
        let result = '';
        for(let item in params){
            result += item + '=' + params[item] + '&';
        }

        result = result.substring(0, result.lastIndexOf('&'));

        return result;
    }
}
