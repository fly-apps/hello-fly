# hello-fly

This is our Hello World Fly.io application. It shows which region and machine served the page, and what to try next. Try it out now:

```sh
git clone https://github.com/fly-apps/hello-fly.git

cd hello-fly

fly launch --now
```

## Run locally

```sh
npm ci
npm start
```

Or with Docker:

```sh
docker build -t hello-fly .
docker run --rm -p 8080:8080 hello-fly
```

Then open http://localhost:8080. A health check is available at `/health`.

Working with a coding agent? See [AGENTS.md](AGENTS.md).
