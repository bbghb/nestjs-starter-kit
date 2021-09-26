import { Environment } from './constants';

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === Environment.Production;
}
