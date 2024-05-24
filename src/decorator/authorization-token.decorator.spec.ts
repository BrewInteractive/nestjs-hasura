import { AuthorizationToken } from './authorization-token.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

function getParamDecoratorFactory() {
  class TestDecorator {
    public getDecoratorValue(@AuthorizationToken() value) {
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

describe('AuthorizationToken Decorator', () => {
  it('should return the authorization header', () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer mockToken',
      },
    };

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    const factory = getParamDecoratorFactory();
    const authorization = factory('authorization', mockContext);

    expect(authorization).toBe(mockRequest.headers.authorization);
  });

  it('should return undefined if no authorization header is present', () => {
    const mockRequest = {
      headers: {},
    };

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    const factory = getParamDecoratorFactory();
    const authorization = factory('authorization', mockContext);

    expect(authorization).toBeUndefined();
  });
});
