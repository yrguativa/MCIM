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

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async me() {
    // Implementation for getting current user
  }
}
