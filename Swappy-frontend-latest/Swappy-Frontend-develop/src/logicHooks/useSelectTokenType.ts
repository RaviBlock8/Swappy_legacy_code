import { useState } from "react";
import { useSnackbar } from "notistack";

export default function useSelectTokenType() {
	const [tokenInType, setTokenInType] = useState<string>(" ");
	const [tokenOutType, setTokenOutType] = useState<string>(" ");
	const [errorMsg, setErrorMsg] = useState("");
	const [areTokenSame, setAreTokenSame] = useState<boolean>(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const changeTokenType = (tokenName: string, tokenType: string) => {
		switch (tokenType) {
			case "tokenIn":
				setTokenInType(tokenName);
				if (tokenName === tokenOutType) {
					// setErrorMsg("Token In and Token Out cannot be of same type");
					enqueueSnackbar(
						"Swappy: Token In and Token Out can't be of same type",
						{
							variant: "error",
							autoHideDuration: 2000,
						}
					);
					setAreTokenSame(true);
				} else {
					setAreTokenSame(false);
					setErrorMsg("");
				}
				break;
			case "tokenOut":
				setTokenOutType(tokenName);
				if (tokenName === tokenInType) {
					// setErrorMsg("Token In and Token Out cannot be of same type");
					enqueueSnackbar(
						"Swappy: Token In and Token Out can't be of same type",
						{
							variant: "error",
							autoHideDuration: 2000,
						}
					);
					setAreTokenSame(true);
				} else {
					setAreTokenSame(false);
					setErrorMsg("");
				}
				break;
			default:
				setErrorMsg("Not correct type of tokens");
		}
	};

	return { tokenInType, tokenOutType, errorMsg, areTokenSame, changeTokenType };
}
