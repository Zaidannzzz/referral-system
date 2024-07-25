import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findReferrals: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('Happy Path', () => {
    it('findAll - should return an array of users', async () => {
      const result = [{ id: 1, username: 'testuser' }];
      mockUsersService.findAll.mockResolvedValue(result);

      expect(await usersController.findAll()).toBe(result);
    });

    it('findOne - should return a user by id', async () => {
      const result = { id: 1, username: 'testuser' };
      mockUsersService.findOne.mockResolvedValue(result);

      expect(await usersController.findOne(1)).toBe(result);
    });

    it('findReferrals - should return an array of referrals for a given user', async () => {
      const result = [{ id: 2, username: 'referral' }];
      mockUsersService.findReferrals.mockResolvedValue(result);

      expect(await usersController.findReferrals(1)).toBe(result);
    });
  });

  describe('Exception Path', () => {
    it('findOne - should throw a NotFoundException if user not found', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(usersController.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
