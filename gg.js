const axios = require('axios');


async function v(){
const url = 'https://www.instagram.com/reel/CuhJ1FdA_qK/?igshid=MzRlODBiNWFlZA=='
const data = await instagramdlv4(url)
console.log(data)
}v()






async function instagramdlv4(url) {
    return new Promise(async (resolve) => {
         try {
            let json = await (await axios.post("https://saveig.app/api/ajaxSearch", require('querystring').stringify({ q: url, t: "media", lang: "en" }), {
               headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Accept-Encoding': 'gzip, deflate, br',
                  'Origin': 'https://saveig.app/en',
                  'Referer': 'https://saveig.app/en',
                  'Referrer-Policy': 'strict-origin-when-cross-origin',
                  'User-Agent': 'PostmanRuntime/7.31.1'
               }
            })).data
            let $ = cheerio.load(json.data)
            let data = []
            $('div[class="download-items__btn"]').each((i, e) => data.push({ type: $(e).find('a').attr('href').match('.jpg') ? 'image' : 'video', url: $(e).find('a').attr('href') }))
            if (!data.length) return resolve({
               status: false
            }) 
            resolve({
               status: true,
               data
            })
         } catch (e) {
            console.log(e)
            return resolve({
               status: false,
               msg: e.message
            })
         }
      })
}