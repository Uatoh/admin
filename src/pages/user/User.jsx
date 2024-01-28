import { useHistory, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { userRequest } from '../../requestMethods';
import './user.css';

export default function User() {
  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  // State variables for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const user = useSelector((state) =>
    state.user.users.find((user) => user._id === userId)
  );

  // Set formData state when user data changes
  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
    });
  }, [user]);

  // Change event handler for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit event handler for updating user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to update the user data
      await userRequest.put(`/users/${userId}`, formData);
      console.log('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newuser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">{/* ... Existing user show content */}</div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  placeholder={user.username}
                  className="userUpdateInput"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder={user.email}
                  className="userUpdateInput"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <button className="userUpdateButton" type="submit">
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
