import moment from 'moment';
import { Events, formatEmoji } from 'discord.js';
import {
  createUserReminder,
  getUserReminder,
  updateUserReminder
} from '../api/buildHelp.js';

// const BUILD_HELP_CHANNEL_ID = '1074860272059174982';
const BUILD_HELP_CHANNEL_ID = '1075003953026187284';

const messageContent = `**REMINDER**
Please mind these rules when asking for help.
---
- Make sure you have followed ASDD (Accuracy, Speed, Defense, Damage) rule!
- Does your champion have at least 180 speed?
- Make sure you have read and understood the champions abilities carefully before asking.
- Make sure you understand the mechanics of the boss/wave/dungeon you are asking help for.
- Remember to thank the person who helped you!`;

export default {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || message.author.system) return;

    // if (message.content.toLowerCase().includes('kymar')) {
    //   await message.reply({
    //     content: `Kymar is a bad champion. Please do not use him. Muffin said so. ${formatEmoji(
    //       '1083773019983454318'
    //     )}`
    //   });
    // }

    if (message.channelId === BUILD_HELP_CHANNEL_ID) {
      const response = await getUserReminder(message.author.id);

      if (response.isSuccess && !response.reminder) {
        const reminder = await createUserReminder(message.author.id);

        if (reminder.isSuccess) {
          await message.reply({
            content: messageContent
          });
        }
      } else if (response.isSuccess) {
        const reminder = response.reminder;
        const lastReminderDate = new Date(reminder.updatedAt.seconds * 1000);

        if (moment().isAfter(moment(lastReminderDate).add(1, 'month'))) {
          await updateUserReminder(message.author.id);
          await message.reply({
            content: messageContent
          });
        }
      }
    }
  }
};
