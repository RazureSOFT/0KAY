import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs/promises'
import {validateManifest,within,packages} from '../src/installer.mjs'
test('all repository manifests validate',async()=>{for(const file of ['manifest.json','core/manifest.json','life/manifest.json','mocr/manifest.json','mcp/manifest.json','agent/manifest.json','webui/manifest.json']){const value=validateManifest(JSON.parse(await fs.readFile(new URL('../../'+file,import.meta.url),'utf8')));assert.ok(packages[value.name])}})
test('manifest paths and command shape are validated',()=>{assert.throws(()=>within(path.resolve('root'),'../outside'));assert.throws(()=>validateManifest({schema:1,name:'@razuresoft/x',version:'1',install:['npm install']}));assert.throws(()=>validateManifest({schema:2,name:'bad',version:'1'}))})
test('optional ui block shape is validated',()=>{
 assert.equal(validateManifest({schema:1,name:'@razuresoft/x',version:'1',install:[],ui:{dir:'plugin-web/demo',plugin:'demo',dist:'dist',build:[['npm','run','build']]}}).ui.plugin,'demo')
 assert.throws(()=>validateManifest({schema:1,name:'@razuresoft/x',version:'1',install:[],ui:'dist'}))
 assert.throws(()=>validateManifest({schema:1,name:'@razuresoft/x',version:'1',install:[],ui:{plugin:'../evil'}}))
 assert.throws(()=>validateManifest({schema:1,name:'@razuresoft/x',version:'1',install:[],ui:{build:'npm'}}))
})
