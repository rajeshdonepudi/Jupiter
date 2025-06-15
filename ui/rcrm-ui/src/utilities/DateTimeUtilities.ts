import moment from "moment";

const getRelativeTime = (date: string) => {
  return moment(convertUTCDateToLocalDate(date)).fromNow();
};

const formatDate = (format: string) => {
  return moment().format(format);
};

const GetTodayDate = () => {
  return moment().format("ll");
};

const renderAsLocaleDate = (data: any) => {
  return moment.utc(data).local().format("YYYY/MM/DD HH:mm:ss");
};

const renderAsRelativeTime = (data: any) => {
  return moment.utc(data).local().fromNow();
};

export default {
  toRelativeTime: renderAsRelativeTime,
  TodayDate: GetTodayDate,
  FormatDate: formatDate,
  toLocalDate: renderAsLocaleDate,
};

//#region Helper functions
function convertUTCDateToLocalDate(date: string, format?: string) {
  if (date) {
    if (format) {
      const formattedDateTime = moment(date)
        .local(true)
        .format("YYYY-MM-DD HH:mm:ss");
      return formattedDateTime;
    } else {
      return moment.utc(date).local();
    }
  } else {
    return "N/A";
  }
}

//#endregion
