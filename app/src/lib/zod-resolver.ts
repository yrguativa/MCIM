import { zodResolver as hookformZodResolver } from '@hookform/resolvers/zod';
import { Resolver, FieldValues } from 'react-hook-form';

export function zodResolver<TFieldValues extends FieldValues, TContext = any>(
  schema: Parameters<typeof hookformZodResolver>[0],
  schemaOptions?: Parameters<typeof hookformZodResolver>[1],
  resolverOptions?: Parameters<typeof hookformZodResolver>[2],
): Resolver<TFieldValues, TContext> {
  return hookformZodResolver(schema as any, schemaOptions, resolverOptions as any) as Resolver<TFieldValues, TContext>;
}
