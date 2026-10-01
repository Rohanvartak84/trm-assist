import {test} from 'node:test';import assert from 'node:assert/strict';import {retrieve,textFromItems} from '../public/search.mjs';
const docs=[{chip:'CHIP',type:'TRM',revisions:['A','B'],texts:['UART_CTRL enable bit 0']},{chip:'CHIP',type:'Errata',revisions:['A'],texts:['UART first byte erratum']},{chip:'OTHER',revisions:['A'],texts:['UART enable']},{chip:'CHIP',revisions:[],texts:['UART unknown revision']}];
test('revision B excludes A-only errata and other chips',()=>{const r=retrieve(docs,'UART','CHIP','B');assert.equal(r.length,2);assert.ok(!r.some(x=>x.doc.type==='Errata'));assert.ok(r.some(x=>x.unknownRevision))});
test('revision A surfaces errata candidates',()=>assert.ok(retrieve(docs,'UART','CHIP','A').some(x=>x.doc.type==='Errata')));
test('absent facts and stopwords return no evidence',()=>{assert.deepEqual(retrieve(docs,'voltage','CHIP','A'),[]);assert.deepEqual(retrieve(docs,'what is the','CHIP','A'),[])});
test('unknown selected revision does not claim applicability',()=>assert.ok(retrieve(docs,'UART','CHIP','').every(x=>x.unknownRevision)));
test('PDF line boundaries retained',()=>assert.equal(textFromItems([{str:'Bit',transform:[1,0,0,1,0,30]},{str:'Name',transform:[1,0,0,1,50,30],hasEOL:true},{str:'0 EN',transform:[1,0,0,1,0,20]}]),'Bit Name\n0 EN'));
