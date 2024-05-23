import { HasuraConfigFixture } from '../test/fixtures';
import { HasuraModule } from './hasura.module';
import { HasuraService } from './hasura.service';
import { MockFactory } from 'mockingbird';
import { Test } from '@nestjs/testing';

describe('HasuraModule', () => {
  const hasuraConfig = MockFactory(HasuraConfigFixture).one();

  it('should be defined (with register method)', async () => {
    const module = await Test.createTestingModule({
      imports: [HasuraModule.register(hasuraConfig)],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
  });

  it('should be defined (with registerAsync method)', async () => {
    const module = await Test.createTestingModule({
      imports: [
        HasuraModule.registerAsync({
          useFactory: () => {
            return hasuraConfig;
          },
          inject: [],
        }),
      ],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
  });

  it('Should be defined (With forRoot method)', async () => {
    const module = await Test.createTestingModule({
      imports: [HasuraModule.forRoot(hasuraConfig)],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
  });

  it('should be defined (with forRootAsync method)', async () => {
    const module = await Test.createTestingModule({
      imports: [
        HasuraModule.forRootAsync({
          useFactory: () => {
            return hasuraConfig;
          },
          inject: [],
        }),
      ],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
  });
});
