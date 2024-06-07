import moment from 'moment';
moment.locale('zh-cn');
function formalDate(time: Date) {
	return moment(time).format('YYYY年MM月DD日');
}
function formalTime(time: Date) {
	return moment(time).format('YYYY/MM/DD HH:MM');
}
export { formalTime, formalDate };
