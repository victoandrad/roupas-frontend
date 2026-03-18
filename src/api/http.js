import axios from 'axios'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const parser = new XMLParser({
  ignoreAttributes: true,
  isArray: (name) => name === 'item',
})

const builder = new XMLBuilder({
  ignoreAttributes: true,
  suppressEmptyNode: true,
})

export function buildXml(rootName, data) {
  return builder.build({ [rootName]: data })
}

export function parseXmlResponse(xmlString) {
  if (!xmlString || typeof xmlString !== 'string' || !xmlString.trim().startsWith('<')) {
    return xmlString
  }

  const parsed = parser.parse(xmlString)
  const keys = Object.keys(parsed)
  if (keys.length === 0) return parsed

  let data = parsed[keys[0]]

  // Handle list responses: <List><item>...</item></List> or <ArrayList><item>...</item></ArrayList>
  if (data && typeof data === 'object' && !Array.isArray(data) && 'item' in data) {
    return Array.isArray(data.item) ? data.item : [data.item]
  }

  return data
}

export function ensureArray(data) {
  if (Array.isArray(data)) return data
  if (data === null || data === undefined || data === '') return []
  if (typeof data === 'object' && Object.keys(data).length === 0) return []
  return [data]
}

const http = axios.create({
  headers: {
    'Content-Type': 'application/xml',
    Accept: 'application/xml',
  },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data && typeof config.data === 'object' && config.xmlRoot) {
    config.data = buildXml(config.xmlRoot, config.data)
  }

  return config
})

http.interceptors.response.use(
  (response) => {
    response.data = parseXmlResponse(response.data)
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname
      if (path !== '/login' && path !== '/register') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default http
