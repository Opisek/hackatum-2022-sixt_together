# hackatum-2022-sixt_together
## Table of Contents
- [General Information](#hackatum-2022-sixt-together)
  - [Table of Contents](#table-of-contents)
  - [Abstract](#abstract)
  - [Tech Stack](#tech-stack)
  - [Futere Prospect](#future-prospect)
  - [Screenshots](#screenshots)
  - [Videos](#videos)
- [Backend](#backend)
  - [Environment Variables](#environment-variables)
  - [REST API Reference](#rest-api-reference)
    - [Shared](#shared)
      - [Authentication](#authentication)
    - [Driver](#driver)
      - [Registering Driver](#registering-driver)
      - [Fetching Rider Request](#fetching-rider-request)
      - [Accepting Rider Request](#accepting-rider-request)
      - [Declining Rider Request](#declining-rider-request)
    - [Rider](#rider)
      - [Registering Rider](#registering-rider)
      - [Cancel Rider](#cancel-rider)
      - [Fetching Driver Assignment](#fetching-driver-assignment)
- [Driver Frontend](#driver-frontend)
- [Rider Frontend](#rider-frontend)

## Abstract
This project has been developed during the 2022 hackaTUM event as a proposed solution to the SIXT challange concerning incentivizing car renting services to reduce car ownership rates and work towards a more sustainable future, whilst at the same time combating the issue of long recharge times plaguing electric vehicles.

The core idea is to let SIXT Rent and SIXT Share clients reduce their bill by dynamically picking up SIXT Ride users on their way. We believe that this would reduce the effective amount of cars traversing the streets, as no dedicated SIXT Ride drivers would need to be dispatched. This allows the rest of the electric or hybrid fleet to recharge fully without the worry of leaving clients waiting.

More information can be found on the [Devpost](https://devpost.com/software/sixt-together) page of this project.

## Tech Stack
The project consists of three parts:
- A Node.js REST API [backend server](#backend) for coordinating rides and calculating routes
- A Node.js emulation of a possible SIXT [car dashboard](#driver-frontend) for the driver (SIXT Rent or SIXT Share user) complete with navigation and rider pick-up dialogues
- A Flutter mobile application for riders to pick and request their rides

## Future Prospect
SIXT together is full of potential for possible future developements. The following are a few ideas for possible features:
- Utilizing Minimal Weight Edmond's Blossom Algorithm to efficiently assign riders to potental drivers
- Calculating and displaying the driver's arrival time on the rider's phone application
- Fleshing out the driver's dashboard with common navigation elements like a clock, ETA, verbal directions, or a comprehensible zoomed-in view of e.g. the upcoming intersections

## Screenshots
<img src="https://user-images.githubusercontent.com/40141286/202893644-8a376e4c-87e7-411c-8bbe-797946eda894.png" alt="driver0" width=70%>
<img src="https://user-images.githubusercontent.com/40141286/202893645-10083555-8220-46fa-841b-9d1226b8efa8.png" alt="driver1" width=70%>
<img src="https://user-images.githubusercontent.com/40141286/202893646-77954176-bc78-434d-b638-650a95788cf7.png" alt="driver2" width=70%>
<img src="https://user-images.githubusercontent.com/40141286/202893647-99de034b-8deb-4c8f-a16e-1795618da78a.png" alt="driver3" width=70%>
<img src="https://user-images.githubusercontent.com/40141286/202893648-6cecd94f-f421-43f7-8538-29b3c4523476.png" alt="driver4" width=70%>
<img src="https://user-images.githubusercontent.com/40141286/202893649-210e557c-cb45-400a-997e-42df4adc793f.png" alt="driver5" width=70%>
<img src="https://user-images.githubusercontent.com/40141286/202893650-d96856b1-5b2d-4eb4-ad13-fd09755007f9.png" alt="driver6" width=70%>
<img src="https://user-images.githubusercontent.com/40141286/202893654-2d859475-68e4-4e17-a92b-cd68f46cd593.png" alt="rider0" width=30%>
<img src="https://user-images.githubusercontent.com/40141286/202893655-ea86b3f5-4585-4bd0-bf4b-2fda049b8092.png" alt="rider1" width=30%>
<img src="https://user-images.githubusercontent.com/40141286/202893656-f0949aa3-4a07-4794-91ad-1189f7ba64e7.png" alt="rider2" width=30%>
<img src="https://user-images.githubusercontent.com/40141286/202893657-8a2bb89d-03aa-445d-8378-56c931ae4be1.png" alt="rider3" width=30%>

## Videos
[Driver](https://user-images.githubusercontent.com/40141286/202893896-ed6b49c0-de30-4693-9d40-e1719320395d.mov)

[Rider](https://user-images.githubusercontent.com/40141286/202893895-6ba67dc1-da66-497a-9953-6698d3daae24.mov)

# Backend
The backend server coordinates the communication between drivers and riders via a RESTful API and utilizes Openrouteservice for route calculation.

## Installation
- Make sure Node.js is installed
- Clone this repository if not done so already
- Go inside the ``backend`` directory
- Execute ``npm install``
- Create a ``.env`` file according to the keys-value pairs specified in the [Environment Variables](#environment-variables) section
- Execute ``node server.js``
- The backend RestFUL API is now running on the specified port

## Environment Variables
| Key | Usage |
| --- | --- |
| WEB_PORT | The web port that the API server binds to | e.g. 80 |
| JWT_SECRET | The private key that the server uses for token generation | e.g. generated by ``ssh keygen`` |
| ORS_KEY | Authentication token for using Openrouteservice | Obtainable at [Openrouteservice](https://openrouteservice.org/)

## REST API Reference
This API reference was used for easier development of the frontends.

### Shared
#### Authentication
**Endpoint**
``/authenticate`` GET

**Usage**

Get an authorization token at the beginning of the session.

**Response**
```json
{
  "token": "<authorizationToken>"
}
```

### Driver
#### Registering Driver
**Endpoint**
``/driver/registerRequest`` POST

**Usage**

Register a driver and get route coordinates.

**Payload**
```json
{
  "token": "<authorizationToken>",
  "begin": {
    "longitude": "<longitude>",
    "latitude": "<latitude>"
  },
  "end": {
    "longitude": "<longitude>",
    "latitude": "<latitude>"
  }
}
```

**Response**
```json
{
  "status": "ok",
  "route": "<GeoJSON>"
}
```

#### Fetching Rider Request
**Endpoint**
``/driver/fetchRider`` POST

**Usage**

Check if a rider request is pending.

**Payload**
```json
{
  "token": "<authorizationToken>"
}
```

**Response**
- If no rider request is pending
```json
{
  "status": "ok",
  "rider": null
  "route": null
}
```
- If a rider request is pending
```json
{
  "status": "ok",
  "rider": "<riderId>"
  "route": "<GeoJSON>"
}
```

#### Accepting Rider Request
**Endpoint**
``/driver/acceptRider`` POST

**Usage**

Commit to picking up the pending rider.

**Payload**
```json
{
  "token": "<authorizationToken>",
  "rider": "<riderId>"
}
```

**Response**
- If offer still available
```json
{
  "status": "ok"
}
```
- If the offer had expired
```json
{
  "status": "expired"
}
```

#### Declining Rider Request
**Endpoint**
``/driver/declineRider`` POST

**Usage**

Decline picking up the pending rider.

**Payload**
```json
{
  "token": "<authorizationToken>",
  "rider": "<riderId>"
}
```

**Response**
```json
{
  "status": "ok"
}
```

### Rider
#### Registering Rider
**Endpoint**
``/rider/registerRequest`` POST

**Usage**

Register a rider and begin the search for an available driver.

**Payload**
```json
{
  "token": "<authorizationToken>",
  "begin": {
    "longitude": "<longitude>",
    "latitude": "<latitude>"
  },
  "end": {
    "longitude": "<longitude>",
    "latitude": "<latitude>"
  }
}
```

**Response**
```json
{
  "status": "ok"
}
```

#### Cancel Rider
**Endpoint**
``/rider/cancelRequest`` POST

**Usage**

Cancels the ride request and stops driver search.

**Payload**
```json
{
  "token": "<authorizationToken>"
}
```

**Response**
```json
{
  "status": "ok"
}
```

#### Fetching Driver Assignment
**Endpoint**
``/rider/fetchAssignment`` POST

**Usage**

Check if a driver has been assigned and fetch the corresponding route.

```json
{
  "token": "<authorizationToken>"
}
```

**Response**
- If a driver has not yet been assigned:
```json
{
  "status": "ok",
  "route": null
}
```
- If a driver has been assigned:
```json
{
  "status": "ok",
  "route": "<GeoJSON>"
}
```

# Driver Frontend
This webserver meant to be ran locally serves as a concept for a possible car dashboard inside the SIXT electric fleet. The buttons would be integrated into the steering wheel for distractionless interaction.

## Installation
- Make sure Node.js is installed
- Clone this repository if not done so already
- Go inside the ``driver`` directory
- Execute ``npm install``
- Create a ``.env`` file according to the keys-value pairs specified in the [Environment Variables](#environment-variables-1) section
- Execute ``node server.js``
- The driver frontend mockup is now running on the specified port and can be viewed in a browser

## Environment Variables
| Key | Usage | Description |
| --- | --- | --- |
| WEB_PORT | The web port that the API server binds to | e.g. 8080 |
| ORS_KEY | Authentication token for using Openrouteservice (the functionality using this service should technically be migrated into the backend or realized using a local database) | Obtainable at [Openrouteservice](https://openrouteservice.org/) |
| SERVER | The address of the backend server | e.g. https://localhost |

# Rider Frontend
A cross-plattform application for riders to request transport.
This part of the project can be found in [this repository](https://github.com/KevinGruber2001/st-rider).
