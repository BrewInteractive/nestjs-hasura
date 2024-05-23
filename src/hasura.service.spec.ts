import { Faker, MockFactory } from 'mockingbird';
import { HasuraConfig, RunQueryFlags, RunQueryOptions } from './models';
import { Test, TestingModule } from '@nestjs/testing';

import { AdminSecretNotFound } from './error';
import { HasuraConfigFixture } from '../test/fixtures';
import { HasuraService } from './hasura.service';
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
    const runQueryFlag: RunQueryFlags = RunQueryFlags.UseBackendOnlyPermissions;

    const expectedResult = { id: Faker.datatype.number() };
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync({
      query,
      runQueryFlag,
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

    const runQueryOptions: RunQueryOptions = {
      role: Faker.datatype.string(),
      authorization: Faker.datatype.string(),
    };

    const expectedResult = { id: Faker.datatype.number() };
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync({
      query,
      runQueryOptions,
    });

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, undefined, {
      'x-hasura-role': runQueryOptions.role,
      authorization: runQueryOptions.authorization,
    });
  });

  it('Admin requests should throw an error if there is no admin secret information.', async () => {
    Reflect.set(hasuraService, '_adminSecret', undefined);
    const query = gql`
      query testQuery {
        books {
          id
        }
      }
    `;

    const runQueryFlag: RunQueryFlags = RunQueryFlags.UseAdminSecret;

    expect(async () => {
      await hasuraService.requestAsync({
        query,
        runQueryFlag,
      });
    }).rejects.toThrow(AdminSecretNotFound);
  });
});
