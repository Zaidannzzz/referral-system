import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/users.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('Happy Path', () => {
    it('Register - should register a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
      };
      const result: User = { id: 1, ...createUserDto } as User;
      mockAuthService.register.mockResolvedValue(result);

      expect(await authController.register(createUserDto)).toBe(result);
    });

    it('Login - should return an access token', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const result = { access_token: 'token' };
      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(loginDto)).toBe(result);
    });
  });

  describe('Exception Path', () => {
    it('Register - should throw UnauthorizedException if user already registered', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
      };
      mockAuthService.register.mockRejectedValue(new UnauthorizedException());

      await expect(authController.register(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Login - should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };
      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
