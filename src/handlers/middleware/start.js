import { addUser } from '../../modules/db/index';

export default async (ctx) => {
  ctx.reply('Hello!');
  // TODO: record user only if in DM
  await addUser(ctx.from);
};
