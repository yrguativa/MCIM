# MCIM - Documentación del Proyecto

## Tabla de Contenidos
1. [Tecnologías](#tecnologías)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Validaciones de Formularios (Frontend)](#validaciones-de-formularios-frontend)
4. [Rutas de Navegación](#rutas-de-navegación)
5. [Resolvers (Backend)](#resolvers-backend)
6. [Validaciones en Backend (GraphQL y Apollo)](#validaciones-en-backend-graphql-y-apollo)
7. [Modelos de MongoDB](#modelos-de-mongodb)
8. [Autenticación](#autenticación)
9. [Recuperación de Contraseña](#recuperación-de-contraseña)
10. [Enlace Usuario-Discípulo](#enlace-usuario-discípulo)
11. [Pruebas Unitarias](#pruebas-unitarias)

---

## Tecnologías

### Frontend
- **Framework:** React 19 con TypeScript
- **Build Tool:** Vite 7
- **Estado Global:** Zustand
- **Gestión de Datos:** TanStack React Query
- **Formularios:** React Hook Form + Zod + @hookform/resolvers
- **UI Components:** Radix UI + shadcn/ui
- **Estilos:** Tailwind CSS 4
- **Navegación:** React Router DOM 7
- **Internacionalización:** i18next + react-i18next
- **Autenticación Social:** Google OAuth (@react-oauth/google) + Apple Sign-In (react-apple-signin-auth)
- **QR:** qrcode.react, html5-qrcode, @zxing/library
- **Fechas:** date-fns, react-day-picker
- **Tablas:** TanStack React Table
- **Otros:** axios, canvas-confetti, d3, sonner (toasts)

### Backend
- **Framework:** NestJS 10
- **GraphQL:** @nestjs/graphql + Apollo Server
- **Base de Datos:** MongoDB (mongoose)
- **Autenticación:** Passport + JWT + google-auth-library
- **Validaciones:** class-validator + class-transformer
- **Social Auth:** Google OAuth + Apple Sign-In
- **QR:** qrcode
- **Testing:** Jest + @nestjs/testing

---

## Estructura del Proyecto

```
MCIM/
├── app/                          # Frontend (React)
│   ├── src/
│   │   ├── app/                  # Configuración global
│   │   │   ├── stores/           # Zustand stores
│   │   │   │   └── auth/         # Store de autenticación
│   │   │   └── utils/            # Utilidades
│   │   ├── assets/               # Recursos estáticos
│   │   │   └── locales/         # i18n (en.json, es.json)
│   │   ├── cells/                # Módulo de Células
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── disciples/            # Módulo de Discípulos
│   │   ├── events/              # Módulo de Eventos
│   │   ├── formation-school/     # Escuela de Formación
│   │   ├── ministries/          # Ministerios
│   │   ├── public/               # Rutas públicas
│   │   │   ├── components/      # Componentes públicos
│   │   │   ├── hooks/           # Hooks (loginHook)
│   │   │   ├── pages/            # Login, Register, ForgotPassword
│   │   │   ├── schemas/         # Zod schemas (login, register)
│   │   │   └── services/        # Auth services
│   │   ├── routes.tsx           # Rutas principales
│   │   └── main.tsx             # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── cells-back/                   # Backend (NestJS + GraphQL)
│   ├── src/
│   │   ├── auth/                # Módulo de autenticación
│   │   │   ├── dto/             # Inputs de GraphQL
│   │   │   ├── entities/        # Entidades GraphQL
│   │   │   ├── guards/          # JWT Auth Guard
│   │   │   ├── strategies/      # Passport strategies
│   │   │   ├── schemas/         # Schemas MongoDB
│   │   │   ├── auth.resolver.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── disciples/           # Módulo de Discípulos
│   │   ├── events/              # Módulo de Eventos
│   │   ├── cells/               # Módulo de Células
│   │   ├── ministries/          # Ministerios
│   │   ├── formation-school/    # Escuela de Formación
│   │   ├── users/              # Usuarios
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── package.json                  # Root (husky, commitlint)
```

---

## Validaciones de Formularios (Frontend)

### Estructura de un Schema Zod

Los schemas de validación se definen en la carpeta `schemas/` de cada módulo usando **Zod**.

```typescript
// app/src/disciples/schemas/discipleSchema.ts
import { z } from "zod"

export const DiscipleSchema = z.object({
    id: z.string()
        .min(1, { message: "El id es obligatorio." })
        .default(crypto.randomUUID()),
    identification: z.coerce
        .number({
            error: "La identificación no es un número valido.",
        })
        .optional()
        .refine((val) => val !== undefined, {
            message: "La identificación es obligatoria.",
        }),
    name: z.string()
        .min(2, { message: "Los nombres del discipulo es obligatorio." }),
    lastName: z.string()
        .min(2, { message: "Los apellidos del discipulo son obligatorios." }),
    number: z.coerce.number().optional(),
    address: z.string().min(5).optional(),
    email: z.string().min(5).email("El correo no es valido").optional(),
    birthday: z.date({ error: "La fecha de nacimiento es obligatoria." }).optional(),
    ministryId: z.string().min(2, { message: "El ministerio es obligatorio." }),
    network: z.string().optional(),
    status: z.string().optional(),
    createdUser: z.string().min(2),
    createdDate: z.date(),
})

export type DiscipleInput = z.infer<typeof DiscipleSchema>;
```

### Schema de Registro con Validaciones

```typescript
// app/src/public/schemas/registerSchema.ts
import { z } from "zod"

export const RegisterSchema = z.object({
    email: z.string()
        .min(1, "El correo electrónico es obligatorio")
        .email("El correo electrónico no es válido"),
    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string()
        .min(1, "Debe confirmar la contraseña"),
    identification: z.string()
        .min(1, "El número de identificación es obligatorio")
        .min(5, "La identificación debe tener al menos 5 dígitos")
        .max(20, "La identificación no puede tener más de 20 dígitos")
        .regex(/^[0-9]+$/, "La identificación solo debe contener números"),
    ministryId: z.string()
        .min(1, "El ministerio es obligatorio"),
    phoneNumber: z.string()
        .optional()
        .refine((val) => !val || /^[0-9]+$/.test(val), {
            message: "El número de teléfono solo debe contener números"
        }),
    name: z.string().optional(),
    lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export type RegisterInput = z.infer<typeof RegisterSchema>
```

### Uso en Formularios con React Hook Form

```typescript
// app/src/disciples/pages/discipleForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver } from "react-hook-form"
import { DiscipleInput, DiscipleSchema } from '../schemas/discipleSchema';

const DiscipleForm: React.FC = () => {
  const form = useForm<DiscipleInput>({
    resolver: zodResolver(DiscipleSchema) as Resolver<DiscipleInput>,
    defaultValues: {
      id: id || crypto.randomUUID(),
      createdUser: userState?.id || undefined,
      createdDate: new Date(),
    }
  });

  async function onSubmit(data: DiscipleInput) {
    // Enviar datos al servidor
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres</FormLabel>
              <FormControl>
                <Input placeholder="Andres Camilo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
};
```

### Validaciones Comunes en Zod

| Validación | Código |
|------------|--------|
| Obligatorio | `.min(1)` o `.refine()` |
| Email | `.email("mensaje")` |
| Número | `.number()` |
| Fecha | `.date()` |
| Longitud mínima | `.min(n)` |
| Longitud máxima | `.max(n)` |
| Opcional | `.optional()` |
| Valor por defecto | `.default(valor)` |
| Transformar tipo | `.coerce.number()` |
| Patrón regex | `.regex(/patron/)` |
| Validar coincide | `.refine((data) => data.password === data.confirmPassword)` |

---

## Rutas de Navegación

### Rutas Principales (GeneralRoutes)

```typescript
// app/src/routes.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./app/stores/auth/auth.store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const GeneralRoutes: React.FC = () => {
    return (
        <Routes>
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="public/*" element={<PublicRoutes />} />
        </Routes>
    );
};
```

### Rutas de Módulo (Sub-rutas)

```typescript
// app/src/events/routes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

const WeeklyCalendar = React.lazy(() => import('./pages/WeeklyCalendar'));
const CreateEvent = React.lazy(() => import('./pages/CreateEvent'));
const ScanQR = React.lazy(() => import('./pages/ScanQR'));

const EventsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WeeklyCalendar />} />
      <Route path="create" element={<CreateEvent />} />
      <Route path=":id" element={<CreateEvent />} />
      <Route path="scan" element={<ScanQR />} />
    </Routes>
  );
};

export default EventsRoutes;
```

---

## Resolvers (Backend)

### Estructura de un Resolver

```typescript
// cells-back/src/events/events.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { EventsService } from './events.service';
import { EventEntity } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';

@Resolver(() => EventEntity)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [EventEntity])
  async events(): Promise<EventEntity[]> {
    return this.eventsService.findAll();
  }

  @Mutation(() => EventEntity)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ): Promise<EventEntity> {
    return this.eventsService.create(createEventInput);
  }

  @ResolveField('attendees', () => [EventAttendanceEntity])
  async getAttendees(@Parent() event: EventEntity) {
    return this.eventsService.getEventAttendance(event.id);
  }
}
```

### Decoradores GraphQL

| Decorador | Descripción |
|-----------|-------------|
| `@Resolver()` | Define un resolver |
| `@Query()` | Consulta (GET) |
| `@Mutation()` | Mutación (POST/PUT/DELETE) |
| `@Args()` | Argumentos de entrada |
| `@Field()` | Campo en InputType/ObjectType |
| `@ResolveField()` | Campo resuelto dinámicamente |
| `@Parent()` | Acceso al objeto padre |
| `@UseGuards()` | Aplicar guards de autenticación |

---

## Validaciones en Backend (GraphQL y Apollo)

### DTOs con class-validator

```typescript
// cells-back/src/events/dto/create-event.input.ts
import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Min(3)
  @Max(100)
  name: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  capacity?: number;
}
```

### Validadores Disponibles (class-validator)

| Validador | Descripción |
|-----------|-------------|
| `@IsString()` | Verifica que sea string |
| `@IsNotEmpty()` | No puede estar vacío |
| `@IsEmail()` | Validar email |
| `@IsNumber()` | Verifica que sea número |
| `@IsDate()` | Verifica que sea fecha |
| `@IsBoolean()` | Verifica que sea booleano |
| `@IsOptional()` | Campo opcional |
| `@Min(n)` / `@Max(n)` | Valor mínimo/máximo |
| `@Length(min, max)` | Longitud exacta |
| `@IsEnum()` | Validar enum |
| `@IsArray()` | Verifica que sea array |
| `@Matches(regex)` | Coincide con regex |

### Habilitar Validaciones en main.ts

```typescript
// cells-back/src/main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

---

## Modelos de MongoDB

### Estructura de un Schema Mongoose

```typescript
// cells-back/src/events/schemas/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Ministry',
    required: false,
  })
  ministryId: string;

  @Prop({ default: true })
  active: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
```

### Opciones de Prop en Mongoose

| Opción | Descripción |
|--------|-------------|
| `type: String/Number/Date` | Tipo de dato |
| `required: true` | Campo obligatorio |
| `unique: true` | Índice único |
| `default: valor` | Valor por defecto |
| `ref: 'ModelName'` | Referencia a otro modelo |
| `type: [Schema]` | Array de sub-documentos |

---

## Autenticación

### Flujo de Autenticación

El sistema soporta tres métodos de autenticación:
1. **Email + Password** - Registro e inicio de sesión tradicional
2. **Google OAuth** - Inicio de sesión con Google
3. **Apple Sign-In** - Inicio de sesión con Apple

### Login con Google

```typescript
// cells-back/src/auth/auth.service.ts
async validateGoogleToken(credential: string) {
  const ticket = await this.googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  
  const existingUser = await this.userModel.findOne({ email: payload.email });
  
  if (!existingUser) {
    // Crear nuevo usuario
    const newUser = new this.userModel({
      email: payload.email,
      displayName: payload.name,
      photoURL: payload.picture,
      authProvider: 'google',
      createdAt: new Date(),
      lastLogin: new Date(),
      active: true,
    });
    await newUser.save();
    return newUser;
  }
  
  // Generar JWT
  const jwt = this.jwtService.sign({ userId: existingUser.id, email: existingUser.email });
  return { accessToken: jwt, id: existingUser._id, ...existingUser.toObject() };
}
```

### Login con Apple

```typescript
// cells-back/src/auth/dto/login-with-apple.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

@InputType()
export class LoginWithAppleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  code: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  idToken?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}
```

### Registro con Email

```typescript
// cells-back/src/auth/auth.service.ts
async registerWithEmailAndPassword(userData: {
  email: string;
  password: string;
  identification: string;
  ministryId: string;
  phoneNumber: string;
  name?: string;
  lastName?: string;
}) {
  // 1. Verificar si ya existe usuario
  const existingUser = await this.userModel.findOne({
    $or: [{ email: userData.email }, { identification: userData.identification }],
  });
  
  if (existingUser) {
    throw new UnauthorizedException('El correo o identificación ya está registrado');
  }
  
  // 2. Buscar o crear discípulo por identificación
  let disciple = await this.discipleModel.findOne({ identification: userData.identification });
  
  if (disciple) {
    // Actualizar datos del discípulo existente
    disciple.ministryId = userData.ministryId;
    if (userData.phoneNumber) disciple.phone = userData.phoneNumber;
    if (userData.name) disciple.name = userData.name;
    if (userData.lastName) disciple.lastName = userData.lastName;
    await disciple.save();
  } else {
    // Crear nuevo discípulo
    disciple = new this.discipleModel({
      identification: userData.identification,
      name: userData.name || '',
      lastName: userData.lastName || '',
      phone: userData.phoneNumber,
      ministryId: userData.ministryId,
      createdUser: '',
      createdDate: new Date(),
    });
    await disciple.save();
  }
  
  // 3. Crear usuario y enlazar con discípulo
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new this.userModel({
    email: userData.email,
    password: hashedPassword,
    identification: userData.identification,
    ministryId: disciple.ministryId,
    phoneNumber: disciple.phone,
    authProvider: 'email',
    discipleId: disciple._id.toString(),
    createdAt: new Date(),
    lastLogin: new Date(),
  });
  
  await user.save();
  return user;
}
```

### Schema de Usuario con discipleId

```typescript
// cells-back/src/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  identification: string;

  @Prop({ required: false })
  ministryId: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: true })
  authProvider: string; // 'email' | 'google' | 'apple'

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Disciple', required: false })
  discipleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### Datos Adicionales para Social Login

Cuando un usuario inicia sesión con Google/Apple y no tiene identificación ni ministry, debe completar un formulario:

```typescript
// app/src/public/components/LoginOtherData.tsx
const form = useForm<LoginOtherDataInput>({
  resolver: zodResolver(LoginOtherDataSchema),
  defaultValues: {
    identification: userState?.identification || "",
    ministryId: userState?.ministryId || "",
    phoneNumber: userState?.phoneNumber || "",
  }
});

// El componente usa Sheet de shadcn/ui para mostrar el formulario
// Al enviar, llama a updateUser que usa la mutación registerSocialLogin
```

### Mutación completeSocialRegistration

```typescript
// cells-back/src/auth/dto/complete-social-registration.input.ts
@InputType()
export class CompleteSocialRegistrationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Min(5)
  @Max(20)
  identification: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  ministryId: string;

  @Field({ nullable: true })
  @IsOptional()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;
}
```

---

## Recuperación de Contraseña

### Flujo de Recuperación

1. **Solicitar código**: Usuario ingresa email → Se genera código de 6 dígitos
2. **Verificar código**: Usuario ingresa código → Se valida
3. **Nueva contraseña**: Usuario ingresa nueva contraseña → Se actualiza

### Schema de PasswordReset

```typescript
// cells-back/src/auth/schemas/password-reset.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PasswordReset extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
```

### DTOs de Recuperación

```typescript
// Request password reset
@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsEmail()
  email: string;
}

// Verify reset code
@InputType()
export class VerifyResetCodeInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  code: string;
}

// Reset password
@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @Field()
  @IsString()
  @MinLength(6)
  code: string;
}
```

### Métodos del AuthService

```typescript
// cells-back/src/auth/auth.service.ts

async requestPasswordReset(email: string): Promise<boolean> {
  const user = await this.userModel.findOne({ email });
  if (!user) return true; // No revelar si el email existe

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Invalidar códigos anteriores
  await this.passwordResetModel.updateMany({ email, used: false }, { used: true });

  // Guardar nuevo código (expira en 15 minutos)
  await new this.passwordResetModel({
    email,
    code,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }).save();

  // TODO: Enviar email con el código
  console.log(`Código de recuperación para ${email}: ${code}`);
  return true;
}

async verifyResetCode(email: string, code: string): Promise<boolean> {
  const reset = await this.passwordResetModel.findOne({
    email,
    code,
    used: false,
    expiresAt: { $gt: new Date() },
  });
  return !!reset;
}

async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
  const reset = await this.passwordResetModel.findOne({
    email,
    code,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!reset) {
    throw new BadRequestException('Código inválido o expirado');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await this.userModel.updateOne({ email }, { password: hashedPassword });
  await this.passwordResetModel.updateOne({ _id: reset._id }, { used: true });

  return true;
}
```

### Mutaciones en AuthResolver

```typescript
// cells-back/src/auth/auth.resolver.ts

@Mutation(() => Boolean)
async requestPasswordReset(
  @Args('requestPasswordResetInput') input: RequestPasswordResetInput,
) {
  return this.authService.requestPasswordReset(input.email);
}

@Mutation(() => Boolean)
async verifyResetCode(
  @Args('verifyResetCodeInput') input: VerifyResetCodeInput,
) {
  return this.authService.verifyResetCode(input.email, input.code);
}

@Mutation(() => Boolean)
async resetPassword(
  @Args('resetPasswordInput') input: ResetPasswordInput,
) {
  return this.authService.resetPassword(input.email, input.code, input.newPassword);
}
```

---

## Enlace Usuario-Discípulo

### Flujo de Enlace

1. **Registro con Email**: Se busca discípulo por identificación, si existe se actualiza, si no se crea nuevo. El usuario se enlaza con el discípulo.
2. **Social Login**: Al completar datos adicionales (identification + ministry), se busca/crea discípulo y se enlaza con el usuario.
3. **Campo discipleId**: El usuario tiene un campo `discipleId` que referencia al discípulo en MongoDB.

### Implementación

```typescript
// cells-back/src/auth/auth.service.ts

async completeSocialRegistration(data: {
  userId: string;
  identification: string;
  ministryId: string;
  phoneNumber?: string;
  name?: string;
  lastName?: string;
}) {
  // 1. Buscar o crear discípulo
  let disciple = await this.discipleModel.findOne({ identification: data.identification });
  
  if (disciple) {
    disciple.ministryId = data.ministryId;
    if (data.phoneNumber) disciple.phone = data.phoneNumber;
    if (data.name) disciple.name = data.name;
    if (data.lastName) disciple.lastName = data.lastName;
    await disciple.save();
  } else {
    disciple = new this.discipleModel({
      identification: data.identification,
      name: data.name || '',
      lastName: data.lastName || '',
      phone: data.phoneNumber,
      ministryId: data.ministryId,
      createdUser: data.userId,
      createdDate: new Date(),
    });
    await disciple.save();
  }

  // 2. Actualizar usuario con discipleId
  const user = await this.userModel.findByIdAndUpdate(
    data.userId,
    {
      identification: data.identification,
      ministryId: disciple.ministryId,
      phoneNumber: disciple.phone,
      discipleId: disciple._id.toString(),
    },
    { new: true }
  );

  // 3. Generar JWT
  const jwt = this.jwtService.sign({ userId: user.id, email: user.email });
  return { accessToken: jwt, id: user._id, ...user.toObject() };
}
```

### Registro en AuthModule

```typescript
// cells-back/src/auth/auth.module.ts
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Disciple, DiscipleSchema } from '../disciples/schemas/disciple.schema';
import { PasswordReset, PasswordResetSchema } from './schemas/password-reset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Disciple.name, schema: DiscipleSchema },
      { name: PasswordReset.name, schema: PasswordResetSchema },
    ]),
    // ... Passport, JwtModule
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## Pruebas Unitarias

### Estructura de Tests con Jest

```typescript
// cells-back/src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Disciple } from '../disciples/schemas/disciple.schema';
import { PasswordReset } from './schemas/password-reset.schema';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserModel = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockDiscipleModel = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockPasswordResetModel = {
    updateMany: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Disciple.name), useValue: mockDiscipleModel },
        { provide: getModelToken(PasswordReset.name), useValue: mockPasswordResetModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        toObject: () => ({ email: 'test@example.com', _id: '1' }),
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should throw if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.validateUser('test@example.com', 'password'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestPasswordReset', () => {
    it('should return true even if email does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      
      const result = await service.requestPasswordReset('notfound@example.com');
      expect(result).toBe(true);
    });

    it('should generate and save reset code for existing user', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'test@example.com' });
      mockPasswordResetModel.updateMany.mockResolvedValue({});
      mockPasswordResetModel.save.mockResolvedValue({});
      
      const result = await service.requestPasswordReset('test@example.com');
      
      expect(result).toBe(true);
      expect(mockPasswordResetModel.save).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid code', async () => {
      const mockReset = {
        email: 'test@example.com',
        code: '123456',
        used: false,
        expiresAt: new Date(Date.now() + 60000),
        _id: 'resetId',
      };
      mockPasswordResetModel.findOne.mockResolvedValue(mockReset);
      mockUserModel.updateOne.mockResolvedValue({});
      mockPasswordResetModel.updateOne.mockResolvedValue({});
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword');

      const result = await service.resetPassword('test@example.com', '123456', 'newpassword');

      expect(result).toBe(true);
      expect(mockUserModel.updateOne).toHaveBeenCalled();
    });
  });

  describe('registerWithEmailAndPassword', () => {
    it('should create user with disciple', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockDiscipleModel.findOne.mockResolvedValue(null);
      mockDiscipleModel.save.mockResolvedValue({ _id: 'discipleId' });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.registerWithEmailAndPassword({
        email: 'new@example.com',
        password: 'password123',
        identification: '12345678',
        ministryId: 'ministry1',
        phoneNumber: '3001234567',
      });

      expect(result).toBeDefined();
      expect(result.email).toBe('new@example.com');
    });
  });

  describe('completeSocialRegistration', () => {
    it('should create disciple and link to user', async () => {
      mockDiscipleModel.findOne.mockResolvedValue(null);
      mockDiscipleModel.save.mockResolvedValue({ _id: 'newDiscipleId' });
      mockUserModel.findByIdAndUpdate.mockResolvedValue({
        _id: 'userId',
        email: 'test@example.com',
        toObject: () => ({ _id: 'userId', email: 'test@example.com' }),
      });

      const result = await service.completeSocialRegistration({
        userId: 'userId',
        identification: '12345678',
        ministryId: 'ministry1',
        phoneNumber: '3001234567',
        name: 'John',
        lastName: 'Doe',
      });

      expect(result).toBeDefined();
      expect(result.discipleId).toBe('newDiscipleId');
    });
  });
});
```

---

## Notas Adicionales

- Las validaciones del frontend (Zod) y backend (class-validator) deben ser consistentes
- Usar `React.lazy()` para cargar componentes de forma diferida
- Implementar guards de autenticación en endpoints sensibles
- Mantener los schemas de MongoDB con campos de auditoría (`createdUser`, `createdDate`, `updatedUser`, `updatedDate`)
- Para Apple Sign-In, configurar `VITE_APPLE_CLIENT_ID` y `VITE_APPLE_REDIRECT_URI` en el frontend
- La recuperación de contraseña requiere integración con servicio de email (nodemailer, sendgrid, etc.)
- Las pruebas unitarias deben cubrir los casos de éxito y error de cada método del servicio
