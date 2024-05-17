import { HasuraModule } from './hasura.module';
import { HasuraOptionsFixture } from '../test/fixtures';
import { HasuraService } from './hasura.service';
import { MockFactory } from 'mockingbird';
import { Test } from '@nestjs/testing';

describe('HasuraModule', () => {
  const hasuraOptions = MockFactory(HasuraOptionsFixture).one();

  it('Should be defined (With register method)', async () => {
    const module = await Test.createTestingModule({
      imports: [HasuraModule.register(hasuraOptions)],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
  });

  it('Should be defined (With registerAsync method)', async () => {
    const module = await Test.createTestingModule({
      imports: [
        HasuraModule.registerAsync({
          useFactory: () => {
            return hasuraOptions;
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
      imports: [HasuraModule.forRoot(hasuraOptions)],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
  });

  it('Should be defined (With forRootAsync method)', async () => {
    const module = await Test.createTestingModule({
      imports: [
        HasuraModule.forRootAsync({
          useFactory: () => {
            return hasuraOptions;
          },
          inject: [],
        }),
      ],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
  });
});
