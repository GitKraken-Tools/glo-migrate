import { browser } from '$app/env'

export const getCookie = (cookiesDB: string, name: string) => {
  if (!cookiesDB) { return null }
  const cookies = cookiesDB.split('; ').map(i => { return { name: i.split('=')[0], value: i.split('=')[1] } })
  return cookies.find(i => i.name === name)?.value || null
}

export const clearCookie = () => {
  if (browser) {
    var cookies = document.cookie.split('; ')
    for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split('.')
      while (d.length > 0) {
        var cookieBase = encodeURIComponent(cookies[c].split(';')[0].split('=')[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path='
        var p = location.pathname.split('/')
        document.cookie = cookieBase + '/'
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/')
          p.pop()
        }
        d.shift()
      }
    }
  }
}