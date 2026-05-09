import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Disciple } from '../disciples/schemas/disciple.schema';
import { PasswordReset } from './schemas/password-reset.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Disciple.name) private discipleModel: Model<Disciple>,
    @InjectModel(PasswordReset.name) private passwordResetModel: Model<PasswordReset>,
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
          authProvider: 'google',
          createdAt: new Date(),
          lastLogin: new Date(),
          active: true,
        });
        await newUser.save();
        
        const jwt = this.jwtService.sign({
          userId: newUser.id,
          email: newUser.email,
          identification: newUser.identification,
          roles: newUser.roles,
        });

        return {
          accessToken: jwt,
          id: newUser._id,
          ...newUser.toObject(),
        };
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
    const userObject = user.toObject ? user.toObject() : user;
    const { password, ...userResult } = userObject;
    return {
      accessToken: this.jwtService.sign(payload),
      ...userResult,
      id: userObject._id ? userObject._id.toString() : userObject.id,
    };
  }

  async registerWithEmailAndPassword(userData: {
    email: string;
    password: string;
    identification: string;
    ministryId: string;
    phoneNumber: string;
    name?: string;
    lastName?: string;
  }) {
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

    let disciple = await this.discipleModel.findOne({ identification: userData.identification });
    
    if (disciple) {
      disciple.ministryId = userData.ministryId;
      if (userData.phoneNumber) {
        disciple.phone = userData.phoneNumber;
      }
      if (userData.name) {
        disciple.name = userData.name;
      }
      if (userData.lastName) {
        disciple.lastName = userData.lastName;
      }
      await disciple.save();
    } else {
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

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new this.userModel({
      email: userData.email,
      password: hashedPassword,
      identification: userData.identification,
      ministryId: disciple.ministryId,
      phoneNumber: disciple.phone,
      authProvider: 'email',
      createdAt: new Date(),
      lastLogin: new Date(),
      discipleId: disciple._id.toString(),
    });

    await user.save();
    const userObject = user.toObject();
    const { password, ...result } = userObject;
    result.id = userObject._id.toString();
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

    let disciple = await this.discipleModel.findOne({ identification: userData.identification });
    
    if (disciple) {
      disciple.ministryId = userData.ministryId;
      if (userData.phoneNumber) {
        disciple.phone = userData.phoneNumber;
      }
      await disciple.save();
    } else {
      disciple = new this.discipleModel({
        identification: userData.identification,
        name: '',
        lastName: '',
        phone: userData.phoneNumber,
        ministryId: userData.ministryId,
        createdUser: userData.id,
        createdDate: new Date(),
      });
      await disciple.save();
    }

    existingUser.identification = userData.identification;
    existingUser.ministryId = disciple.ministryId;
    existingUser.phoneNumber = disciple.phone;
    existingUser.discipleId = disciple._id.toString();

    await existingUser.save();
    return existingUser.toObject();
  }

  async validateAppleToken(appleData: {
    code: string;
    idToken?: string;
    email?: string;
    name?: string;
  }) {
    try {
      // En una implementación real, verificarías el token de Apple aquí
      // Por ahora, usamos el email proporcionado por Apple Sign-In
      const email = appleData.email;
      
      if (!email) {
        throw new Error('Email no proporcionado por Apple');
      }

      const existingUser = await this.userModel.findOne({ email });

      if (!existingUser) {
        // Extraer nombre del parámetro name si está disponible
        const nameParts = appleData.name ? appleData.name.split(' ') : [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const newUser = new this.userModel({
          email: email,
          displayName: appleData.name || '',
          authProvider: 'apple',
          createdAt: new Date(),
          lastLogin: new Date(),
          active: true,
        });
        await newUser.save();
        
        const jwt = this.jwtService.sign({
          userId: newUser.id,
          email: newUser.email,
          identification: newUser.identification,
          roles: newUser.roles,
        });

        return {
          accessToken: jwt,
          id: newUser._id,
          ...newUser.toObject(),
        };
      }

      if (
        existingUser.email === email &&
        existingUser.authProvider !== 'apple'
      ) {
        throw new UnauthorizedException(
          `Este correo ya está registrado usando ${existingUser.authProvider}`,
        );
      }

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
      Logger.error(error, 'AuthService - Apple Login');
      throw new Error('Invalid Apple token');
    }
  }

  async completeSocialRegistration(data: {
    userId: string;
    identification: string;
    ministryId: string;
    phoneNumber?: string;
    name?: string;
    lastName?: string;
  }) {
    let disciple = await this.discipleModel.findOne({ identification: data.identification });
    
    if (disciple) {
      disciple.ministryId = data.ministryId;
      if (data.phoneNumber) {
        disciple.phone = data.phoneNumber;
      }
      if (data.name) {
        disciple.name = data.name;
      }
      if (data.lastName) {
        disciple.lastName = data.lastName;
      }
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

    const jwt = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      identification: user.identification,
      roles: user.roles,
    });

    return {
      accessToken: jwt,
      id: user._id,
      ...user.toObject(),
    };
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return true;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await this.passwordResetModel.updateMany(
      { email, used: false },
      { used: true }
    );

    await new this.passwordResetModel({
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    }).save();

    Logger.log(`Código de recuperación para ${email}: ${code}`);
    
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
}
