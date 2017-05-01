import moment from 'moment/moment';

export function ellipsis(text, length) {
  return text.length > length ? `${text.substring(0,length)}...` : text;
}

export function getDateDiff(date, startwithUpeerCase) {
  let eventDate = moment(date);
  const daysDiff = eventDate.diff(moment().startOf('day'), 'days');
  let timeDiff;
  switch(daysDiff) {
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
  return (startwithUpeerCase? timeDiff.charAt(0).toUpperCase() + timeDiff.slice(1) : timeDiff)
}
