import { GraphQLClient, Variables } from 'graphql-request';
import {
  HasuraConfig,
  HasuraRequest,
  RunQueryFlags,
  RunQueryOptions,
} from './models';

import { Injectable } from '@nestjs/common';

@Injectable()
export class HasuraService {
  private readonly _graphQLClient: GraphQLClient;
  private readonly _adminSecret?: string;

  constructor(private readonly hasuraConfig: HasuraConfig) {
    this._graphQLClient = new GraphQLClient(this.hasuraConfig.graphqlEndpoint);
    this._adminSecret = this.hasuraConfig?.adminSecret;
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

    return this._graphQLClient.request<T>(
      hasuraRequest.query,
      hasuraRequest.variables,
      headers,
    );
  }

  private getAdminSecret(): string {
    if (this._adminSecret) return this._adminSecret;

    throw new Error('There is no admin secret information.');
  }

  private createHeadersByRunQueryFlags(flags: RunQueryFlags) {
    const headers = {};
    if ((RunQueryFlags.UseAdminSecret | flags) == flags)
      headers['x-hasura-admin-secret'] = this.getAdminSecret();

    if ((RunQueryFlags.UseAdminSecret | flags) == flags)
      headers['x-hasura-use-backend-only-permissions'] = true;

    return headers;
  }

  private readonly hasuraEquivalentsForRequestOption: Record<string, string> = {
    authorization: 'authorization',
    role: 'x-hasura-role',
  };

  private createHeadersByRunQueryOptions(options: RunQueryOptions) {
    return Object.entries(options).reduce((acc, [key, value]) => {
      const headerKey = this.hasuraEquivalentsForRequestOption[key];
      if (headerKey) acc[headerKey] = value;
      return acc;
    }, {});
  }
}
