# Quickstart

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed

## Build

```bash
docker build -t vuna-calc .
```

## Run

```bash
docker run -p 3000:3000 vuna-calc
```

Visit [http://localhost:3000](http://localhost:3000)

## Run in detached mode

```bash
docker run -d --name vuna-calc -p 3000:3000 vuna-calc
```

## Stop

```bash
docker stop vuna-calc
docker rm vuna-calc
```

## Custom port

```bash
docker run -p 8080:3000 vuna-calc
```

App will be available at [http://localhost:8080](http://localhost:8080)
