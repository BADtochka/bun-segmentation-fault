import { type EntityTarget, type FindOptionsSelect } from 'typeorm';

export const getAllEntityProps = <T>(entity: EntityTarget<T>, sensitive?: boolean) => {
  // @ts-ignore
  const selectedProps = Object.keys(new entity()) as FindOptionsSelect<T>;
  return sensitive ? selectedProps : [];
};
