# Plan de Ejecución: Autenticación y Localización

## Resumen de Tareas

| # | Tarea | Tipo | Prioridad |
|---|-------|------|-----------|
| 1 | Traducir páginas de login y register | Frontend | Alta |
| 2 | Agregar inicio de sesión con Apple | Frontend/Backend | Alta |
| 3 | Quitar login con GitHub | Frontend | Alta |
| 4 | Agregar formulario de datos adicionales para Google/Apple | Frontend | Alta |
| 5 | Enlazar usuario con discípulo al registrar datos adicionales | Backend | Alta |
| 6 | Mejorar registro con email y password (mismos campos) | Frontend/Backend | Alta |
| 7 | Agregar recuperación de contraseña por código | Frontend/Backend | Alta |
| 8 | Agregar pruebas unitarias | Testing | Media |

---

## Fase 1: Traducciones

### 1.1 Actualizar archivos de localización

**Archivos a modificar:**
- `app/src/assets/locales/es.json`
- `app/src/assets/locales/en.json`

**Agregar keys de autenticación:**

```json
// es.json - agregar en "auth"
"auth": {
    "login": "Iniciar sesión",
    "logout": "Cerrar sesión",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "register": "Registrarse",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "createAccount": "Crear una cuenta",
    "alreadyHaveAccount": "¿Ya tienes una cuenta?",
    "signInWith": "O continúa con",
    "loginWithGoogle": "Iniciar sesión con Google",
    "loginWithApple": "Iniciar sesión con Apple",
    "loginWithEmail": "Iniciar sesión con correo",
    "additionalData": "Datos adicionales",
    "additionalDataDescription": "Ingresa los datos adicionales para completar tu registro",
    "identification": "Número de identificación",
    "ministry": "Ministerio",
    "phone": "Número de teléfono",
    "optional": "(Opcional)",
    "saveChanges": "Guardar cambios",
    "close": "Cerrar",
    "recoverPassword": "Recuperar contraseña",
    "recoverPasswordDescription": "Ingresa tu correo electrónico para recibir un código de recuperación",
    "sendCode": "Enviar código",
    "verifyCode": "Verificar código",
    "enterNewPassword": "Ingresa tu nueva contraseña",
    "resetPassword": "Restablecer contraseña",
    "codeSent": "Código enviado",
    "codeSentDescription": "Hemos enviado un código a tu correo electrónico",
    "invalidCode": "Código inválido",
    "passwordResetSuccess": "Contraseña restablecida",
    "passwordResetSuccessDescription": "Tu contraseña ha sido restablecida correctamente"
}

// en.json - agregar en "auth"
"auth": {
    "login": "Login",
    "logout": "Logout",
    "email": "Email",
    "password": "Password",
    "register": "Sign up",
    "forgotPassword": "Forgot your password?",
    "createAccount": "Create an account",
    "alreadyHaveAccount": "Already have an account?",
    "signInWith": "Or continue with",
    "loginWithGoogle": "Login with Google",
    "loginWithApple": "Login with Apple",
    "loginWithEmail": "Login with email",
    "additionalData": "Additional data",
    "additionalDataDescription": "Enter additional data to complete your registration",
    "identification": "Identification number",
    "ministry": "Ministry",
    "phone": "Phone number",
    "optional": "(Optional)",
    "saveChanges": "Save changes",
    "close": "Close",
    "recoverPassword": "Recover password",
    "recoverPasswordDescription": "Enter your email to receive a recovery code",
    "sendCode": "Send code",
    "verifyCode": "Verify code",
    "enterNewPassword": "Enter your new password",
    "resetPassword": "Reset password",
    "codeSent": "Code sent",
    "codeSentDescription": "We have sent a code to your email",
    "invalidCode": "Invalid code",
    "passwordResetSuccess": "Password reset",
    "passwordResetSuccessDescription": "Your password has been reset successfully"
}
```

### Commit: `feat: add authentication translations to i18n files`

---

## Fase 2: Modificaciones en Login

### 2.1 Quitar GitHub del Login

**Archivo:** `app/src/public/pages/Login.tsx`

- Eliminar botón de GitHub (líneas 91-99)
- Actualizar textos a/i18n

### 2.2 Agregar Apple Login

**Dependencias necesarias:**
```bash
# En app/
pnpm add react-apple-signin-auth
```

**Archivo:** `app/src/public/hooks/loginHook.ts`

- Descomentar función `handleAppleLogin`
- Agregar integración con `AppleID.auth.init()`
- Actualizar store para incluir `loginWithApple`

