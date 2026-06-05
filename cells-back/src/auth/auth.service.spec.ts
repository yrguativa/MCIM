import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Disciple } from '../disciples/schemas/disciple.schema';
import { PasswordReset } from './schemas/password-reset.schema';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserSave = jest.fn().mockResolvedValue({});
  const mockUserModel: any = jest.fn().mockImplementation(() => ({
    save: mockUserSave,
    toObject: () => ({
      _id: 'userId',
      email: 'new@example.com',
      identification: '12345678',
    }),
  }));
  mockUserModel.findOne = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();
  mockUserModel.findById = jest.fn();
  mockUserModel.updateOne = jest.fn();

  const mockDiscipleSave = jest.fn().mockResolvedValue({ _id: 'discipleId' });
  const mockDiscipleModel: any = jest.fn().mockImplementation(() => ({
    _id: 'discipleId',
    identification: '12345678',
    ministryId: 'ministry1',
    phone: '3001234567',
    name: '',
    lastName: '',
    createdUser: '',
    createdDate: new Date(),
    save: mockDiscipleSave,
  }));
  mockDiscipleModel.findOne = jest.fn();

  const mockPasswordResetSave = jest.fn().mockResolvedValue({});
  const mockPasswordResetModel: any = jest.fn().mockImplementation(() => ({
    save: mockPasswordResetSave,
  }));
  mockPasswordResetModel.updateMany = jest.fn();
  mockPasswordResetModel.findOne = jest.fn();
  mockPasswordResetModel.updateOne = jest.fn();

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Disciple.name), useValue: mockDiscipleModel },
        {
          provide: getModelToken(PasswordReset.name),
          useValue: mockPasswordResetModel,
        },
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

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        toObject: () => ({ email: 'test@example.com', _id: '1' }),
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
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
      mockPasswordResetSave.mockResolvedValue({});

      const result = await service.requestPasswordReset('test@example.com');

      expect(result).toBe(true);
      expect(mockPasswordResetSave).toHaveBeenCalled();
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
      mockPasswordResetModel.findOne.mockResolvedValue(mockReset);

      const result = await service.verifyResetCode(
        'test@example.com',
        '123456',
      );
      expect(result).toBe(true);
    });

    it('should return false for invalid code', async () => {
      mockPasswordResetModel.findOne.mockResolvedValue(null);

      const result = await service.verifyResetCode(
        'test@example.com',
        '000000',
      );
      expect(result).toBe(false);
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

      const result = await service.resetPassword(
        'test@example.com',
        '123456',
        'newpassword',
      );

      expect(result).toBe(true);
      expect(mockUserModel.updateOne).toHaveBeenCalled();
    });

    it('should throw for invalid code', async () => {
      mockPasswordResetModel.findOne.mockResolvedValue(null);

      await expect(
        service.resetPassword('test@example.com', '000000', 'newpassword'),
      ).rejects.toThrow();
    });
  });

  describe('registerWithEmailAndPassword', () => {
    it('should create user with disciple', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockDiscipleModel.findOne.mockResolvedValue(null);
      mockDiscipleSave.mockResolvedValue({ _id: 'discipleId' });
      mockUserModel.findOne.mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      mockJwtService.sign.mockReturnValue('jwtToken');

      const userData = {
        email: 'new@example.com',
        password: 'password123',
        identification: '12345678',
        ministryId: 'ministry1',
        phoneNumber: '3001234567',
      };

      const result = await service.registerWithEmailAndPassword(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe('new@example.com');
    });

    it('should throw if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({
        email: 'existing@example.com',
      });

      await expect(
        service.registerWithEmailAndPassword({
          email: 'existing@example.com',
          password: 'password',
          identification: '123',
          ministryId: '1',
          phoneNumber: '123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('completeSocialRegistration', () => {
    it('should create disciple and link to user', async () => {
      mockDiscipleModel.findOne.mockResolvedValue(null);
      mockDiscipleSave.mockResolvedValue({ _id: 'newDiscipleId' });
      mockUserModel.findByIdAndUpdate.mockResolvedValue({
        _id: 'userId',
        discipleId: 'newDiscipleId',
        email: 'test@example.com',
        toObject: () => ({ _id: 'userId', discipleId: 'newDiscipleId', email: 'test@example.com' }),
      });
      mockJwtService.sign.mockReturnValue('jwtToken');

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
