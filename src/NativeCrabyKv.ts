import type { NativeModule } from 'craby-modules';
import { NativeModuleRegistry } from 'craby-modules';

interface Spec extends NativeModule {
  initialize(): void;
  set(key: string, value: string): void;
  get(key: string): string | null;
  remove(key: string): void;
  keys(): string[];
  contains(key: string): boolean;
  clear(): void;
  size(): number;
}

export default NativeModuleRegistry.getEnforcing<Spec>('CrabyKv');
