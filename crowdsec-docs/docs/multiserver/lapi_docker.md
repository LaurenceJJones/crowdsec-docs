---
id: lapi_container
title: Container setup
---

:::info
This guide is for container setups. Containerization technology that allows you to run applications in isolated environments.
:::

## Prerequisites

### Mandatory

- A containerization technology installed (e.g. `docker`, `podman`)

### Optional

- Reverse proxy (e.g. `nginx`, `traefik`, `caddy`) to expose the LAPI to the internet

## Configure Security Engine

Depending on your containerization technology, you will use the port mapping feature to expose the LAPI.

### Expose Security Engine Directly

#### Docker

##### Run

```bash
docker run -d -p 8080:8080 crowdsecurity/crowdsec:latest
```

##### Compose

```yaml title="docker-compose.yaml"
version: '3.8'

services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    ports:
      - 8080:8080
```

#### Podman

##### Run

```bash
podman run -d -p 8080:8080 crowdsecurity/crowdsec:latest
```

### Reverse proxy

If you plan to use a reverse proxy to expose the LAPI, you can bind the container port to the loopback interface.

#### Docker

##### Run

```bash
docker run -d -p 127.0.0.1:8080:8080 crowdsecurity/crowdsec:latest
```

##### Compose

```yaml title="docker-compose.yaml"
version: '3.8'

services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    ports:
      - 127.0.0.1:8080:8080
```

#### Podman

##### Run

```bash
podman run -d -p 127.0.0.1:8080:8080 crowdsecurity/crowdsec:latest
```

## [Optional] Configure TLS

If you are using a reverse proxy, you can configure TLS on the reverse proxy. If you are exposing the LAPI directly, you can configure TLS on the LAPI.

### Security Engine

#### Docker

##### Run

```bash
docker run -d -p 8080:8080 -e USE_TLS=true -e LAPI_KEY_FILE=/etc/crowdsec/lapi.key -e LAPI_CERT_FILE=/etc/crowdsec/lapi.crt -v /path/to/lapi.key:/etc/crowdsec/lapi.key -v /path/to/lapi.crt:/etc/crowdsec/lapi.crt crowdsecurity/crowdsec:latest
```

##### Compose

```yaml title="docker-compose.yaml"
version: '3.8'

services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    ports:
      - 8080:8080
    environment:
      - LAPI_KEY_FILE=/etc/crowdsec/lapi.key
      - LAPI_CERT_FILE=/etc/crowdsec/lapi.crt
      - USE_TLS=true
    volumes:
      - /path/to/lapi.key:/etc/crowdsec/lapi.key
      - /path/to/lapi.crt:/etc/crowdsec/lapi.crt
```

#### Podman

##### Run

```bash
podman run -d -p 8080:8080 -e USE_TLS=true -e LAPI_KEY_FILE=/etc/crowdsec/lapi.key -e LAPI_CERT_FILE=/etc/crowdsec/lapi.crt -v /path/to/lapi.key:/etc/crowdsec/lapi.key:Z -v /path/to/lapi.crt:/etc/crowdsec/lapi.crt:Z crowdsecurity/crowdsec:latest
```

:::info
If you are using a self signed certificate, you will need to set the `INSECURE_SKIP_VERIFY` environment variable to `true`.
:::

### Reverse proxy

:::info
When using a reverse proxy you should bind the LAPI to the loopback interface. We will not provide the commands again since you can see the example above.
:::

If you are using a reverse proxy, you can configure it to handle TLS termination. We will not provide a guide on how to configure your reverse proxy as there are many different ones. Please refer to the documentation of your reverse proxy.

When behind a reverse proxy, you will need to inform the LAPI of the upstream proxy by setting the `use_forwarded_for_headers` to `true`. This will tell the LAPI to use the `X-Forwarded-For` header instead of the `RemoteAddr` to get the IP address of the client. You **MUST** configure the reverse proxy to send the `X-Forwarded-For` header if not the LAPI will not be able to get the IP address of the machines/bouncers connecting to it.

Currently there is no container environment variable to set this option see [issue](https://github.com/crowdsecurity/crowdsec/issues/2428). You will need to mount a override configuration file to `/etc/crowdsec/config.yaml.local` with the following content:

```yaml title="config.yaml.local"
api:
  server:
    use_forwarded_for_headers: true
```

Example mount:
```
-v /path/to/config.yaml.local:/etc/crowdsec/config.yaml.local
```