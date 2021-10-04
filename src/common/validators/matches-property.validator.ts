import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function MatchesProperty(property: string, options?: ValidationOptions) {
  return function (target: Record<string, any>, propertyName: string) {
    return registerDecorator({
      name: 'matchesProperty',
      target: target.constructor,
      propertyName,
      constraints: [property],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [propertyToMatch] = args.constraints;
          const valueToMatch = args.object[propertyToMatch];

          return valueToMatch === value;
        },
      },
    });
  };
}
