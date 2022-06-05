import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme/theme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./store/reducer";
import { SnackbarProvider } from "notistack";
const store = createStore(rootReducer);

ReactDOM.render(
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<SnackbarProvider maxSnack={4}>
				<App />
			</SnackbarProvider>
		</ThemeProvider>
	</Provider>,
	document.getElementById("root")
);
