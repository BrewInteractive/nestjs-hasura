import { GraphQLClient, Variables } from 'graphql-request';
import {
  HasuraConfig,
  HasuraHeaders,
  HasuraRequest,
  RunQueryFlags,
  RunQueryOptions,
} from './models';

import { Injectable } from '@nestjs/common';

@Injectable()
export class HasuraService {
  private readonly graphQLClient: GraphQLClient;
  private readonly adminSecret?: string;

  constructor(private readonly hasuraConfig: HasuraConfig) {
    this.graphQLClient = new GraphQLClient(this.hasuraConfig.graphqlEndpoint);
    this.adminSecret = this.hasuraConfig?.adminSecret;
  }

  requestAsync<T, V extends Variables = Variables>(
    hasuraRequest: HasuraRequest<V>,
  ): Promise<T> {
    const headers = {
      ...(hasuraRequest?.headers || {}),
      ...this.createHeadersByRunQueryFlags(hasuraRequest?.runQueryFlag),
      ...this.createHeadersByRunQueryOptions(
        hasuraRequest?.runQueryOptions || {},
      ),
    };

    return this.graphQLClient.request<T>(
      hasuraRequest.query,
      hasuraRequest.variables,
      headers,
    );
  }

  private getAdminSecret(): string {
    if (this.adminSecret) return this.adminSecret;

    throw new Error('Missing admin secret.');
  }

  private createHeadersByRunQueryFlags(flags: RunQueryFlags) {
    const headers = {};
    if ((RunQueryFlags.UseAdminSecret | flags) == flags)
      headers['x-hasura-admin-secret'] = this.getAdminSecret();

    if ((RunQueryFlags.UseAdminSecret | flags) == flags)
      headers['x-hasura-use-backend-only-permissions'] = true;

    return headers;
  }

  private createHeadersByRunQueryOptions(options: RunQueryOptions) {
    return Object.entries(options).reduce((acc, [key, value]) => {
      const headerKey = HasuraHeaders[key];
      if (headerKey) acc[headerKey] = value;
      return acc;
    }, {});
  }
}
