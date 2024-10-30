# Conways Game Of Life

A simple representation of [Conway's Game Of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

The app has the following functionalities:
-
1. Start/Pause Game
2. Restart Game (Generates a new game)
3. Game Settings:
    * Canvas Width - defaults to your screen width minus the page padding (If you set it to a number larger than your screen width, it will default to your screen width minus the padding of the page)
    * Canvas Height - defaults to half your screen height
    * Cell Size - defaults to 10
    * Cell Color - defaults to black
    * Generation time in ms - defaults to 0 - maximum speed (Lifespan of each generation)
4. Game info - the elapsed generations so far in the current game (information appear on hover or click)

* All settings are saved in the local storage of the browser.

##

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
