import { registerDecorator, ValidationArguments } from "class-validator";

export function IsPhone() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsPhone",
      target: object.constructor,
      propertyName,
      constraints: [/^\d{3}\s\d{3}\s\d{2}\s\d{2}$/],
      options: { message: "Yanlış telefon numarası" },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [phoneRegex] = args.constraints;

          return phoneRegex.test(value);
        },
      },
    });
  };
}
