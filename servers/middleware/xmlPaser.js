const xml = require('./../ulits/xmlTool')

module.exports = async (ctx, next) => {
        if (ctx.method == 'POST' && ctx.is('text/xml')) {
            let promise = new Promise(function (resolve, reject) {
                let buf = ''
                ctx.req.setEncoding('utf8')
                ctx.req.on('data', (chunk) => {
                    buf += chunk
                })
                ctx.req.on('end', () => {
                    xml.xmlToJson(buf)
                        .then(resolve)
                        .catch(reject)
                })
            })

            await promise.then((result) => {
                    var _data = { xml: _toObect(result.xml) };
                    ctx.body = _data;
                })
                .catch((e) => {
                    e.status = 400
                })

            next()
        } else {
            await next()
        }
    }


    function _toObect(obj){
        _obj = {};
        if(obj){

            for(let key in obj){
                if(obj[key] && Array.isArray(obj[key])){
                    _obj[key] = obj[key][0]||{};
                }
            }


        }
        return _obj;
    }