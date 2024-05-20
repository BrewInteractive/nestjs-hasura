import { Faker, MockFactory } from 'mockingbird';
import { HasuraConfig, HasuraOptions } from './models';
import { Test, TestingModule } from '@nestjs/testing';

import { HasuraOptionsFixture } from '../test/fixtures';
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
  const hasuraConfig = MockFactory(HasuraOptionsFixture).one();

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
    const hasuraOptions: HasuraOptions = {
      role: Faker.datatype.string(),
      authorization: Faker.datatype.string(),
      useBackendOnlyPermissions: true,
      useAdminSecret: true,
    };

    const expectedResult = { id: Faker.datatype.number() };
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync({
      query,
      variables,
      options: hasuraOptions,
    });

    expect(actualResult).toBe(expectedResult);
    // expect(graphqlClientSpy).toHaveBeenCalledWith(query, variables, {
    //   'x-hasura-role': hasuraOptions.role,
    //   authorization: hasuraOptions.authorization,
    //   'x-hasura-use-backend-only-permissions':
    //     hasuraOptions.useBackendOnlyPermissions,
    //   'x-hasura-admin-secret': hasuraConfig.adminSecret,
    // });
  });
});
