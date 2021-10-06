import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";

function Post() {
	let { id } = useParams();
	const [postObject, setPostObject] = useState({});
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const { authState } = useContext(AuthContext);

	let history = useHistory();

	useEffect(() => {
		axios.get(`http://localhost:1001/posts/byId/${id}`).then((response) => {
			setPostObject(response.data);
		});

		axios.get(`http://localhost:1001/comments/${id}`).then((response) => {
			setComments(response.data);
		});
	}, []);

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

	return (
		<div className="postPage">
			<div className="leftSide">
				<div className="post" id="individual">
					<div className="title"> {postObject.title} </div>
					<div className="body">{postObject.postText}</div>
					<div className="footer">
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
								{authState.username === comment.username && (
									<button onClick={() => deleteComment(comment.id)}>
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
