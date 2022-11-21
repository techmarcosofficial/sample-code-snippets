function currentDate() {
  return new Date();
}

function dateFormat(date: Date) {
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  return `${year}-${month}-${day}`;
}

function getDiffernceInMonths(d1: number, d2: number) {
  
  var months = 0;
  months = (d2 - d1) * 12;
  return months <= 0 ? 0 : months;
}

function convertTimeZone(date: any, tzString: string) {
  return new Date((
    typeof date === "string" ? new Date(date): date)
      .toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
  );
}

function getClientTime() {
  let text: string = '';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const convertedDate = convertTimeZone(new Date(), tz);
  var hours = convertedDate.getHours();
  if (hours < 12) {
    text = 'Good Morning';
  } else if (hours < 16) {
    text = 'Good Afternoon';
  } else {
    text = 'Good Evening';
  }
  return text;
}

export {
  currentDate,
  dateFormat,
  getClientTime,
  convertTimeZone,
  getDiffernceInMonths
};