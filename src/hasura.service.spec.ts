import { AuthorizationOptions, HasuraConfig, RequestFlags } from './models';
import { Faker, MockFactory } from 'mockingbird';
import { Test, TestingModule } from '@nestjs/testing';

import { HasuraConfigFixture } from '../test/fixtures';
import { HasuraService } from './hasura.service';
import { MissingAdminSecret } from './error';
import { gql } from 'graphql-request';

const graphqlClientSpy = jest.fn();

jest.mock('graphql-request', () => {
  return {
    GraphQLClient: jest.fn().mockImplementation(() => ({
      request: graphqlClientSpy,
    })),
    gql: jest.requireActual('graphql-request').gql,
  };
});

describe('HasuraService', () => {
  let hasuraService: HasuraService;
  const hasuraConfig = MockFactory(HasuraConfigFixture).one();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HasuraService,
        {
          provide: HasuraConfig,
          useValue: hasuraConfig,
        },
      ],
    }).compile();

    hasuraService = module.get<HasuraService>(HasuraService);
  });

  it('should be defined', async () => {
    expect(hasuraService).toBeDefined();
  });

  it('should run the query without the variables.', async () => {
    const query = gql`
      query testQuery {
        books {
          id
        }
      }
    `;

    const expectedResult = [{ id: Faker.datatype.number() }];
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync({ query });

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, undefined, {});
  });

  it('should run the query with the variables.', async () => {
    const variables = {
      id: Faker.datatype.number(),
    };
    const query = gql`
      query testQuery($id: Int!) {
        books_by_id(id: $id) {
          id
        }
      }
    `;

    const expectedResult = { id: Faker.datatype.number() };
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync({
      query,
      variables,
    });

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, variables, {});
  });

  it('should run the query with the runQueryFlag.', async () => {
    const query = gql`
      query testQuery($id: Int!) {
        books_by_id(id: $id) {
          id
        }
      }
    `;
    const requestFlags: RequestFlags = RequestFlags.UseBackendOnlyPermissions;

    const expectedResult = { id: Faker.datatype.number() };
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync({
      query,
      requestFlags,
    });

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, undefined, {
      'x-hasura-use-backend-only-permissions': true,
      'x-hasura-admin-secret': hasuraConfig.adminSecret,
    });
  });

  it('should run the query with the runQueryOptions.', async () => {
    const query = gql`
      query testQuery($id: Int!) {
        books_by_id(id: $id) {
          id
        }
      }
    `;

    const authorizationOptions: AuthorizationOptions = {
      role: Faker.datatype.string(),
      authorizationToken: Faker.datatype.string(),
    };

    const expectedResult = { id: Faker.datatype.number() };
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync({
      query,
      authorizationOptions,
    });

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, undefined, {
      'x-hasura-role': authorizationOptions.role,
      authorization: authorizationOptions.authorizationToken,
    });
  });

  it('should throw error if UseAdminSecret flag is set without setting admin secret in config.', async () => {
    Reflect.set(hasuraService, 'adminSecret', undefined);
    const query = gql`
      query testQuery {
        books {
          id
        }
      }
    `;

    const requestFlags: RequestFlags = RequestFlags.UseAdminSecret;

    expect(async () => {
      await hasuraService.requestAsync({
        query,
        requestFlags,
      });
    }).rejects.toThrow(MissingAdminSecret);
  });
});
