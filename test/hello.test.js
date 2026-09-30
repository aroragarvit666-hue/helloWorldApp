jest.mock('@adobe/aio-sdk', () => ({
  Core: { Logger: jest.fn(() => ({ info: jest.fn(), debug: jest.fn(), error: jest.fn() })) }
}))
const { Core } = require('@adobe/aio-sdk')
const { main } = require('../actions/hello/index.js')

describe('hello', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 200 with a default greeting when no name is given', async () => {
    const res = await main({})
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Hello, World!')
  })

  it('returns 200 greeting the provided name', async () => {
    const res = await main({ name: 'Ada' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Hello, Ada!')
  })

  it('returns 500 when the logger throws unexpectedly', async () => {
    Core.Logger.mockImplementationOnce(() => { throw new Error('boom') })
    const res = await main({ name: 'Ada' })
    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe('boom')
  })
})
