import{i as a,a7 as t,a8 as i,a9 as n}from"./index-mP2OZFed.js";/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M12 13V7",key:"h0r20n"}],["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}],["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}]],f=a("book-up",C),p=(c,d)=>({Cells:[{id:crypto.randomUUID(),leader:"678c06ec353c49781ac13d26",host:"Andres Lopez",neighborhood:1,network:1,address:"Calle 123",createdUser:"678c06ec353c49781ac13d26",createdDate:new Date,records:[]}],getCell:e=>d().Cells.find(l=>l.id===e),addCell:e=>c(l=>({...l,Cells:[...l.Cells,{...e,records:[]}]})),updateCell:e=>{const l=d().Cells.find(s=>s.id===e.id),o=d().Cells.filter(s=>s.id!==e.id);c(s=>({...s,Cells:[...o,{...e,records:l?.records||[]}]}))},addRecord:(e,l)=>{const o=d().Cells.find(r=>r.id===e);o!==void 0&&o.records===void 0&&(o.records=[]),o?.records.push(l);const s=d().Cells.filter(r=>r.id!==e);s.push(o),c(r=>({...r,Cells:s}))}}),k=t()(i(n(p,{name:"cell-storage"})));export{f as B,k as u};
