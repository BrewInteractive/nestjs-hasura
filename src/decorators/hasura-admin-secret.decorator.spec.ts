import { Faker } from 'mockingbird';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { HasuraAdminSecret } from './hasura-admin-secret.decorator';

function getParamDecoratorFactory() {
  class TestDecorator {
    public getDecoratorValue(@HasuraAdminSecret() value) {
      console.log(value);
    }
  }

  const args = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestDecorator,
    'getDecoratorValue',
  );
  return args[Object.keys(args)[0]].factory;
}

describe('HasuraAdminSecret Decorator', () => {
  it('should return the hasura admin secret header', () => {
    const hasuraAdminSecret = Faker.datatype.string();
    const mockRequest = {
      headers: {
        'x-hasura-admin-secret': hasuraAdminSecret,
      },
    };

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    const factory = getParamDecoratorFactory();
    const resultHasuraAdminSecret = factory(
      'x-hasura-admin-secret',
      mockContext,
    );

    expect(resultHasuraAdminSecret).toBe(hasuraAdminSecret);
  });

  it('should return undefined if no hasura admin secret header is present', () => {
    const mockRequest = {
      headers: {},
    };

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    const factory = getParamDecoratorFactory();
    const resultHasuraAdminSecret = factory(
      'x-hasura-admin-secret',
      mockContext,
    );

    expect(resultHasuraAdminSecret).toBeUndefined();
  });
});
