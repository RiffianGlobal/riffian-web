import http from '@lit-web3/base/http'
import { nowTs } from '@riffian-web/ethers/src/utils'

// const ip2geo = (ipv4: string) => {}
type APIRes = {
  ip: string
  geo?: string
}
export const API: Record<string, () => Promise<APIRes>> = {
  cloudflare: async () => {
    const res = await http.get(`https://www.cloudflare.com/cdn-cgi/trace?ts=${nowTs()}`)
    const [, ip, geo] = res.match(/ip=([0-9.]+)?.*?loc=([A-Z]+)?/s)
    return { ip, geo }
  }
  // pass through
  // jsonip: async () => {
  //   const { ip } = await http.get('https://jsonip.com')
  //   return { ip }
  // },
  // ipfy: async () => {
  //   const { ip } = await http.get('https://api.ipify.org/?format=json')
  //   return { ip }
  // }
}
/* Other free limited services
[https://api.hostip.info/get_json.php] (unlimited) but geo result is buggy
[https://api.ipapi.is] (1000/day)
[https://l2.io/ip.j] (unlimited) jsonp not supported

Below APIs not support https:
[http://ipinfo.io/json] (5000/month)
[http://ip-api.com/json] (45/minute)
[http://www.geoplugin.net/json.gp] (120/second)
*/

export const detect = async () => {
  const req = Object.values(API)
  const [res] = await Promise.all(req.map((r) => r()))
  return res
}

let promise: any
export const blocked = async () => {
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    let blocked = !!sessionStorage.getItem('blocked')
    if (blocked) return resolve(blocked)
    let geo
    try {
      geo = (await detect()).geo
    } catch {}
    if (geo) blocked = ['CN'].includes(geo)
    if (blocked) sessionStorage.setItem('blocked', '1')
    resolve(blocked)
  }))
}

export default detect
