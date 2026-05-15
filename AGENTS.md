# MCIM Project

## Tecnologías
- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: NestJS + GraphQL (`@nestjs/graphql`) + MongoDB (Mongoose)
- **UI**: shadcn/ui (Radix primitives + Tailwind CSS v4)
- **Formularios**: `react-hook-form` + `zod` + `@hookform/resolvers`
- **Estado**: Zustand con `persist` middleware (localStorage)
- **GraphQL Client**: Axios con queries/mutations manuales en strings
- **Internacionalización**: `react-i18next` (es.json, en.json en `assets/locales/`)
- **Calendario**: `react-day-picker` v9 + `date-fns`
- **Estilos**: Tailwind CSS v4 (`@import "tailwindcss"` en index.css)
- **Build**: `pnpm --filter app build` (`tsc && vite build`)

## Arquitectura del Proyecto

```
MCIM/
├── app/                          # Frontend
│   ├── components/ui/            # Componentes shadcn/ui reutilizables
│   ├── src/
│   │   ├── assets/locales/       # Traducciones i18n (es.json, en.json)
│   │   ├── app/stores/           # Store global (auth)
│   │   ├── dashboard/            # Layout principal (sidebar + header + router)
│   │   │   ├── pages/Dashboard.tsx      # Layout grid contenedor
│   │   │   ├── components/MenuMain.tsx  # Header sticky con avatar
│   │   │   ├── components/MenuMovil.tsx # Sidebar sticky
│   │   │   └── routes.tsx               # Rutas hijas del dashboard
│   │   └── {modulo}/             # Cada módulo sigue esta estructura:
│   │       ├── pages/            # Pantallas/páginas del módulo
│   │       ├── components/       # Componentes específicos del módulo
│   │       ├── schemas/          # Schemas Zod de validación
│   │       ├── services/         # Llamadas GraphQL con Axios
│   │       ├── store/            # Estado Zustand del módulo
│   │       ├── models/           # Interfaces TypeScript
│   │       └── routes.tsx        # Rutas del módulo
├── cells-back/                   # Backend
│   └── src/
│       └── {modulo}/
│           ├── entities/         # Entidades GraphQL (ObjectType)
│           ├── dto/              # DTOs de entrada (InputType con class-validator)
│           ├── services/         # Lógica de negocio
│           ├── resolvers/        # Resolvers GraphQL (queries + mutations)
│           └── {modulo}.module.ts # Módulo NestJS
```

## Cómo agregar un nuevo módulo/pantalla

### Frontend (app/src/{modulo}/)

1. **Modelos** (`models/`): Crear interfaces TypeScript con todos los campos
2. **Schema Zod** (`schemas/`): Crear schema de validación con `z.object()`. Usar i18n para mensajes de error. Para schemas con `t`, usar función factory: `export const createSchema = (t) => z.object({...})`
3. **Servicio** (`services/`): Clase con métodos estáticos. Cada método: query/mutation GraphQL en string, `api.post('', JSON.stringify({query, variables}))`, manejo de errores con `AxiosError`
4. **Store** (`store/`): Estado Zustand. Usar `StateCreator` + `create` con `devtools` y `persist`. Métodos async que llaman al servicio y actualizan estado
5. **Componentes/Páginas** (`pages/` o `components/`): Formularios con `useForm<InputType>()` + `zodResolver`. Cada formulario debe incluir:
   - Campos básicos del CRUD
   - Auditoría: `createdUser`, `createdDate`, `updatedUser`, `updatedDate`
   - Iconos en los labels de cada campo
   - Animaciones suaves con Tailwind (transition, hover, etc.)
   - NOTA: Los formularios en rutas públicas (`/public/*`) NO llevan campos de auditoría
6. **Rutas** (`routes.tsx`): Agregar las rutas del módulo, lazy-loaded con `React.lazy` y `Suspense`

### Backend (cells-back/src/{modulo}/)

1. **Entidad** (`entities/`): `@ObjectType()` con `@Field()` decorators. GraphQL ID para ids
2. **DTOs** (`dto/`): `@InputType()` con `class-validator` decorators (`@IsNotEmpty`, `@IsOptional`, `@IsEmail`, `@IsDate`, etc.)
3. **Servicio** (`services/`): Lógica de negocio con modelos Mongoose
4. **Resolver** (`resolvers/`): `@Resolver()` con `@Query()` y `@Mutation()`. Inyectar servicio por constructor
5. **Módulo** (`{modulo}.module.ts`): `@Module()` con imports de MongooseFeature, providers del servicio y resolver

## Validación de Formularios

### Frontend (Zod)
```typescript
// Schema con i18n
export const MySchema = z.object({
    name: z.string().min(2, { message: "El nombre es obligatorio" }),
    email: z.string().email("Email inválido").optional(),
    type: z.enum(["TYPE_A", "TYPE_B"], { error: "El tipo es obligatorio" }),
})
// Schema con función factory (cuando necesita t())
export const createMySchema = (t: (key: string) => string) => z.object({
    field: z.string().min(1, t("module.validation.fieldRequired")),
})

// En el formulario
const form = useForm<MyInput>({
    resolver: zodResolver(MySchema) as Resolver<MyInput>,
})
```

