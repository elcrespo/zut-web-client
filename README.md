# ZemogaUiTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Live Version

https://zemoga-ui-test-web-client.herokuapp.com/

## Comments

For this app what I did was use an approach full reactive. All the components have a facade service with its own little state, the components respond to the changes of the state, all the events and interactions of the user with the app are handled by Observables.

The idea of the facade services is to isolate the components from the business logic, the component only needs to know the "what" not the "how", also with this approach if in the future the app needs state management (NgRx) we only gonna need to change the services.

I really think that we should change the way that we think about our apps. Think less Imperative and more Reactive.

In the other hand, I tried to have a lot of dumb components and only a couple intelligent that are in charge of all the logic. The dumb components the only thing they do is show data an emit events.

The file where are the settings is in `src/assets/config` there you can change the Base URL of the API.

The app has all the login and register flows and lazy loading.

## Sorry, I'm not good with CSS

If you are looking for a "CSS Ninja" I'm not that guy, I love JS and Reactive Programming.

## Please be patient the first time you load the app on Heroku.
