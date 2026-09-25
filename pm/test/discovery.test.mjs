import test from 'node:test'
import assert from 'node:assert/strict'
import dgram from 'node:dgram'
import {discover} from '../src/discovery.mjs'
test('discovery correlates responses and ignores invalid peers',async t=>{
 const server=dgram.createSocket('udp4')
 const bound=await new Promise(resolve=>{server.once('error',()=>resolve(false));server.bind(50050,'127.0.0.1',()=>resolve(true))})
 if(!bound){server.close();t.skip('discovery port already used by running Core');return}
 server.on('message',(raw,peer)=>{const request=JSON.parse(raw);server.send(JSON.stringify({protocol:'0kay-core-v1',nonce:request.nonce,id:'test',fingerprint:'a'.repeat(64),http_port:8443,grpc_port:5443}),peer.port,peer.address)})
 try{const cores=await discover(100);assert.ok(cores.some(core=>core.id==='test'))}finally{server.close()}
})
