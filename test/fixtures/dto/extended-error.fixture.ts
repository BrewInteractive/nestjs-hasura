import { ErrorExtensionsFixture } from './error-extensions.fixture';
import { Mock } from 'mockingbird';

export class ExtendedErrorFixture {
  @Mock((faker) => faker.lorem.sentence())
  message: string;
  @Mock()
  extensions?: ErrorExtensionsFixture;
}
