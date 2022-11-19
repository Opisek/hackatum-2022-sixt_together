# hackatum-2022-sixt_together

## Table of Contents
- [API Reference](#api-reference)
  - [Shared](#shared)
    - [Authentication](#authentication)
  - [Driver](#driver)
    - [Registering Driver](#registering-driver)
    - [Fetching Rider Request](#fetching-rider-request)
    - [Accepting Rider Request](#accepting-rider-request)
    - [Declining Rider Request](#declining-rider-request)
  - [Rider](#rider)
    - [Registering Rider](#registering-rider)
    - [Fetching Driver Assignment](#fetching-driver-assignment)

## API Reference
### Shared
#### Authentication
**Endpoint:**
``/authenticate`` GET

**Usage:**

Get an authorization token at the beginning of the session.

**Response: **
```json
{
  "token": "<authorizationToken>"
}
```

### Driver
#### Registering Driver
**Endpoint:**
``/driver/registerRequest`` POST

**Usage:**

Register a driver and get route coordinates.

*Payload: **
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

**Response:**
```json
{
  "status": "ok",
  "route": "<GeoJSON>"
}
```

#### Fetching Rider Request
**Endpoint:**
``/driver/fetchRider`` POST

**Usage:**

Check if a rider request is pending.

*Payload: **
```json
{
  "token": "<authorizationToken>"
}
```

**Response:**
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
**Endpoint:**
``/driver/acceptRider`` POST

**Usage:**

Commit to picking up the pending rider.

*Payload: **
```json
{
  "token": "<authorizationToken>",
  "rider": "<riderId>"
}
```

**Response:**
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
**Endpoint:**
``/driver/declineRider`` POST

**Usage:**

Decline picking up the pending rider.

*Payload: **
```json
{
  "token": "<authorizationToken>",
  "rider": "<riderId>"
}
```

**Response:**
```json
{
  "status": "ok"
}
```

### Rider
#### Registering Rider
**Endpoint:**
``/rider/registerRequest`` POST

**Usage:**

Register a rider and begin the search for an available driver.

**Payload:**
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

**Response:**
```json
{
  "status": "ok"
}
```

#### Fetching Driver Assignment
**Endpoint:**
``/rider/fetchAssignment`` POST

**Usage:**

Check if a driver has been assigned and fetch the corresponding route.

```json
{
  "token": "<authorizationToken>",
}
```

Response:
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
