# STAKEOUT UI

The Stakeout UI is web-based frontend for Stakeout Server, and requires an instance of the server to be launched.

## Developer Quick Start

This is an [Angular](https://angular.io) project using `ng` [@angular/cli](https://cli.angular.io/) as the build system, [SCSS](http://sass-lang.com) for CSS and [Bootstrap](https://getbootstrap.com/) for layout. `npm` is the package manager. Assuming you already have node installed via [`nvm`](https://github.com/nvm-sh/nvm) or similar, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. The following must be set:

	export STAKEOUT_SERVER_URL=http://localhost:4200
	export STAKEOUT_TITLE="My Stakeout"

# Building for Production

To build with [Docker](https://www.docker.com) and [nginx](http://nginx.org), use the included Dockerfile, such as:

```sh
	docker build -t p3000/stakeout-ui:latest . # though you probably want your own repo and tag strings :)

	# or cross-platform
	docker buildx build --platform linux/arm64/v8,linux/amd64 -t p3000/stakeout-ui:latest . --push
```

## Production Deployment

In your container hosting environment, point an instance at your Stakeout Server installation:

```sh
	docker run -d -p 9000:80 --restart unless-stopped -e "STAKEOUT_SERVER_URL=http://localhost:3000" p3000/stakeout-ui:latest # or any official tag
```
