import moment from 'moment/moment';
import marked from 'marked';

export function humanizeRoles(role) {
  const role_map = {
    inst_superuser: 'Institute Owner',
    inst_admin: 'Administrator',
    inst_staff: 'Staff Member',
    inst_student: 'Student'
  };

  return role_map[role]
}

export function ellipsis(text, length) {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

export function getDateDiff(date, startwithUpeerCase) {
  let eventDate = moment(date);
  const daysDiff = eventDate.diff(moment().startOf('day'), 'days');
  let timeDiff;
  switch (daysDiff) {
    case 0: {
      timeDiff = 'today';
      break;
    }
    case 1: {
      timeDiff = 'tomorrow';
      break;
    }
    default: {
      const timezone = moment.tz.guess();
      const time = moment.tz(eventDate, null).format();
      timeDiff = moment(time).tz(timezone).fromNow();
      break;
    }
  }
  return (startwithUpeerCase ? timeDiff.charAt(0).toUpperCase() + timeDiff.slice(1) : timeDiff)
}

export function markdownToHtml(text) {
  marked.setOptions({
    highlight: function (code) {
      return window.hljs.highlightAuto(code).value;
    }
  });

  return marked(text);
}

export const simplemde_config = {
  hideIcons: ['side-by-side', 'fullscreen', 'heading'],
  insertTexts: {
    horizontalRule: ['', '\n\n-----\n\n'],
    image: ['![](http://', ')'],
    link: ['[', '](http://)'],
    table: ['', '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n'],
  },
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
    strikethrough: false,
    underscoresBreakWords: true,
  },
  renderingConfig: {
    codeSyntaxHighlighting: true,
  },
  showIcons: ['code', 'guide'],
  spellChecker: false,
  status: false,
  tabSize: 4,
  toolbarTips: true
};