### 2.3 Actualizar textos del Login usando i18n

**Archivo:** `app/src/public/pages/Login.tsx`

```tsx
import { useTranslation } from 'react-i18next';

// Dentro del componente
const { t } = useTranslation();

// Reemplazar textos:
// "Login to your account" -> {t('auth.login')}
// "Enter your email below to login to your account" -> {t('auth.loginDescription')}
// "Email" -> {t('auth.email')}
// "Password" -> {t('auth.password')}
// "Forgot your password?" -> {t('auth.forgotPassword')}
// "Login" -> {t('auth.login')}
// "Or continue with" -> {t('auth.signInWith')}
// "Login with github" -> {t('auth.loginWithGoogle')}
// "Don't have an account?" -> {t('auth.alreadyHaveAccount')}
// "Sign up" -> {t('auth.register')}
```

### Commit: `feat: remove github login and add apple login with i18n`

---

## Fase 3: Modificaciones en Registro

### 3.1 Actualizar formulario de registro

**Archivo:** `app/src/public/pages/Register.tsx`

- Convertir a usar React Hook Form + Zod (como discipleForm)
- Agregar ministerios dinámicos desde el store
- Agregar validación completa con mensajes de i18n

### 3.2 Traducir Register

- Convertir todos los textos a usar i18n

### Commit: `feat: update register form with form validation and i18n`

---

## Fase 4: Datos Adicionales (Google/Apple)

### 4.1 Actualizar LoginOtherData

**Archivo:** `app/src/public/components/LoginOtherData.tsx`

- Agregar textos a/i18n
- Hacer teléfono opcional
- Mejorar UX del componente

### 4.2 Actualizar lógica de login con Google

**Archivo:** `app/src/public/hooks/loginHook.ts`

- Modificar `handleGoogleLogin` para:
  - Si no tiene identification y ministryId -> abrir sheet
  - Si tiene datos -> redirigir a dashboard
  - Los datos de Google/Apple deben crear un discípulo enlazado

### Commit: `feat: add additional data form for social login`

---

## Fase 5: Backend - Enlace Usuario-Discípulo

### 5.1 Modificar Schema de Usuario

**Archivo:** `cells-back/src/auth/schemas/user.schema.ts`

```typescript
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Disciple', required: false })
discipleId: string;
```

### 5.2 Agregar campo discipleId al User Entity

**Archivo:** `cells-back/src/auth/entities/user.entity.ts`

```typescript
@Field(() => String, { nullable: true })
discipleId?: string;
```

### 5.3 Crear Mutation para registrar datos sociales + discípulo

**Archivo:** `cells-back/src/auth/auth.resolver.ts`

```typescript
@Mutation(() => UserEntity)
async completeSocialRegistration(
  @Args('completeSocialRegistrationInput') input: CompleteSocialRegistrationInput,
) {
  return this.authService.completeSocialRegistration(input);
}
```

**Nuevo archivo:** `cells-back/src/auth/dto/complete-social-registration.input.ts`

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';

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
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  // Datos del discípulo
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;
}
```

### 5.4 Modificar AuthService

**Archivo:** `cells-back/src/auth/auth.service.ts`

```typescript
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
  
  if (!disciple) {
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
  const user = await this.userModel.findByIdAnd.userId,
    {
      identification: data.identification,
Update(
    data      ministryId: data.ministryId,
      phoneNumber: data.phoneNumber,
      discipleId: disciple._id,
    },
    { new: true }
  );

  return user;
}
```

### 5.5 Importar DiscipleModel en AuthModule

**Archivo:** `cells-back/src/auth/auth.module.ts`

```typescript
import { MongooseModule } from '@nestjs/mongoose';
import { Disciple, DiscipleSchema } from '../disciples/schemas/disciple.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disciple.name, schema: DiscipleSchema },
    ]),
  ],
  // ...
})
export class AuthModule {}
```

### Commit: `feat: link user with disciple after social login registration`

---

## Fase 6: Recuperación de Contraseña

### 6.1 Agregar schema para recuperación

**Nuevo archivo:** `cells-back/src/auth/schemas/password-reset.schema.ts`

```typescript
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

### 6.2 Crear DTOs para recuperación

**Nuevo archivo:** `cells-back/src/auth/dto/request-password-reset.input.ts`

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsEmail()
  email: string;
}
```

**Nuevo archivo:** `cells-back/src/auth/dto/verify-reset-code.input.ts`

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

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
```

**Nuevo archivo:** `cells-back/src/auth/dto/reset-password.input.ts`

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
```

### 6.3 Agregar métodos al AuthService

**Archivo:** `cells-back/src/auth/auth.service.ts`

```typescript
import { PasswordReset } from './schemas/password-reset.schema';

