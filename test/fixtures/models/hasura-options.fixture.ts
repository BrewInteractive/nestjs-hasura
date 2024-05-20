import { HasuraConfig } from '../../../src/models';
import { Mock } from 'mockingbird';

export class HasuraOptionsFixture extends HasuraConfig {
  @Mock((faker) => faker.internet.url())
  graphqlEndpoint: string;

  @Mock()
  adminSecret: string;
}
