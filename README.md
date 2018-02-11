# ng4-d3-chart

This project was adapted from d3-ng2-demo (<https://github.com/tomwanzek/d3-ng2-demo>). It illustrates the normal distribution.

## Development server

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Run `npm build` to build the project for a production build. The build artifacts will be stored in the `dist/` directory.

## Electron

Install electron `npm install electron`.

### Start electron

Run `npm run electron` to start the app with electron.

### Build the app and then start electron

`npm run electron-build` to build the project and start the app with electron.

## Docker

Install docker `apt-get install docker`.

### Build a docker image

The code for docker was adapted from angular4-docker-example (<https://github.com/avatsaev/angular4-docker-example>)

Run `npm run docker-build` or `docker build -t ng4-d3-chart .` to build docker image.

### Run docker container

Run `npm run docker` or `docker run -d -p 8080:80 ng4-d3-chart` to start docker container. The app will be available at `http://localhost:8080/`.
You can easily tweak the nginx config in ```nginx/default.conf```

## Running unit tests

Run `ng test` or `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` or `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
