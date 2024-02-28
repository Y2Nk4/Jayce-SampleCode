### NodeJS samples

#### MuggleMuggle
Technologies: WebSocket, Koa.js, MongoDB, Docker

An auction website built with Koa.js,
we utilized MongoDB to store data and WebSocket to
place bids and update auction status in real-time:

#### PetShop
Technologies: Egg.js, Sequelize, TypeScript, MySQL

A website backend built with Egg.js. I utilized MySQL
locks to ensure data consistency and avoid race conditions.
I also utilized Inheritance of OOP to build a shopping cart
system in which the guests' shopping carts are stored in
Redis Cache and times out after days, while the logged-in
users' shopping carts are stored in MySQL database to persist.
