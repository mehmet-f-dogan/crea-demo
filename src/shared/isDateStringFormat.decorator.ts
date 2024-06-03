import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateStringFormat(
  format: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateStringFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const regex = new RegExp(
            format
              .replace(/dd/, '(0[1-9]|[12][0-9]|3[01])')
              .replace(/MM/, '(0[1-9]|1[012])')
              .replace(/yyyy/, '\\d{4}'),
          );
          return regex.test(value);
        },
      },
    });
  };
}
