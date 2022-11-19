# hackatum-2022-sixt_together

## Table of Contents
- [API Reference](#api-reference)
  - [Shared](#shared)
  - [Driver](#driver)
  - [Rider](#rider)

## API Reference
### Shared
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

### Rider
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
