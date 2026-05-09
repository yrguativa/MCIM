# Plan de Ejecución — Initial Information Form

## Estado del Proyecto

### Backend (cells-back/src/initial-information/)

| # | Archivo | Estado |
|---|---|---|
| 1 | `schemas/assistant.schema.ts` | ✅ Completado |
| 2 | `schemas/assistant-personal-info.schema.ts` | ✅ Completado |
| 3 | `entities/assistant.entity.ts` | ✅ Completado |
| 4 | `entities/assistant-personal-info.entity.ts` | ✅ Completado |
| 5 | `entities/assistant-full.entity.ts` | ✅ Completado |
| 6 | `entities/leader.entity.ts` | ✅ Completado |
| 7 | `dto/create-assistant.input.ts` | ✅ Completado |
| 8 | `dto/update-assistant.input.ts` | ✅ Completado |
| 9 | `dto/create-assistant-personal-info.input.ts` | ✅ Completado |
| 10 | `dto/update-assistant-personal-info.input.ts` | ✅ Completado |
| 11 | `initial-information.module.ts` | ✅ Completado |
| 12 | `initial-information.resolver.ts` | ✅ Completado |
| 13 | `initial-information.service.ts` | ✅ Completado |
| 14 | `cells-back/src/app.module.ts` (modificado) | ✅ Completado |

### Frontend (app/src/initial-information/)

| # | Archivo | Estado |
|---|---|---|
| 15 | `store/initialInformation.store.ts` | ✅ Completado |
| 16 | `schemas/initialInformationSchema.ts` | ✅ Completado |
| 17 | `services/initialInformation.services.ts` | ✅ Completado |
| 18 | `components/AssistantSearch.tsx` | ✅ Completado |
| 19 | `components/BasicInfoCard.tsx` | ✅ Completado |
| 20 | `components/PersonalInfoCard.tsx` | ✅ Completado |
| 21 | `components/ChurchInfoCard.tsx` | ✅ Completado |
| 22 | `pages/InitialInformationForm.tsx` | ✅ Completado |
| 23 | `app/src/public/routes.tsx` (modificado) | ✅ Completado |
| 24 | `app/src/assets/locales/es.json` (modificado) | ✅ Completado |
| 25 | `app/src/assets/locales/en.json` (modificado) | ✅ Completado |

### Dependencias adicionales

| # | Acción | Estado |
|---|---|---|
| 26 | `@radix-ui/react-radio-group` instalado | ✅ Completado |
| 27 | `app/components/ui/radio-group.tsx` creado | ✅ Completado |

### Verificación

| # | Comando | Estado |
|---|---|---|
| 28 | Backend: `pnpm --filter cells-back run build` | ✅ Pass |
| 29 | Frontend: `pnpm --filter app run lint` | ✅ Pass |

---

## Arquitectura General

### Colecciones MongoDB

**`Assistant`** — Información básica (+ relación recursiva `directLeaderId`)

| Campo | Tipo | Requerido | Único |
|---|---|---|---|
| `names` | String | sí | no |
| `lastNames` | String | sí | no |
| `email` | String | no | no |
| `phone` | String | sí | no |
| `identificationType` | String (enum) | sí | no |
| `identification` | String | sí | **sí** |
| `directLeaderId` | String (ref: Assistant) | no | no |
| `createdAt` | Date | auto | no |
| `updatedAt` | Date | auto | no |

**`AssistantPersonalInfo`** — Información personal

| Campo | Tipo | Requerido | Condicional |
|---|---|---|---|
| `assistantId` | ObjectId (ref) | sí | no |
| `nationality` | String (enum) | sí | no |
| `gender` | String (enum) | sí | no |
| `maritalStatus` | String (enum) | no | no |
| `hasChildren` | String (YES/NO) | sí | no |
| `childrenAttendChurch` | String (YES/NO) | no | hasChildren=YES |
| `address` | String | sí | no |
| `housingComplex` | String | no | no |
| `neighborhood` | String | sí | no |
| `municipality` | String (enum) | sí | no |
| `network` | String (enum) | sí | no |
| `birthDate` | Date | sí | no |
| `ministryId` | String | sí | no |
| `yearArrivedAtChurch` | String | sí | no |
| `hasAttendedEncounter` | String (YES/NO) | sí | no |
| `yearAttendedEncounter` | String | no | hasAttendedEncounter=YES |
| `hasRepeatedEncounter` | String (YES/NO) | no | hasAttendedEncounter=YES |
| `hasAttendedReencounter` | String (YES/NO) | sí | no |
| `yearAttendedReencounter` | String | no | hasAttendedReencounter=YES |
| `baptizedAtMCI` | String (YES/NO) | sí | no |
| `isLeader` | String (YES/NO) | no | no |
| `generation` | String (enum) | sí | no |
| `formationSchoolLevel` | String (enum) | sí | no |
| `createdAt` | Date | auto | no |
| `updatedAt` | Date | auto | no |

