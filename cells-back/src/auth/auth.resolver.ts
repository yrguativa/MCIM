import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserEntity } from './entities/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { SocialAuthInput } from './dto/social-auth.input';
import { LoginSocialInput } from './dto/login-social.input';
import { RegisterSocialLoginInput } from './dto/register-social-login';
import { LoginWithAppleInput } from './dto/login-with-apple.input';
import { CompleteSocialRegistrationInput } from './dto/complete-social-registration.input';
import { RequestPasswordResetInput } from './dto/request-password-reset.input';
import { VerifyResetCodeInput } from './dto/verify-reset-code.input';
import { ResetPasswordInput } from './dto/reset-password.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserEntity)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Mutation(() => UserEntity)
  async loginSocial(
    @Args('loginSocialInput') loginSocialInput: LoginSocialInput,
  ) {
    const user = await this.authService.validateGoogleToken(
      loginSocialInput.credential,
    );
    Logger.log('🚀 ~ AuthResolver ~ loginSocial ~ user:', user);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  @Mutation(() => UserEntity)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.registerWithEmailAndPassword(registerInput);
  }

  @Mutation(() => UserEntity)
  async registerSocialLogin(
    @Args('RegisterSocialLoginInput')
    registerSocialLoginInput: RegisterSocialLoginInput,
  ) {
    return this.authService.registerWithProvider(registerSocialLoginInput);
  }

  @Mutation(() => UserEntity)
  async loginWithApple(
    @Args('loginWithAppleInput') loginWithAppleInput: LoginWithAppleInput,
  ) {
    const user = await this.authService.validateAppleToken({
      code: loginWithAppleInput.code,
      idToken: loginWithAppleInput.idToken,
      email: loginWithAppleInput.email,
      name: loginWithAppleInput.name,
    });
    Logger.log('🚀 ~ AuthResolver ~ loginWithApple ~ user:', user);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  @Mutation(() => UserEntity)
  async completeSocialRegistration(
    @Args('completeSocialRegistrationInput')
    input: CompleteSocialRegistrationInput,
  ) {
    return this.authService.completeSocialRegistration({
      userId: input.userId,
      identification: input.identification,
      ministryId: input.ministryId,
      phoneNumber: input.phoneNumber,
      name: input.name,
      lastName: input.lastName,
    });
  }

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
  async resetPassword(@Args('resetPasswordInput') input: ResetPasswordInput) {
    return this.authService.resetPassword(
      input.email,
      input.code,
      input.newPassword,
    );
  }

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async me() {
    // Implementation for getting current user
  }
}
