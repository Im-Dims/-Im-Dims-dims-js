const axios = require('axios')
const FormData = require('form-data')
const parse = require('file-type').fromBuffer
const cheerio = require('cheerio')
const Func = new (require('./functions'))

module.exports = class Scraper {
   uploader = (i, extension, time = 60) => new Promise(async resolve => {
      try {
         if (!Buffer.isBuffer(i) && !Func.isUrl(i)) return resolve({
            creator: global.creator,
            status: false,
            msg: 'only buffer and url formats are allowed'
         })
         const file = Buffer.isBuffer(i) ? i : Func.isUrl(i) ? await (await axios.get(i, {
            responseType: 'arraybuffer'
         })).data : null
         const parse = await axios.get('https://tmpfiles.org')
         const cookie = parse.headers['set-cookie'].join('; ')
         const token = cheerio.load(parse.data)('input[name="_token"]').attr('value')
         try {
            var { ext } = await parse(file)
         } catch (e) {
            var ext = 'txt'
         }
         let form = new FormData
         form.append('_token', token)
         form.append('file', Buffer.from(file), Func.makeId(10) + '.' + (extension || ext))
         form.append('max_views', 0)
         form.append('max_time', time)
         form.append('upload', 'Upload')
         const html = await (await axios.post('https://tmpfiles.org', form, {
            headers: {
               cookie,
               ...form.getHeaders()
            }
         })).data
         const $ = cheerio.load(html)
         const component = []
         $('td').each((i, e) => component.push($(e).text()))
         if (!component[2]) return resolve({
            creator: global.creator,
            status: false,
            msg: `upload failed`
         })
         resolve({
            creator: global.creator,
            status: true,
            data: {
               filename: component[0],
               size: component[1],
               expired: component[3],
               url: component[2]
            }
         })
      } catch (e) {
         resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
   
   telegraph = i => new Promise(async (resolve, reject) => {
      try {
         if (!Buffer.isBuffer(i) && !Func.isUrl(i)) return resolve({
            creator: global.creator,
            status: false,
            msg: 'only buffer and url formats are allowed'
         })
         const file = Buffer.isBuffer(i) ? i : Func.isUrl(i) ? await (await axios.get(i, {
            responseType: 'arraybuffer'
         })).data : null
         try {
            var { ext } = await parse(file)
         } catch (e) {
            var ext = 'jpg'
         }
         let form = new FormData
         form.append('file', Buffer.from(file), 'image.' + ext)
         const json = await (await axios.post('https://telegra.ph/upload', form, {
            headers: {
               "Accept": "*/*",
               "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
               "Origin": "https://telegra.ph",
               "Referer": "https://telegra.ph",
               "Referrer-Policy": "strict-origin-when-cross-origin",
               "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
               "sec-ch-ua-platform": "Android",
               "sec-fetch-dest": "empty",
               "sec-fetch-mode": "cors",
               "sec-fetch-site": "same-origin",
               "x-requested-with": "XMLHttpRequest",
               ...form.getHeaders()
            }
         })).data
         if (!json || json.length < 1) return resolve({
            creator: global.creator,
            status: false,
            msg: 'Failed to upload!'
         })
         resolve({
            creator: global.creator,
            status: true,
            data: {
               url: 'https://telegra.ph' + json[0].src
            }
         })
      } catch (e) {
         resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
   
   uploadImage = i => new Promise(async (resolve, reject) => {
      try {
         if (!Buffer.isBuffer(i) && !Func.isUrl(i)) return resolve({
            creator: global.creator,
            status: false,
            msg: 'only buffer and url formats are allowed'
         })
         const parse = await (await axios.get('https://imgbb.com', {
            headers: {
               "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36"
            }
         }))
         const token = parse.data.match(/PF\.obj\.config\.auth_token="([^"]*)/)[1]
         const cookie = parse.headers['set-cookie'].join(', ')
         const file = Buffer.isBuffer(i) ? i : Func.isUrl(i) ? await (await axios.get(i, {
            responseType: 'arraybuffer'
         })).data : null
         try {
            var { ext } = await parse(file)
         } catch (e) {
            var ext = 'jpg'
         }
         let form = new FormData
         form.append('source', Buffer.from(file), 'image.' + ext)
         form.append('type', 'file')
         form.append('action', 'upload')
         form.append('timestamp', (new Date() * 1))
         form.append('auth_token', token)
         const json = await (await axios.post('https://imgbb.com/json', form, {
            headers: {
               "Accept": "*/*",
               "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
               "Origin": "https://imgbb.com",
               "Referer": "https://imgbb.com/upload",
               "Referrer-Policy": "strict-origin-when-cross-origin",
               cookie,
               ...form.getHeaders()
            }
         })).data
         if (json.status_code != 200) return resolve({
            creator: global.creator,
            status: false,
            msg: `Failed to Upload!`
         })
         resolve({
            creator: global.creator,
            status: true,
            original: json,
            data: {
               url: json.image.display_url
            }
         })
      } catch (e) {
         resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
   
   shorten = async (url) => {
      let isurl = /https?:\/\//.test(url)
      return isurl ? (await require('axios').get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))).data : ''
   }
}