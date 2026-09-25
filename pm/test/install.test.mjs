import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import {installPackage,publishPluginUI} from '../src/installer.mjs'
test('local install executes manifest and rejects overwrite',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'0kay-pm-test-'))
 try{
  const source=path.join(root,'source');await fs.mkdir(source)
  await fs.writeFile(path.join(source,'manifest.json'),JSON.stringify({schema:1,name:'@razuresoft/0kay',version:'test',install:[[process.execPath,'-e',"require('fs').writeFileSync('built.txt','ok')"]]}))
  const state={installed:{}};const record=await installPackage('@razuresoft/0kay',{home:path.join(root,'home'),source},state)
  assert.equal(await fs.readFile(path.join(record.repositoryRoot,'built.txt'),'utf8'),'ok')
  assert.equal((await installPackage('@razuresoft/0kay',{home:path.join(root,'home'),source},state)).version,'test')
 }finally{await fs.rm(root,{recursive:true,force:true})}
})
test('publishPluginUI copies dist into plugin-ui atomically',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'0kay-pm-ui-'))
 try{
  const dist=path.join(root,'dist');await fs.mkdir(path.join(dist,'assets'),{recursive:true})
  await fs.writeFile(path.join(dist,'index.js'),'export default {}')
  await fs.writeFile(path.join(dist,'assets','chunk-abc.js'),'//hash')
  const data=path.join(root,'data')
  const dest=await publishPluginUI(dist,'demo',data)
  assert.equal(dest,path.join(data,'plugin-ui','demo'))
  assert.ok((await fs.readFile(path.join(dest,'index.js'),'utf8')).includes('export default'))
  assert.ok((await fs.stat(path.join(dest,'assets','chunk-abc.js'))).isFile())
  await assert.rejects(()=>publishPluginUI(dist,'../evil',data))
 }finally{await fs.rm(root,{recursive:true,force:true})}
})
test('install with ui.build publishes plugin-ui',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'0kay-pm-uibuild-'))
 try{
  const source=path.join(root,'source');await fs.mkdir(source)
  await fs.writeFile(path.join(source,'manifest.json'),JSON.stringify({
   schema:1,name:'@razuresoft/0kay',version:'test',install:[],
   ui:{dir:'.',plugin:'demo',dist:'dist',build:[[process.execPath,'-e',"const fs=require('fs');fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.js','export default {}')"]]},
  }))
  const data=path.join(root,'data')
  const state={installed:{}}
  await installPackage('@razuresoft/0kay',{home:path.join(root,'home'),source,coreData:data},state)
  const published=path.join(data,'plugin-ui','demo','index.js')
  assert.match(await fs.readFile(published,'utf8'),/export default/)
 }finally{await fs.rm(root,{recursive:true,force:true})}
})
