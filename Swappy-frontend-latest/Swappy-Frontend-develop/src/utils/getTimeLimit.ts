export const getTimeLimit = (minutes: number): string => {
	console.log("minutes:", minutes);
	let currentUnixTime: number = Date.now() / 1000;
	currentUnixTime += minutes * 60;
	currentUnixTime = Math.floor(currentUnixTime);
	console.log("time limit:", currentUnixTime);
	return currentUnixTime.toString();
};
