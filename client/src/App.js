import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";

function App() {
	return (
		<div className="App">
			<Router>
				<Link to="/createpost"> New Post </Link>
				<Link to="/"> Home </Link>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/createpost" exact component={CreatePost} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
