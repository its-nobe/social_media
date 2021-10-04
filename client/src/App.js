import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

function App() {
	return (
		<div className="App">
			<Router>
				<div className="navbar">
					<Link to="/createpost"> New Post </Link>
					<Link to="/login"> Sign In</Link>
					<Link to="/registration"> Sign Up</Link>
					<Link to="/"> Home </Link>
				</div>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/createpost" exact component={CreatePost} />
					<Route path="/post/:id" exact component={Post} />
					<Route path="/registration" exact component={Registration} />
					<Route path="/login" exact component={Login} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
