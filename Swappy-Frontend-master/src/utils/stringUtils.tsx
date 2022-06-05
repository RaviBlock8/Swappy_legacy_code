
const stringToBigIntString = (val: string, decimals: number) => {
	val = val + ".";
	let parts = val.split(".")
	let fraction = parts[1];
	fraction = fraction.substr(0, decimals)
	while(fraction.length < decimals) {
		fraction = fraction + "0";
	}
	return Number(parts[0]) > 0 ? parts[0] + fraction : fraction;
}

const bigIntStringToString = (val: string, decimals: number) => {
	let numeric = val.substr(0, val.length - decimals);
	let fraction = val.substr(val.length - decimals, val.length);
	return numeric + "." + fraction
}

export { stringToBigIntString, bigIntStringToString }
