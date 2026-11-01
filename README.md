# Browser CSRF client

A one-page client for the `session-csrf-api` sample.

The page asks the API for a CSRF token, keeps that token in memory, and sends it on signup as `X-XSRF-TOKEN`. The session cookie is `HttpOnly`, so this page never reads it. `fetch` uses `credentials: "include"` so the browser stores and sends the cookie.

The page and API boundary is in [docs/architecture.md](docs/architecture.md).

## Run

Start the API on port 8080, then serve this folder on port 8081. The API only allows that origin.

```sh
python3 -m http.server 8081
```

Open http://127.0.0.1:8081

Opening the file directly (`file://`) will not keep the session cookie.

## What this is

A portfolio proof of concept. It talks only to the local sample API.
