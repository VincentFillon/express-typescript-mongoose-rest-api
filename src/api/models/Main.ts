import { Type } from 'class-transformer';
import { isObject, isString, IsUUID } from 'class-validator';
import { isArray, isDate, isNil, isNumber, ucFirst } from '../utils/utils';

type ObjectAlias = object;

export interface IMain extends ObjectAlias {
  _id?: string;
  [prop: string]: any;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export abstract class Main extends Object implements IMain {
  @IsUUID()
  public _id?: string;

  @Type(() => Date)
  public createdAt?: Date;
  @Type(() => Date)
  public updatedAt?: Date;
  public __v?: number;

  public constructor(data?: IMain) {
    super();
    if (isObject(data)) {
      this.hydrate(data);
    }
  }

  public hydrate<T extends IMain>(data?: T): void {
    if (isNil(data)) {
      return;
    }
    Object.assign(this, data);
    const keys: (keyof Main)[] = Object.keys(data) as (keyof Main)[];
    keys.forEach((prop: keyof Main) => {
      if (prop != null && data.hasOwnProperty(prop)) {
        const value: T[keyof Main] = this.getKeyValue(data, prop);
        if (isNil(value) || isNumber(value) || typeof value === 'boolean' || typeof value === 'function' || isArray(value)) {
          this.setKeyValue(prop, value);
        } else if (isDate(value)) {
          this.setKeyValue(prop, new Date(value));
        } else if (isString(value)) {
          this.setKeyValue(prop, value);
        } else if (isObject(value)) {
          const ctor: new (obj: any) => Main[keyof Main] = Object.getPrototypeOf(value).constructor;
          this.setKeyValue(prop, new ctor(value));
        } else {
          this.setKeyValue(prop, value);
        }
      }
    });
  }

  private getKeyValue<T extends IMain, U extends keyof T>(obj: T, key: U): T[U] {
    return obj[key];
  }

  private setKeyValue<U extends keyof Main>(key: U, value: any): void {
    if (isNil(key)) {
      return;
    }
    // Création du nom de la fonction setter par rapport à la key
    const setter = 'set' + ucFirst(key);
    // Si la propriété est trouvé dans l'instance
    if (Reflect.has(this, setter)) {
      // Recupère la fonction
      const fct = Reflect.get(this, setter);
      // Si c'est bien une fonction on l'execute
      if (typeof fct === 'function') {
        fct.call(this, value);
      }
    } else {
      this[key] = value;
    }
  }
}
