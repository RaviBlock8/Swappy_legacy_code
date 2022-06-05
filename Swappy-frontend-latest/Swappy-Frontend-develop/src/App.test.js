import React from "react";
import { shallow } from "enzyme";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme/theme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./store/reducer";
import { SnackbarProvider } from "notistack";
const store = createStore(rootReducer);

import App from "./App";

describe("Shallow testing App.js ", () => {
	it("renders without crashing", () => {
		shallow(
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<SnackbarProvider maxSnack={4}>
						<App />
					</SnackbarProvider>
				</ThemeProvider>
			</Provider>
		);
	});
});