### Flujo del Formulario

```
┌─────────────────────────────────────────────────────────┐
│  Paso 1: Búsqueda por identificación                    │
│  → Input + botón "Buscar"                              │
│  → store.searchAssistant()                             │
│  → Si existe → mode='update', pre-llenar formulario    │
│  → Si no existe → mode='create', formulario vacío      │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Paso 2: Formulario (3 Cards)                           │
│                                                         │
│  BasicInfoCard: names, lastNames, email, phone,         │
│    identificationType (Select), identification (readonly│
│    si mode=update)                                      │
│                                                         │
│  PersonalInfoCard: nationality, gender, maritalStatus,  │
│    hasChildren (RadioGroup), childrenAttendChurch (cond),│
│    address, housingComplex, neighborhood, municipality, │
│    network, birthDate                                   │
│                                                         │
│  ChurchInfoCard: ministry (Select desde DB),            │
│    directLeader (Command+Popover autocomplete),         │
│    yearArrivedAtChurch, hasAttendedEncounter (cond),    │
│    yearAttendedEncounter (cond), hasRepeatedEncounter   │
│    (cond), hasAttendedReencounter (cond),              │
│    yearAttendedReencounter (cond), baptizedAtMCI,       │
│    isLeader, generation, formationSchoolLevel           │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Submit:                                                │
│  mode='create' → store.createAssistant(data)            │
│  mode='update' → store.updateAssistant(id, data)        │
│  → Success → toast + resetForm                          │
│  → Error → toast + mensaje de error                    │
└─────────────────────────────────────────────────────────┘
```

### Rutas

- **URL pública**: `/#/public/initial-information`
- Backend GraphQL: **sin `@UseGuards(JwtAuthGuard)`** — consultas públicas

### Condicionales (Zod superRefine + UI con watch)

| Pregunta | Si = YES | Si = NO |
|---|---|---|
| ¿Tiene hijos? | Muestra: childrenAttendChurch | Oculta campo |
| ¿Ha asistido a encuentro? | Muestra: yearAttendedEncounter + hasRepeatedEncounter | Oculta ambos |
| ¿Ha asistido a reencuentro? | Muestra: yearAttendedReencounter | Oculta campo |

### Estado (Zustand)

- Store: `useInitialInformationStore` con `devtools()` (sin persist)
- Maneja: búsqueda, modo (idle/create/update), CRUD, líderes, errores

### Traducciones (i18n)

- Sección `initialInformation` agregada en `es.json` y `en.json`
- Claves: search, basicInfo, personalInfo, churchInfo, identificationType, nationality, gender, maritalStatus, municipality, network, generation, formationSchoolLevel, validation, messages, actions

### GraphQL API endpoints

| Operación | Tipo | Input |
|---|---|---|
| `assistantByIdentification(identification: String!)` | Query | string |
| `assistantLeaders` | Query | none |
| `createAssistant(createAssistantInput, createPersonalInfoInput)` | Mutation | 2 inputs |
| `updateAssistant(updateAssistantInput, updatePersonalInfoInput)` | Mutation | 2 inputs |

### Patrones usados

| Concepto | Referencia |
|---|---|
| Store Zustand | `ministries/store/ministries.store.ts` |
| Service axios | `ministries/services/ministries.services.ts` |
| Zod schema | `disciples/schemas/discipleSchema.ts` |
| shadcn Form + Select | `cells/pages/cellForm.tsx` |
| shadcn Command + Popover | `cells/pages/cellForm.tsx` (neighborhood) |
| Ruta pública lazy | `public/routes.tsx` (EventRegister) |
| Resolver público (sin auth) | Nuevo — sin @UseGuards |
