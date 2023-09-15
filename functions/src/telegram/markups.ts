export const courseSelectorMarkup = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "1",
          callback_data: "course1",
        },
        {
          text: "2",
          callback_data: "course2",
        },
        {
          text: "3",
          callback_data: "course3",
        },
        {
          text: "4",
          callback_data: "course4",
        },
        {
          text: "5",
          callback_data: "course5",
        },
        {
          text: "6",
          callback_data: "course6",
        },
      ],
    ],
  },
};

export const scheduleSelectorMarkup = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Понеділок",
          callback_data: "monday",
        },
        {
          text: "Вівторок",
          callback_data: "tuesday",
        },
      ],
      [
        {
          text: "Середа",
          callback_data: "wednesday",
        },
        {
          text: "Четвер",
          callback_data: "thursday",
        },
      ],
      [
        {
          text: "П'ятниця",
          callback_data: "friday",
        },
      ],
    ],
  },
};

export const getGroupsMarkup = (groups: {group: string, docId: string}[]) => {
  return {
    reply_markup: {
      inline_keyboard: [
        groups.map((group) => ({
          text: group.group,
          callback_data: group.docId,
        })),
        [
          {
            text: "🔙 Назад",
            callback_data: "courseSelector",
          },
        ],
      ],
    },
  };
};
