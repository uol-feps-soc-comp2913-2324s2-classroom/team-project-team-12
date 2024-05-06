<div align="center">
<h1>🌎 Journeys</h1>

The ultimate route tracking experience.
</div>

| Landing Page (Light Mode)     | Map Page (Dark Mode)      |
| ----------------------------- | ------------------------- |
| ![Landing Page](docs/ss1.png) | ![Map Page](docs/ss2.png) |


## About

Journeys is a feature-rich route tracking program developed for Uni of Leeds' COMP2913 module. It records walks submitted by its users and visualises them on its intuitive and accessible interface. Customers can use its social features to share their progress with friends, or opt to publish selected routes to the groups they moderate. The app uses a premium business model and charges users for their subscriptions. Using the app requires a payment of £1.50 per week, £5.00 per month, or £45.00 per year.

* **Track Your Activities -**
    Record your runs, rides, and workouts with live GPS tracking. Supports GPX file uploading and downloading to synchronize your data with other third party applications.

* **Socialise -**
    Connect with friends and share your fitness journey with them. Use Journeys to view each others routes and keep yourselves motivated.

* **Collaborate -**
    Create groups and share your routes with other members. View the repository of public routes to get inspiration for new walks and to see others' progress.


## Authors
* [Abbie Hewitt](https://github.com/archivehaze)
* [Ayomide Soruna](https://github.com/AyoSoruna)
* [Connor Boucher](https://github.com/cbouch-uni)
* [Dylan Dickinson](https://github.com/DylanDD12)
* [Hari Chander](https://github.com/HariC02)
* [Kaitlyn Chan](https://github.com/sc22kc2)


## Requirements
* node-js >= v18.13
* npm
* docker (optional)


## Deployment

To simplify deployment, we have created a single command to prepare and run a live production server:
```bash
npm run deploy
```

If you would like to create a production version of the app without hosting a web server, use `npm run build` and the software will be compiled into the `/build` directory. Remember to run `npm install` first to pull and install and remote dependencies. You can preview this production build using `npm run preview`.


### Using Docker

To generate a Docker image file, run:
```bash
docker build --tag journeys .
```
and run a container using your preferred Docker client. We recommend Docker Desktop for its first party support.


## Development

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
