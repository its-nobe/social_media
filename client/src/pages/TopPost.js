import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function TopPost() {
  let history = useHistory();
  const [topPost, setTopPost] = useState({});
  const [liked, setLiked] = useState(false);
  const [listOfLikes, setListOfLikes] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:1001/posts/topPost", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.post) {
          setTopPost(response.data.post);
          setListOfLikes(response.data.likes);
          setLiked(response.data.liked);
        } else {
          // history.push(`/createpost`);
          setTopPost({
            title: "No Post at top yet",
            postText: "This post is to redirect you to Create Post",
          });
        }
      });
  }, [liked]);

  const likePost = (postId) => {
    axios
      .post(
        "http://localhost:1001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setLiked(response.data.liked);
      });
  };

  return (
    <div className="post">
      <div className="title">
        <b>{topPost.title}</b>
      </div>
      <div
        className="body"
        onClick={() => {
          topPost.id
            ? history.push(`/post/${topPost.id}`)
            : history.push(`/createpost`);
        }}
      >
        {topPost.postText}
      </div>
      <div className="footer">
        <div className="username">
          <Link
            to={topPost.UserId ? `/profile/${topPost.UserId}` : `/createpost`}
          >
            <b>@</b>
            {topPost.username ? topPost.username : "nouser"}
          </Link>
        </div>
        <div className="buttons">
          <ThumbUpAltIcon
            onClick={() => likePost(topPost.id)}
            className={liked ? "unlikeBttn" : "likeBttn"}
          />
          <label>{listOfLikes ? listOfLikes.length : 0}</label>
        </div>
      </div>
    </div>
  );
}

export default TopPost;
