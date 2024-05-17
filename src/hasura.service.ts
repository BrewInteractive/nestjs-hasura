import { GraphQLClient, Variables } from 'graphql-request';
import { HasuraOptions, HasuraRequestOptions } from './models';

import { Injectable } from '@nestjs/common';

@Injectable()
export class HasuraService {
  private readonly _graphQLClient: GraphQLClient;

  constructor(private readonly hasuraOptions: HasuraOptions) {
    this._graphQLClient = new GraphQLClient(this.hasuraOptions.endpoint, {
      headers: this.hasuraOptions?.adminSecret
        ? {
            'x-hasura-admin-secret': this.hasuraOptions.adminSecret,
          }
        : {},
    });
  }

  requestAsync<T, V extends Variables = Variables>(
    query: string,
    variables?: V,
    requestOptions?: HasuraRequestOptions,
  ): Promise<T> {
    const headers = requestOptions && this.createRequestHeaders(requestOptions);
    return this._graphQLClient.request<T>(query, variables, headers);
  }

  private readonly hasuraEquivalentsForRequestOption: Record<string, string> = {
    authorization: 'authorization',
    useBackendOnlyPermissions: 'x-hasura-use-backend-only-permissions',
    role: 'x-hasura-role',
  };

  private createRequestHeaders(requestOptions: HasuraRequestOptions) {
    return Object.entries(requestOptions).reduce((acc, [key, value]) => {
      acc[this.hasuraEquivalentsForRequestOption[key]] = value;
      return acc;
    }, {});
  }
}
