// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { GameStats, Profile } = initSchema(schema);

export {
  GameStats,
  Profile
};