import { server } from '@/index';

export abstract class Resolver<Q, R> {
  public abstract resolve(query: Q): Promise<R | null>;
}

export abstract class Provider<Q, R> {
  public abstract provide(query: Q): Promise<R>;
}

export class ResolverPipeline<Q, R> {
  constructor(
    public readonly resolvers: Resolver<Q, R>[],
    public readonly provider: Provider<Q, R>,
  ) {}

  public async resolve(query: Q): Promise<R> {
    for (const resolver of this.resolvers) {
      try {
        const result = await resolver.resolve(query);
        if (result) return result;
      } catch (err) {
        server.log.warn({ resolver: resolver.constructor.name, err }, 'Resolver failed');
      }
    }
    return this.provider.provide(query);
  }
}
