import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function Post() {
	let { id } = useParams();
	const [postObject, setPostObject] = useState({});
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [likedComments, setLikedComments] = useState([]);
	const { authState } = useContext(AuthContext);

	let history = useHistory();

	useEffect(() => {
		axios.get(`http://localhost:1001/posts/byId/${id}`).then((response) => {
			setPostObject(response.data);
		});

		axios
			.get(`http://localhost:1001/comments/${id}`, {
				headers: { accessToken: localStorage.getItem("accessToken") },
			})
			.then((response) => {
				setComments(response.data.comments);
				setLikedComments(
					response.data.likedComments.map((like) => {
						return like.CommentId;
					})
				);
			});
	}, []);

	const likeAComment = (commentId) => {
		axios
			.post(
				"http://localhost:1001/clikes",
				{ CommentId: commentId },
				{ headers: { accessToken: localStorage.getItem("accessToken") } }
			)
			.then((response) => {
				setComments(
					comments.map((comment) => {
						if (commentId === comment.id) {
							if (response.data.liked) {
								return { ...comment, CLikes: [...comment.CLikes, 0] };
							} else {
								const likeArray = comment.CLikes;
								likeArray.pop();
								return { ...comment, CLikes: likeArray };
							}
						} else {
							return comment;
						}
					})
				);
				if (likedComments.includes(commentId)) {
					setLikedComments(
						likedComments.filter((id) => {
							return id !== commentId;
						})
					);
				} else {
					setLikedComments([...likedComments, commentId]);
				}
			});
	};

	const addComment = () => {
		axios
			.post(
				"http://localhost:1001/comments",
				{
					commentBody: newComment,
					PostId: id,
				},
				{
					headers: {
						accessToken: localStorage.getItem("accessToken"),
					},
				}
			)
			.then((response) => {
				if (response.data.error) {
					console.log(response.data.error);
				} else {
					const commentToAdd = {
						commentBody: newComment,
						username: response.data.username,
					};
					setComments([...comments, commentToAdd]);
					setNewComment("");
				}
			});
	};

	const deleteComment = (id) => {
		axios
			.delete(`http://localhost:1001/comments/${id}`, {
				headers: { accessToken: localStorage.getItem("accessToken") },
			})
			.then(() => {
				setComments(
					comments.filter((val) => {
						return val.id !== id;
					})
				);
			});
	};

	const deletePost = (id) => {
		axios
			.delete(`http://localhost:1001/posts/${id}`, {
				headers: { accessToken: localStorage.getItem("accessToken") },
			})
			.then(() => {
				history.push("/");
			});
	};

	const editPost = (option) => {
		if (option === "title") {
			let newTitle = prompt("Enter New Title:");
			axios.put(
				"http://localhost:1001/posts/title",
				{
					newTitle: newTitle,
					id: id,
				},
				{
					headers: { accessToken: localStorage.getItem("accessToken") },
				}
			);

			setPostObject({ ...postObject, title: newTitle });
		} else {
			let newPostText = prompt("Enter New Text:");
			axios.put(
				"http://localhost:1001/posts/postText",
				{
					newText: newPostText,
					id: id,
				},
				{
					headers: { accessToken: localStorage.getItem("accessToken") },
				}
			);

			setPostObject({ ...postObject, postText: newPostText });
		}
	};

	return (
		<div className="postPage">
			<div className="leftSide">
				<div className="post" id="individual">
					<div
						className="title"
						onClick={() => {
							if (authState.username === postObject.username) {
								editPost("title");
							}
						}}
					>
						<b> {postObject.title} </b>
					</div>
					<div
						className="body"
						onClick={() => {
							if (authState.username === postObject.username) {
								editPost("body");
							}
						}}
					>
						{postObject.postText}
					</div>
					<div className="footer">
						<b>@</b>
						{postObject.username}
						{authState.username === postObject.username && (
							<button
								onClick={() => {
									deletePost(postObject.id);
								}}
							>
								<DeleteIcon />
							</button>
						)}
					</div>
				</div>
			</div>
			<div className="rightSide">
				<div className="addCommentContainer">
					<input
						type="text"
						placeholder="Comment..."
						autoComplete="off"
						value={newComment}
						onChange={(event) => {
							setNewComment(event.target.value);
						}}
					/>
					<button onClick={addComment}> Add Comment</button>
				</div>
				<div className="listOfComments">
					{comments.map((comment, key) => {
						return (
							<div key={key} className="comment">
								<div className="cUser">
									<b>
										<label>@{comment.username}</label>
									</b>
								</div>
								<div className="cBody">{comment.commentBody}</div>
								<label>{comment.CLikes ? comment.CLikes.length : 0}</label>
								<button
									onClick={() => likeAComment(comment.id)}
									className={
										likedComments.includes(comment.id)
											? "unlikeBttnComment"
											: "likeBttnComment"
									}
								>
									<ThumbUpAltIcon />
								</button>
								{authState.username === comment.username && (
									<button
										onClick={() => deleteComment(comment.id)}
										className="delc"
									>
										<DeleteIcon />
									</button>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Post;
