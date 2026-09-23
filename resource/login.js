document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("loginError");

  if (user === "test" && pass === "test") {
    sessionStorage.setItem("wk_admin", "1");
    window.location.href = "admin.html";
  } else {
    errorBox.className = "error show";
  }
});
