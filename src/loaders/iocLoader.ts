import { useContainer as classValidatorUseContainer, Validator } from 'class-validator';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Constructable, Container } from 'typedi';

export const iocLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  /**
   * Setup routing-controllers to use typedi container.
   */
  routingUseContainer(Container);
  classValidatorUseContainer(Container, {
    fallback: true,
    fallbackOnErrors: true,
  });
  // Patch erreur : ServiceNotFoundError: Service with "MaybeConstructable<Validator>" identifier was not found in the container.
  /* if (!Container.has(Validator as Constructable<Validator>)) {
    Container.set({ id: Validator, type: Validator as Constructable<Validator> });
  }
  Container.get(Validator); */
};
