import { Faker, MockFactory } from 'mockingbird';
import { HasuraOptions, HasuraRequestOptions } from './models';
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

  beforeEach(async () => {
    const hasuraOptions = MockFactory(HasuraOptionsFixture).one();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HasuraService,
        {
          provide: HasuraOptions,
          useValue: hasuraOptions,
        },
      ],
    }).compile();

    hasuraService = module.get<HasuraService>(HasuraService);
  });

  it('should be defined', async () => {
    expect(hasuraService).toBeDefined();
  });

  it('should be defined (Without Hasura Admin Secret)', async () => {
    const hasuraOptions = MockFactory(HasuraOptionsFixture).one();
    delete hasuraOptions.adminSecret;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HasuraService,
        {
          provide: HasuraOptions,
          useValue: hasuraOptions,
        },
      ],
    }).compile();

    const service = module.get<HasuraService>(HasuraService);
    expect(service).toBeDefined();
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

    const actualResult = await hasuraService.requestAsync(query);

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, undefined, undefined);
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

    const actualResult = await hasuraService.requestAsync(query, variables);

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, variables, undefined);
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
    const requestOptions: HasuraRequestOptions = {
      role: Faker.datatype.string(),
      authorization: Faker.datatype.string(),
      useBackendOnlyPermissions: true,
    };

    const expectedResult = { id: Faker.datatype.number() };
    graphqlClientSpy.mockResolvedValue(expectedResult);

    const actualResult = await hasuraService.requestAsync(
      query,
      variables,
      requestOptions,
    );

    expect(actualResult).toBe(expectedResult);
    expect(graphqlClientSpy).toHaveBeenCalledWith(query, variables, {
      'x-hasura-role': requestOptions.role,
      authorization: requestOptions.authorization,
      'x-hasura-use-backend-only-permissions':
        requestOptions.useBackendOnlyPermissions,
    });
  });
});
