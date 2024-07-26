import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchases.dto';
import { Purchase } from './purchases.entity';
import { NotFoundException } from '@nestjs/common';

describe('PurchasesController', () => {
  let purchasesController: PurchasesController;
  let purchasesService: PurchasesService;

  const mockPurchasesService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [
        {
          provide: PurchasesService,
          useValue: mockPurchasesService,
        },
      ],
    }).compile();

    purchasesController = module.get<PurchasesController>(PurchasesController);
    purchasesService = module.get<PurchasesService>(PurchasesService);
  });

  describe('Happy Path', () => {
    it('Create - should create a purchase', async () => {
      const createPurchaseDto: CreatePurchaseDto = { userId: 1, amount: 100 };
      const result: Purchase = { id: 1, ...createPurchaseDto } as Purchase;
      mockPurchasesService.create.mockResolvedValue(result);

      expect(await purchasesController.create(createPurchaseDto)).toBe(result);
    });

    it('findAll - should return an array of purchases', async () => {
      const result = [{ id: 1, userId: 1, amount: 100 }] as Purchase[];
      mockPurchasesService.findAll.mockResolvedValue(result);

      expect(await purchasesController.findAll()).toBe(result);
    });
  });

  describe('Exception Path', () => {
    it('Create - should throw NotFoundException if user not found', async () => {
      const createPurchaseDto: CreatePurchaseDto = { userId: 1, amount: 100 };
      mockPurchasesService.create.mockRejectedValue(new NotFoundException());

      await expect(
        purchasesController.create(createPurchaseDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
