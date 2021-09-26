import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function SameAs(property: string, options?: ValidationOptions) {
  return function (target: Object, propertyName: string) {
    return registerDecorator({
      name: 'sameAs',
      target: target.constructor,
      propertyName,
      constraints: [property],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [ propertyToMatch ] = args.constraints;
          const valueToMatch = args.object[propertyToMatch];

          return valueToMatch === value;
        }
      }
    });
  };
}
