import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        'Correo electrónico o contraseña incorrectos',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Correo electrónico o contraseña incorrectos',
      );
    }

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async validateGoogleToken(credential: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const existingUser = await this.userModel.findOne({
        email: payload.email,
      });

      if (!existingUser) {
        const newUser = new this.userModel({
          email: payload.email,
          displayName: payload.name,
          photoURL: payload.picture,
          // identification: payload.sub, // Google ID as identification
          // ministryId: '', // Set default or required value
          // phoneNumber: '', // Set default or required value
          authProvider: 'google',
          createdAt: new Date(),
          lastLogin: new Date(),
          active: true,
        });
        await newUser.save();
        return newUser.toObject();
      }

      if (
        existingUser.email === payload.email &&
        existingUser.authProvider !== 'google'
      ) {
        throw new UnauthorizedException(
          `Este correo ya está registrado usando ${existingUser.authProvider}`,
        );
      }

      // Generar JWT propio
      const jwt = this.jwtService.sign({
        userId: existingUser.id,
        email: existingUser.email,
        identification: existingUser.identification,
        roles: existingUser.roles,
      });

      return {
        accessToken: jwt,
        id: existingUser._id,
        ...existingUser.toObject(),
      };
    } catch (error) {
      Logger.error(error, 'AuthService');
      throw new Error('Invalid Google token');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async registerWithEmailAndPassword(userData: {
    email: string;
    password: string;
    identification: string;
    ministryId: string;
    phoneNumber: string;
  }) {
    // Verificar si ya existe un usuario con el mismo email o identificación
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: userData.email },
        { identification: userData.identification },
      ],
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new UnauthorizedException(
          'El correo electrónico ya está registrado',
        );
      }
      if (existingUser.identification === userData.identification) {
        throw new UnauthorizedException(
          'El número de identificación ya está registrado',
        );
      }
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
      authProvider: 'email',
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    await user.save();
    const { password, ...result } = user.toObject();
    return result;
  }

  async registerWithProvider(userData: {
    id: string;
    identification: string;
    ministryId: string;
    phoneNumber: string;
  }) {
    const existingUser = await this.userModel.findOne({ _id: userData.id });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    existingUser.identification = userData.identification;
    existingUser.ministryId = userData.ministryId;
    existingUser.phoneNumber = userData.phoneNumber;

    await existingUser.save();
    return existingUser.toObject();
  }
}
