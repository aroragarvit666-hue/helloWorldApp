jest.mock('@adobe/aio-sdk', () => ({
  Core: { Logger: jest.fn(() => ({ info: jest.fn(), debug: jest.fn(), error: jest.fn() })) }
}))
const { Core } = require('@adobe/aio-sdk')
const { main } = require('../actions/hello/index.js')

describe('hello', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 200 with default greeting when no name given', async () => {
    const res = await main({})
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Hello, World!')
  })

  it('returns 200 with a personalized greeting', async () => {
    const res = await main({ name: 'Ada' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Hello, Ada!')
  })

  it('reads the IMS token from headers without failing', async () => {
    const res = await main({
      name: 'Ada',
      __ow_headers: { authorization: 'Bearer test-token' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Hello, Ada!')
  })

  it('returns 500 when logging inside the handler throws unexpectedly', async () => {
    Core.Logger.mockReturnValueOnce({
      info: jest.fn(() => { throw new Error('boom') }),
      debug: jest.fn(),
      error: jest.fn(),
    })
    const res = await main({ name: 'Ada' })
    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe('boom')
  })
})
