import { Wykop } from './wykop'
import { Client } from './client'
import { testConfig, createTestClient } from './testUtils/testConfig'
import httpAdapter from 'axios/lib/adapters/http'

describe('wykop client', () => {
	let wykop: Wykop
	const noop = () => { }
	beforeEach(() => {
		wykop = createTestClient(testConfig)
		wykop.request = jest.fn().mockImplementation(() => new Promise(noop))
	})
	it('should call getUserKey on init', () => {
		const client = new Client(wykop, { username: 'test', accountkey: 'accountkey' })
		expect(wykop.request).toHaveBeenCalledTimes(1)
	})
	it('should not call getUserKey on init if userkey was provided', () => {
		const client = new Client(wykop, { username: 'test', accountkey: 'accountkey', userkey: 'any' })
		expect(wykop.request).toHaveBeenCalledTimes(0)
	})
	it('making request from client should call request on context with client userkey', () => {
		const client = new Client(wykop, { username: 'test', accountkey: 'accountkey', userkey: 'any' })
		client.request('a')
		expect(wykop.request).toBeCalledWith(expect.anything(), { namedParams: { userkey: 'any' } }, undefined)
	})
})
