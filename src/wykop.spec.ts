import { Wykop, namedParamsT } from "./wykop"
import { testConfig } from "./testUtils/testConfig"

describe('wykop class tests', ()=>{
    const client = new Wykop(testConfig)
    describe('namedParamsToString method', ()=>{
        it('should correct query path string', ()=>{
            const params: namedParamsT = {
                appkey: 'appkeyValue',
                secret: 'secretValue'
            }
            expect(Wykop.namedParamsToString(params)).toEqual('appkey/appkeyValue/secret/secretValue/');
        })
    })
})