@InjectModel(PasswordReset.name) private passwordResetModel: Model<PasswordReset>;

async requestPasswordReset(email: string): Promise<boolean> {
  const user = await this.userModel.findOne({ email });
  if (!user) {
    // No revelar si el email existe
    return true;
  }

  // Generar código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Guardar código (invalidar anteriores)
  await this.passwordResetModel.updateMany(
    { email, used: false },
    { used: true }
  );

  await new this.passwordResetModel({
    email,
    code,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
  }).save();

  // TODO: Enviar email con el código
  // await this.emailService.sendPasswordResetCode(email, code);
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

async resetPassword(email: string, newPassword: string): Promise<boolean> {
  const reset = await this.passwordResetModel.findOne({
    email,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!reset) {
    throw new UnauthorizedException('Código inválido o expirado');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await this.userModel.updateOne(
    { email },
    { password: hashedPassword }
  );

  await this.passwordResetModel.updateOne(
    { _id: reset._id },
    { used: true }
  );

  return true;
}
```

### 6.4 Agregar mutations al AuthResolver

**Archivo:** `cells-back/src/auth/auth.resolver.ts`

```typescript
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
  return this.authService.resetPassword(input.email, input.newPassword);
}
```

### 6.5 Crear página de recuperación de contraseña

**Nuevo archivo:** `app/src/public/pages/ForgotPassword.tsx`

Estados:
1. **Solicitar código:** Input de email
2. **Verificar código:** Input de código de 6 dígitos
3. **Nueva contraseña:** Input de nueva contraseña

### Commit: `feat: add password recovery with email code`

---

## Fase 7: Mejoras en Registro con Email

### 7.1 Actualizar RegisterInput DTO

**Archivo:** `cells-back/src/auth/dto/register.input.ts`

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

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
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  // Datos del discípulo
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;
}
```

### 7.2 Modificar registerWithEmailAndPassword

**Archivo:** `cells-back/src/auth/auth.service.ts`

- Crear discípulo automáticamente al registrar usuario con email
- Enlazar discipleId al usuario

### Commit: `feat: create disciple on email registration`

---

## Fase 8: Pruebas Unitarias

### 8.1 Auth Service Tests

**Archivo:** `cells-back/src/auth/auth.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserModel = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
    });

    it('should throw if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      
      await expect(service.validateUser('test@example.com', 'password'))
        .rejects.toThrow();
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
      
      const result = await service.requestPasswordReset('test@example.com');
      expect(result).toBe(true);
    });
  });

  describe('verifyResetCode', () => {
    it('should return true for valid code', async () => {
      const mockReset = {
        email: 'test@example.com',
        code: '123456',
        used: false,
        expiresAt: new Date(Date.now() + 60000),
      };
      
      // Mock implementation needed
    });
  });
});
```

### 8.2 Auth Resolver Tests

**Archivo:** `cells-back/src/auth/auth.resolver.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    registerWithEmailAndPassword: jest.fn(),
    requestPasswordReset: jest.fn(),
    verifyResetCode: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.validateUser and login', async () => {
      mockAuthService.validateUser.mockResolvedValue({ id: '1', email: 'test@example.com' });
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      const result = await resolver.login({ email: 'test@example.com', password: 'password' });
      expect(result).toBeDefined();
    });
  });
});
```

### Commit: `feat: add unit tests for auth service and resolver`

---

## Resumen de Commits

| # | Commit Message |
|---|----------------|
| 1 | `feat: add authentication translations to i18n files` |
| 2 | `feat: remove github login and add apple login with i18n` |
| 3 | `feat: update register form with form validation and i18n` |
| 4 | `feat: add additional data form for social login` |
| 5 | `feat: link user with disciple after social login registration` |
| 6 | `feat: add password recovery with email code` |
| 7 | `feat: create disciple on email registration` |
| 8 | `feat: add unit tests for auth service and resolver` |

---

## Notas Adicionales

1. **Apple Sign-In**: Requiere configuración en Apple Developer Portal y variables de entorno
2. **Email**: Implementar servicio de email (nodemailer, sendgrid, etc.) para enviar códigos
3. **Validaciones**: Mantener consistencia entre Zod (frontend) y class-validator (backend)
4. **UX**: Mostrar mensajes claros durante todo el flujo de autenticación
5. **Seguridad**: 
   - Códigos de recuperación con expiración
   - Limitar intentos de código
   - Hash de contraseñas con bcrypt
