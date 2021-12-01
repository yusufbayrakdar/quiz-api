import {
  CacheInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable
} from "@nestjs/common";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { METADATA } from "../utilities/metadata";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    if (!key) return next.handle();

    const req = context.switchToHttp().getRequest();

    const target = context.getHandler();
    const isCacheEnable = this.reflector.get(METADATA.BYK_CACHE_ACTIVE, target);
    if (!isCacheEnable) return next.handle();

    if (req.query.noCache) return next.handle();
    if (req.query.deleteCache) {
      await this.cacheManager.del(key);
      return next.handle();
    }

    const metaTTL = this.reflector.get(
      METADATA.NESTJS_DEFAULT_CACHE_TTL_METADATA,
      target
    );
    const ttl = metaTTL || 7200;

    try {
      const value = await this.cacheManager.get(key);
      return value
        ? of(value)
        : next
            .handle()
            .pipe(
              tap((response) => this.cacheManager.set(key, response, { ttl }))
            );
    } catch (error) {
      return next.handle();
    }
  }

  trackBy(context: ExecutionContext): string | undefined {
    const target = context.getHandler();
    const isCacheEnable = this.reflector.get(METADATA.BYK_CACHE_ACTIVE, target);

    if (!isCacheEnable) return undefined;
    const req = context.switchToHttp().getRequest();
    const key = req.originalUrl;
    return key;
  }
}
