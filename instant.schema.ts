// Docs: https://www.instantdb.com/docs/modeling-data

import { i, id } from '@instantdb/admin';

const _schema = i.schema({
  entities: {
    user: i.entity({
      id: i.string().unique().indexed(),
      emailOrPhone: i.string().unique().indexed(),
      passcode: i.string(),
      location: i.string(),
      manualLocation: i.boolean()
    }),
    chargingStatus: i.entity({
      id: i.string().unique().indexed(),
      userId: i.string().indexed(),
      isPluggedIn: i.boolean(),
      userLocation: i.string(),
      manualLocation: i.boolean(),
      statusTime: i.number().indexed(),
    }),
  },
  links: {
    userChargingStatus: {
      forward: {
        on: 'user',
        has: 'many',
        label: 'userChargingStatus',
      },
      reverse: {
        on: 'chargingStatus',
        has: 'one',
        label: 'user',
      }
    }
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
