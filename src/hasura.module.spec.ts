import { Test, TestingModule } from '@nestjs/testing';

import { HasuraModule } from './hasura.module';

describe('HasuraModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HasuraModule],
    }).compile();
  });

  it('Should be defined', () => {
    const service = module.get<HasuraModule>(HasuraModule);
    expect(service).toBeDefined();
  });
});
