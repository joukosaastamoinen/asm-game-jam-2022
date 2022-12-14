import ReactDOM from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import App from "./App";
import createKeyboard from "./keyboard/keyboard";
import KeyboardProvider from "./keyboard/KeyboardProvider";
import reportWebVitals from "./reportWebVitals";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
`;

const rootEl = document.getElementById("root");
if (rootEl === null) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootEl);

const keyboard = createKeyboard(window);

root.render(
  <>
    <GlobalStyle />
    <KeyboardProvider keyboard={keyboard}>
      <App />
    </KeyboardProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
