import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  // Form state
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [message, setMessage] = useState("");

  // Current user state
  const [currentUser, setCurrentUser] = useState(null);

  // Check localStorage for access token and fetch user info
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetchCurrentUser(accessToken);
    }
  }, []);

  // Fetch current user info
  const fetchCurrentUser = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/api/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch user info. Please login again.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  // Handle login/signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let res;

      if (isLogin) {
        // Login
        res = await axios.post(`${API_URL}/api/token/`, {
          username,
          password,
        });
      } else {
        // Signup
        res = await axios.post(`${API_URL}/api/register/`, {
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        });
      }

      // Save tokens
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Fetch user info after login/signup
      await fetchCurrentUser(res.data.access);

      setMessage(isLogin ? "Logged in successfully!" : "Account created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      if (!isLogin) setIsLogin(true); // auto-switch to login after signup
    } catch (err) {
      console.error(err);
      setMessage("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
    setMessage("Logged out successfully.");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h1>Senior Project Frontend</h1>

      {currentUser ? (
        // Logged-in view
        <div>
          <p>
            Welcome, <strong>
              {currentUser.first_name || currentUser.last_name
                ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim()
                : currentUser.username}
            </strong>!
          </p>
          <p>Email: {currentUser.email || "Not set"}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        // Login/signup form
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <div>
            <label>Username: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <div>
                <label>First Name: </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label>Last Name: </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label>Email: </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>

          <p style={{ marginTop: "1rem" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </form>
      )}

      {message && <p style={{ marginTop: "1rem", color: "blue" }}>{message}</p>}
    </div>
  );
}

export default App;
