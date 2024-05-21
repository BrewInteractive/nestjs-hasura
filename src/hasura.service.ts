import { GraphQLClient, Variables } from 'graphql-request';
import {
  HasuraConfig,
  HasuraOptions,
  HasuraOptionsFlags,
  HasuraRequestOptions,
} from './models';

import { AdminSecretNotFound } from './error';
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
    hasuraRequestOptions: HasuraRequestOptions<V>,
  ): Promise<T> {
    const headers = {
      ...(hasuraRequestOptions?.headers || {}),
      ...this.createOptionsRequestHeaders(hasuraRequestOptions?.options),
    };

    return this._graphQLClient.request<T>(
      hasuraRequestOptions.query,
      hasuraRequestOptions.variables,
      headers,
    );
  }

  private hasuraOptionsToFlags(hasuraOptions: HasuraOptions) {
    return Object.keys(hasuraOptions).reduce((acc, option) => {
      acc |= HasuraOptionsFlags[option];
      return acc;
    }, 0);
  }

  private readonly hasuraEquivalentsForHasuraOption: Record<
    HasuraOptionsFlags,
    string
  > = {
    [HasuraOptionsFlags.authorization]: 'authorization',
    [HasuraOptionsFlags.useBackendOnlyPermissions]:
      'x-hasura-use-backend-only-permissions',
    [HasuraOptionsFlags.role]: 'x-hasura-role',
    [HasuraOptionsFlags.useAdminSecret]: 'x-hasura-admin-secret',
  };

  private getHasuraOptionsFlags() {
    return Object.values(HasuraOptionsFlags).filter(
      (value) => !isNaN(Number(value)),
    ) as Array<HasuraOptionsFlags>;
  }

  private isOptionFlagSet(
    optionFlag: HasuraOptionsFlags,
    optionsFlagValue: number,
  ): boolean {
    return (optionFlag | optionsFlagValue) == optionsFlagValue;
  }

  private getAdminSecret(): string {
    if (this._adminSecret) return this._adminSecret;

    throw new AdminSecretNotFound();
  }

  private getOptionsValueByFlag(
    flag: HasuraOptionsFlags,
    hasuraOptions: HasuraOptions,
  ) {
    if (flag == HasuraOptionsFlags.useAdminSecret) return this.getAdminSecret();
    else return hasuraOptions[HasuraOptionsFlags[flag]];
  }

  private createOptionsRequestHeaders(hasuraOptions: HasuraOptions = {}) {
    const optionsFlagValue = this.hasuraOptionsToFlags(hasuraOptions);

    return this.getHasuraOptionsFlags().reduce((acc, optionFlag) => {
      if (this.isOptionFlagSet(optionFlag, optionsFlagValue))
        acc[this.hasuraEquivalentsForHasuraOption[optionFlag]] =
          this.getOptionsValueByFlag(optionFlag, hasuraOptions);

      return acc;
    }, {});
  }
}
