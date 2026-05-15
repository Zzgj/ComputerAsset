import { describe, expect, it } from 'vitest'

import { HttpError } from '../src/utils/httpError'

describe('HttpError', () => {
  it('exposes statusCode/code/details', () => {
    const e = new HttpError(409, 'conflict', { code: 'X', details: { foo: 1 } })
    expect(e.statusCode).toBe(409)
    expect(e.code).toBe('X')
    expect(e.details).toEqual({ foo: 1 })
    expect(e.message).toBe('conflict')
  })
  it('static factories preset statusCode', () => {
    expect(HttpError.badRequest('').statusCode).toBe(400)
    expect(HttpError.unauthorized('').statusCode).toBe(401)
    expect(HttpError.forbidden('').statusCode).toBe(403)
    expect(HttpError.notFound('').statusCode).toBe(404)
    expect(HttpError.conflict('').statusCode).toBe(409)
  })
  it('is an instance of Error', () => {
    const e = HttpError.badRequest('boom')
    expect(e).toBeInstanceOf(Error)
    expect(e.name).toBe('HttpError')
  })
})
