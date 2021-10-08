import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
	const [listOfPosts, setListOfPosts] = useState([]);
	const [likedPosts, setLikedPosts] = useState([]);
	const { authState } = useContext(AuthContext);
	let history = useHistory();

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			history.push("/login");
		} else {
			axios
				.get("http://localhost:1001/posts", {
					headers: { accessToken: localStorage.getItem("accessToken") },
				})
				.then((response) => {
					setListOfPosts(response.data.listOfPosts);
					setLikedPosts(
						response.data.likedPosts.map((like) => {
							return like.PostId;
						})
					);
				});
		}
	}, []);

	const likePost = (postId) => {
		axios
			.post(
				"http://localhost:1001/likes",
				{ PostId: postId },
				{ headers: { accessToken: localStorage.getItem("accessToken") } }
			)
			.then((response) => {
				setListOfPosts(
					listOfPosts.map((post) => {
						if (post.id === postId) {
							if (response.data.liked) {
								return { ...post, Likes: [...post.Likes, 0] };
							} else {
								const likeArray = post.Likes;
								likeArray.pop();
								return { ...post, Likes: likeArray };
							}
						} else {
							return post;
						}
					})
				);
				if (likedPosts.includes(postId)) {
					setLikedPosts(
						likedPosts.filter((id) => {
							return id != postId;
						})
					);
				} else {
					setLikedPosts([...likedPosts, postId]);
				}
			});
	};
	return (
		<div>
			{listOfPosts.map((value, key) => {
				return (
					<div key={key} className="post">
						<div className="title">
							<b>{value.title}</b>
						</div>
						<div
							className="body"
							onClick={() => {
								history.push(`/post/${value.id}`);
							}}
						>
							{value.postText}
						</div>
						<div className="footer">
							<div className="username">
								<Link to={`/profile/${value.UserId}`}>
									<b>@</b>
									{value.username}
								</Link>
							</div>
							<div className="buttons">
								<ThumbUpAltIcon
									onClick={() => likePost(value.id)}
									className={
										likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
									}
								/>
								<label>{value.Likes.length}</label>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Home;
