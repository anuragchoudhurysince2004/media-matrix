import { showAlert } from "./alerts.js";
const registerButton = document.querySelector(".registration-form");
import { base_url } from "./helper.js";

const register = async (email, password, name) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${base_url}/api/v1/auth/register`,
      data: {
        email,
        password,
        name,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Registered successfully!");
      window.setTimeout(() => {
        location.assign("/profile");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.error);
  }
};

if (registerButton)
  registerButton.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("i got clicked");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    register(email, password, name);
  });
