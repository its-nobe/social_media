import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:1001/auth/basicInfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });
    axios.get(`http://localhost:1001/posts/byUserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);
  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1> Username: {username}</h1>
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title">{value.title}</div>
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
                  <b>@</b>
                  {value.username}
                </div>
                <div className="buttons">
                  <label>{value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
