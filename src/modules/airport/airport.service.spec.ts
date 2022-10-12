import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from '../../shared/services/airport.service';

describe('AirportService', () => {
  let service: AirportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
