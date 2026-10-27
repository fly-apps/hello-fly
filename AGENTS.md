# AGENTS.md

hello-fly is a small Express + EJS app deployed on [Fly.io](https://fly.io). It shows which region and machine served the request. It's a starting point: change it however you like, add routes, pages, a database, whatever the user wants to try.

## Where things are

- `server.js`: routes, request logging, error handling, graceful shutdown
- `views/`: EJS templates (`index.ejs`, `error.ejs`)
- `public/`: static files served as-is (`style.css`, `logo.svg`)
- `fly.toml`: Fly app config (`app` is filled in by `fly launch`)
- `Dockerfile`: the image Fly builds and runs

## Run locally

```sh
npm ci
npm start                # http://localhost:8080
```

Or with Docker:

```sh
docker build -t hello-fly . && docker run --rm -p 8080:8080 hello-fly
```

`FLY_REGION`, `FLY_MACHINE_ID` and `FLY_APP_NAME` are only set on Fly. Set them by hand to preview the page locally.

## Deploy

```sh
fly launch --now         # first deploy; prompts for an app name
fly deploy               # later deploys
fly status               # machines and their state
fly logs                 # live logs
fly open                 # open the app in a browser
```

## Fly things worth knowing

- The app must listen on `0.0.0.0` at the port in `fly.toml` (`internal_port`, 8080).
- Machines stop when idle and start on the next request (`auto_stop_machines`), so the first request after a quiet period is slower. Set `min_machines_running = 1` to keep one warm.
- `/health` is the health check in `fly.toml`. Keep it returning 200.
- Local disk is wiped on every deploy. For persistent data, attach a volume (`fly volumes create`) or use Postgres (`fly postgres create`).
- Secrets go in `fly secrets set KEY=value`. Never commit them.

## Things to try

- Run in more regions: `fly scale count 2 --region nrt`, then route to it with `curl -H "fly-prefer-region: nrt" https://<app>.fly.dev`
- Change machine size: `fly scale vm shared-cpu-2x`
- Add a custom domain: `fly certs add example.com`
