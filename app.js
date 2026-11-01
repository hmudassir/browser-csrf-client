const origin = "http://127.0.0.1:8080";
const out = document.querySelector("#out");
let csrfToken = null;

function show(value) {
  out.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

async function ensureCsrf() {
  if (csrfToken) return csrfToken;
  const response = await fetch(origin + "/api/auth/csrf", { credentials: "include" });
  if (!response.ok) throw new Error("CSRF request failed: " + response.status);
  const body = await response.json();
  csrfToken = body.token;
  return csrfToken;
}

async function send(path, body) {
  const token = await ensureCsrf();
  const response = await fetch(origin + path, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error((parsed && parsed.detail) || "Request failed: " + response.status);
  }
  return parsed;
}

document.querySelector("#form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  try {
    const created = await send("/api/auth/signup", {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    });
    show(created);
  } catch (error) {
    show(error.message);
  }
});

document.querySelector("#me").addEventListener("click", async () => {
  try {
    const response = await fetch(origin + "/api/auth/me", { credentials: "include" });
    const text = await response.text();
    show(text ? JSON.parse(text) : response.status);
  } catch (error) {
    show(error.message);
  }
});
