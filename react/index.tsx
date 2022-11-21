import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./assets/styles/index.css";
// import './assets/styles/style.css';
import "./assets/styles/common.scss";
import reportWebVitals from "./reportWebVitals";
import { store } from "./redux/store";

// pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/PrivateRoute";

const client = new ApolloClient({
  // 'https://flyby-gateway.herokuapp.com/',
  uri: process.env.REACT_APP_GRAPHQL_URL, // specifies the URL of our GraphQL server.
  cache: new InMemoryCache(), // Apollo Client uses to cache query results after fetching them.
  connectToDevTools: true,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