### Backend (class-validator)
```typescript
@InputType()
export class CreateMyInput {
    @Field()
    @IsNotEmpty({ message: 'Field is required' })
    name: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsEmail()
    email: string;
}
```

## Estado con Zustand

```typescript
import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MyState {
    items: MyType[];
    isSaving: boolean;
    fetchItems: () => Promise<void>;
    createItem: (data: MyType) => Promise<boolean>;
}

const store: StateCreator<MyState> = (set, get) => ({
    items: [],
    isSaving: false,
    fetchItems: async () => {
        const items = await MyService.getAll();
        set({ items });
    },
    createItem: async (data) => {
        set({ isSaving: true });
        try {
            await MyService.create(data);
            await get().fetchItems();
            set({ isSaving: false });
            return true;
        } catch {
            set({ isSaving: false });
            return false;
        }
    },
});

export const useMyStore = create<MyState>()(devtools(persist(store, { name: 'my-storage' })));
```

## Backend - GraphQL con NestJS

### Consultas y Mutaciones
```typescript
// Resolver
@Resolver(() => MyEntity)
export class MyResolver {
    constructor(private readonly service: MyService) {}

    @Query(() => [MyEntity], { name: 'myItems' })
    findAll() { return this.service.findAll(); }

    @Mutation(() => MyEntity)
    createMy(@Args('input') input: CreateMyInput) {
        return this.service.create(input);
    }
}
```

### Servicio con Mongoose
```typescript
@Injectable()
export class MyService {
    constructor(@InjectModel(MyEntity.name) private model: Model<MyEntity>) {}

    async create(input: CreateMyInput) {
        const created = new this.model(input);
        return created.save();
    }
}
```

## GraphQL en Frontend (Axios)
```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

static async getAll(): Promise<MyType[]> {
    const { data } = await api.post('', JSON.stringify({
        query: `query { myItems { id name } }`
    }));
    if (data.errors) throw new Error(data.errors[0]?.message);
    return data.data.myItems;
}
```

## Estructura de Rutas
- `app/src/routes.tsx` - Rutas raíz (login, register, public/*, /*)
- `app/src/public/routes.tsx` - Rutas públicas (register, eventPage, initial-information)
- `app/src/dashboard/routes.tsx` - Rutas protegidas del dashboard
- `app/src/{modulo}/routes.tsx` - Rutas específicas del módulo

## Convenciones de UI/UX

### Iconos en formularios
Cada `FormLabel` debe incluir un icono de `lucide-react` al lado del texto:
```tsx
<FormLabel className="flex items-center gap-1.5">
    <User className="h-3.5 w-3.5 text-muted-foreground" />
    Nombre
</FormLabel>
```

### Animaciones
- Usar clases de Tailwind para transiciones suaves: `transition-all`, `hover:scale-*`, `hover:opacity-*`
- Botones con `transition-colors`
- Formularios dentro de Cards con sombra suave (`shadow-sm`)
- Headers con `backdrop-blur` y `supports-[backdrop-filter]:bg-background/60`

### Diseño responsivo
- Layouts con `grid-cols-1 md:grid-cols-2` para formularios
- Sidebar: `hidden md:block`
- Padding responsivo: `p-4 lg:p-6`

## Auditoría en Formularios
- **Rutas protegidas** (dashboard): todos los formularios deben incluir `createdUser`, `createdDate`, `updatedUser`, `updatedDate`
- **Rutas públicas** (`/public/*`): NO incluir campos de auditoría
- Los campos se asignan automáticamente en el onSubmit:
```typescript
const data = {
    ...formData,
    createdUser: userState?.id || '',
    createdDate: new Date(),
    updatedUser: userState?.id || '',
    updatedDate: new Date(),
};
```

## Pruebas
- Solicitar al usuario al iniciar una tarea: "¿Ejecuto pruebas unitarias, E2E o ambas?"
- Por defecto, solo preguntar si hay cambios que lo requieran
- Las pruebas E2E se ejecutan con el comando correspondiente (definir según herramienta usada)

## Commits
- Cada cambio funcional debe tener su propio commit
- Mensajes descriptivos en español
- Prefijos sugeridos: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`
- Usar `git add -A` para cambios relacionados, commits atómicos

## Comandos Frontend
- `pnpm --filter app dev` - Servidor de desarrollo
- `pnpm --filter app build` - `tsc && vite build`
- `pnpm --filter app lint` - ESLint

## Key Directories (app/src)
- `disciples/` - Disciple CRUD
- `initial-information/` - Public initial registration form
- `ministries/` - Ministry management
- `cells/` - Cell groups
- `events/` - Events
- `formation-school/` - Formation school
- `components/ui/` - shadcn/ui components
- `assets/locales/` - i18n translations (es.json, en.json)

## Key Patterns
- Forms use `react-hook-form` + `zod` validation with icons in labels
- State management via Zustand stores with persist
- GraphQL via Axios (manual queries in services)
- Tab components from shadcn/ui (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`)
- Calendar/DatePicker from shadcn/ui (`Calendar` component with `react-day-picker`)
- All forms include audit fields except public routes
- Backend validation with `class-validator` decorators in DTOs
- Sidebar and Header use sticky positioning with backdrop blur
