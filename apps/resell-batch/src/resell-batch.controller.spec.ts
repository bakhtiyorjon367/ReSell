import { Test, TestingModule } from '@nestjs/testing';
import { ResellBatchController } from './resell-batch.controller';
import { ResellBatchService } from './resell-batch.service';

describe('ResellBatchController', () => {
  let resellBatchController: ResellBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ResellBatchController],
      providers: [ResellBatchService],
    }).compile();

    resellBatchController = app.get<ResellBatchController>(ResellBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(resellBatchController.getHello()).toBe('Hello World!');
    });
  });
});
