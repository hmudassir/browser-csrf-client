# Architecture

The page and the API are different origins. The page can cause the browser to send the session cookie. It cannot read that cookie.

## Boundaries

```text
page on http://127.0.0.1:8081
  keeps the CSRF token in memory
  fetch(..., credentials: "include")
        |
        |  Cookie: SESSION, XSRF-TOKEN
        |  X-XSRF-TOKEN: <memory>
        v
API on http://127.0.0.1:8080
  allows this origin only
  compares the header with the CSRF cookie
  loads the user from the session id
```

`SESSION` is `HttpOnly`. `app.js` never touches it. The CSRF token comes from `GET /api/auth/csrf` and stays in a variable. Each signup sends it back as `X-XSRF-TOKEN`.

## Request path

1. The first state-changing call asks the API for a CSRF token if memory is empty.
2. Signup posts the name, email, and password with `credentials: "include"`.
3. The browser stores `Set-Cookie` from the API host and sends those cookies on later calls to that host.
4. "Who am I?" is a `GET` with the cookie and no CSRF header. Reading does not change state.

Opening the file as `file://` is outside this design. The API allow-list is the page's origin, and a `file://` page does not keep the API host's cookie in the way this sample relies on.

## Failure

A missing or stale CSRF header fails in the API before signup runs. A call with no session fails when the page asks who the user is. The page shows the error text and does not invent a local user.

## What this sample leaves out

The page is static. It does not choose a route guard as the access check. The API is the access check. The session sample is the other half of this boundary.
