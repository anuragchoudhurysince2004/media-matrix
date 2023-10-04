import { showAlert } from "./alerts.js";
const logoutButton = document.querySelector(".nav__el--logout");
const loginButton = document.querySelector(".form");
import { base_url } from "./helper.js";
// dotenv.config({ path: "./../../config.env" });
const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${base_url}/api/v1/auth/login`,
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/profile");
      }, 100);
    }
  } catch (err) {
    showAlert("error", err.response.data.error);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `${base_url}/api/v1/auth/logout`,
    });
    if ((res.data.status = "success"))
      showAlert("success", "Log out successful");
    setTimeout(() => {
      location.assign("/");
    }, 200);
  } catch (err) {
    console.log(err);
    showAlert("error", "Error logging out! Try again.");
  }
};
if (loginButton)
  loginButton.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
if (logoutButton) logoutButton.addEventListener("click", logout);
