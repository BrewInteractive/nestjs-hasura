import { HasuraOptions } from '../../../src/models';
import { Mock } from 'mockingbird';

export class HasuraOptionsFixture extends HasuraOptions {
  @Mock((faker) => faker.internet.url())
  endpoint: string;

  @Mock()
  adminSecret: string;
}
