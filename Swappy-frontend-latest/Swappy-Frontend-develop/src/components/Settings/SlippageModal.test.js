import React from "react";
import { mount } from "enzyme";
import sinon from "sinon";
import SlippageModal from "./SlippageModal";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../../theme/theme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../store/reducer";
import { SnackbarProvider } from "notistack";
const store = createStore(rootReducer);

describe("Unit tests for slippage modal", () => {
	let open = false;
	let handleClose = sinon.fake();
	it("tests if sliappge modal mounts or not", () => {
		mount(
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<SnackbarProvider maxSnack={4}>
						<SlippageModal open={open} handleClose={handleClose} />
					</SnackbarProvider>
				</ThemeProvider>
			</Provider>
		);
	});
});
