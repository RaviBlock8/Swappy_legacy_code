import React from "react";
import { mount } from "enzyme";
import sinon from "sinon";
import SwapWindow from "./SwapWindow";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../../theme/theme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../store/reducer";
import { SnackbarProvider } from "notistack";
const store = createStore(rootReducer);

describe("Unit tests for SwapWindow page", () => {
	it("tests if SwapWindow mounts correctly", () => {
		mount(
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<SnackbarProvider maxSnack={4}>
						<SwapWindow />
					</SnackbarProvider>
				</ThemeProvider>
			</Provider>
		);
	});
});
