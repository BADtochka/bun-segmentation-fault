import { type Request } from 'express'

const getRequestCookie = (req: Request, name: string) => {
  const value = req.cookies[name]
  if (!value) return null
  return value
}

export default getRequestCookie
