import{aQ as y,aR as E,a7 as f,a8 as m,a9 as w}from"./index-BR1x8YMF.js";import{t as h,e as I}from"./toDate-KnhkpVFB.js";function D(n,e,t){const r=h(n,t?.in);return r.setTime(r.getTime()+e*I),r}const v="http://localhost:3000/graphql",u=y.create({baseURL:v,headers:{"Content-Type":"application/json"}}),d={async getEvent(n){try{const e=`
      query Event($eventId: ID!) {
        event(eventId: $eventId) {
          id
          name
          description
          date
          startTime
          endTime
          ministry {
            id
            name
            createdUser
            createdDate
            active
          }
          ministryId
          location
          capacity
          createdUser
          createdUserId
          createdDate
          attendees {
            id
            disciple {
              id
              identification
              name
              lastName
              email
              phone
              address
              birthDate
              ministryId
              createdUser
              createdDate
              updatedUser
              updatedDate
            }
            discipleId
            dateRegister
          }
          createdAt
          updatedAt
          active
        }
      }
      `,{data:t}=await u.post(v,JSON.stringify({query:e,variables:{eventId:n}}));return t.data.event}catch(e){throw e instanceof E?(console.error(e.response?.data),new Error(JSON.stringify(e.response?.data)||"Error getting ministries")):(console.error(e),new Error("Error getting ministries"))}},async getEvents(){try{const n=`
      query GetEvents {
        events {
          id
          name
          description
          date
          startTime
          endTime
          location
          capacity
          createdUser
          createdDate
          createdAt
        }
      }
      `,{data:e}=await u.post(v,JSON.stringify({query:n}));return e.data.events}catch(n){throw n instanceof E?(console.error(n.response?.data),new Error(JSON.stringify(n.response?.data)||"Error getting ministries")):(console.error(n),new Error("Error getting ministries"))}},async createEvent(n){try{const e=`mutation CreateEvent($createEventInput: CreateEventInput!) {
        createEvent(createEventInput: $createEventInput) {
          id
        }
      }`,{data:t}=await u.post(v,JSON.stringify({query:e,variables:{createEventInput:{name:n.name,description:n.description,location:n.location,date:n.date,capacity:n.capacity,createdBy:n.createdBy}}}));return t.data.createEvent.id}catch(e){throw e instanceof E?(console.error(e.response?.data),new Error(JSON.stringify(e.response?.data)||"Error creating ministry")):(console.error(e),new Error("Error creating ministry"))}},async updateEvent(n){try{const e=`mutation UpdateEvent($event: EventInput!) {
        updateEvent(event: $event) {
          id
        }
      }`,{data:t}=await u.post(v,JSON.stringify({query:e,variables:{updateEventInput:n}}));return t.data.updateMinistry.id}catch(e){throw e instanceof E?(console.error(e.response?.data),new Error(JSON.stringify(e.response?.data)||"Error updating ministry")):(console.error(e),new Error("Error updating ministry"))}},async registerAttendance(n){try{const e=`mutation CreateEventAttendance($createEventAttendanceInput: CreateEventAttendanceInput!) {
        createEventAttendance(createEventAttendanceInput: $createEventAttendanceInput) {
          id
          dateRegister
        }
      }`,{data:t}=await u.post(v,JSON.stringify({query:e,variables:{createEventAttendanceInput:n}}));return t.data.createEventAttendance}catch(e){throw e instanceof E?(console.error(e.response?.data),new Error(JSON.stringify(e.response?.data)||"Error updating ministry")):(console.error(e),new Error("Error updating ministry"))}},async getEventAttendance(n){try{const e=`query EventAttendance($eventId: ID!) {
        eventAttendance(eventId: $eventId) {
          discipleId
          eventId
          timestamp
        }
      }`,{data:t}=await u.post(v,JSON.stringify({query:e,variables:{eventId:n}}));return t.data.ministries}catch(e){throw e instanceof E?(console.error(e.response?.data),new Error(JSON.stringify(e.response?.data)||"Error getting ministries")):(console.error(e),new Error("Error getting ministries"))}}},A=n=>{if(n.length===0)return;const e=new Date,r=n.filter(a=>new Date(a.date).getTime()<=e.getTime()).sort((a,o)=>new Date(o.date).getTime()-new Date(a.date).getTime());if(r.length===0){const a=n.filter(o=>new Date(o.date).toDateString()===e.toDateString());if(a.length>0)return a.sort((s,i)=>new Date(i.date).getTime()-new Date(s.date).getTime())[0]}return r[0]},T=(n,e,t)=>{const r=[],a=e.getTime()-n.getTime(),o=Math.floor(a/(1e3*60)),s=Math.floor(o/60);let i=n,c=t,l=15;s<2&&(i=new Date(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),0)),s>2&&(c=s*60/30,l=30),s>10&&(c=s,l=60),s>48&&(c=s/6,l=360);for(let g=0;g<c;g++){const p=D(i,l);r.push({start:i,end:p}),i=p}return r},J=(n,e=4)=>{if(n.length===0)return[];const t=n.sort((i,c)=>new Date(i.dateRegister).getTime()-new Date(c.dateRegister).getTime()),r=new Date(t[0].dateRegister),a=new Date(t[t.length-1].dateRegister),o=T(r,a,e),s=[];for(let i=0;i<o.length;i++){const c=o[i],l=n.filter(g=>{const p=new Date(g.dateRegister);return p.getTime()>=c.start.getTime()&&p.getTime()<c.end.getTime()});s.push({start:c.start,end:c.end,registers:l})}return s},O=(n,e)=>({event:void 0,lastEvent:void 0,events:[],attendances:[],isOpenModal:!1,getEvent:async t=>{const r=await d.getEvent(t);n({event:r})},getEvents:async()=>{const t=await d.getEvents();if(t){n({events:[...t]});const r=A(t);if(r&&(e().lastEvent===void 0||e().lastEvent?.id!==r.id)){const a=await d.getEvent(r.id);n({lastEvent:a})}else if(!r&&t.length>0&&(e().lastEvent===void 0||e().lastEvent?.id!==t[t.length-1].id)){const a=await d.getEvent(t[t.length-1].id);n({lastEvent:a})}}},addEvent:async t=>{const r=e().events;try{const a=await d.createEvent(t);return n({events:[...r,{...t,id:a}]}),!0}catch{return!1}},updateEvent:async t=>{const r=e().events;try{return await d.updateEvent(t),n({events:r.map(a=>a.id===t.id?{...t}:a)}),!0}catch{return!1}},registerAttendance:async t=>{const r=e().attendances;try{const a=await d.registerAttendance(t);return n({attendances:[...r,{id:a.id,eventId:t.eventId,discipleId:t.discipleId||"",event:t.event,disciple:t.disciple,registrationDate:new Date(a.registrationDate),attended:!1,attendanceDate:t.attendanceDate,notes:t.notes||""}],isOpenModal:!0}),!0}catch{return!1}},getEventAttendance:async t=>{try{const r=await d.getEventAttendance(t);return n({attendances:[...r]}),r}catch{return[]}},validateEventCapacity:async t=>{try{const r=e().events.find(o=>o.id===t);return!r||!r.capacity?!0:(await e().getEventAttendance(t)).length<r.capacity}catch{return!1}},toggleModal:()=>{const t=e().isOpenModal;n({isOpenModal:!t})}}),M=f()(m(w(O,{name:"event-storage"})));export{J as I,d as e,M as u};
