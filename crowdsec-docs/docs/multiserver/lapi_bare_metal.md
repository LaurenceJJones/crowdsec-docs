---
id: lapi_bare_metal
title: Bare metal setup
---

:::info
This guide is for bare metal setups. Bare metal is defined by installing it directly on the host machine, without using any containerization technology.
:::

## Prerequisites

### Mandatory

- A working [Security Engine](/getting_started/intro.md) setup on host machine
- A text editor (e.g. `nano`, `vim`, `emacs`)

### Optional

- Reverse proxy (e.g. `nginx`, `traefik`, `caddy`) to expose the LAPI to the internet

:::info
Since the LAPI is a REST API, you can directly expose it to the internet. However, we recommend using a reverse proxy since most have a way to do TLS generation. (Bounus: you dont have to remember to renew your TLS certificates)

CrowdSec does support TLS certificates, but it is generally recommended to use a reverse proxy for TLS termination.
:::

## Configure Security Engine

By default the LAPI is enabled when CrowdSec is installed, However, it is only listening for connections on the loopback interface.

### Expose Security Engine Directly

If you are exposing the CrowdSec port directly we will need to configure it to listen on all addresses (0.0.0.0) OR if you machine have multiple interfaces, you can configure it to listen on a specific address (192.168.0.1).

```yaml title="config.yaml"
api:
  server:
    listen_uri: "<address>:<port>"
```

The default port is `8080`, if this port is already in use, you can change it to any port you want.

:::info
Exposing the port directly does not mean by default it is accessible from the internet. You will need to configure your firewall to allow connections to the port.

We highly recommend only allowing IP addresses that need access to the port to connect to it. 
:::

### Reverse proxy

If you plan to use a reverse proxy to expose the LAPI, you can leave the default configuration as is. However, if you would like to change the port the LAPI listens on (As 8080 is a common port for applications), you can do so by changing the `listen_uri` in the `config.yaml` file.

```yaml title="config.yaml"
api:
  server:
    listen_uri: "127.0.0.1:<port>"
# if you are using a reverse proxy you can keep loopback interface so to not expose the LAPI directly
```


## [Optional] Configure TLS

When exposing the LAPI to the internet, it is recommended to use TLS. You can either configure TLS on the LAPI directly, or use a reverse proxy to handle TLS termination.

#### Reverse proxy

If you are using a reverse proxy, you can configure it to handle TLS termination. We will not provide a guide on how to configure your reverse proxy as there are many different ones. Please refer to the documentation of your reverse proxy.

When behind a reverse proxy, you will need to inform the LAPI of the upstream proxy by setting the `use_forwarded_for_headers` to `true`. This will tell the LAPI to use the `X-Forwarded-For` header instead of the `RemoteAddr` to get the IP address of the client. You **MUST** configure the reverse proxy to send the `X-Forwarded-For` header if not the LAPI will not be able to get the IP address of the machines/bouncers connecting to it.

```yaml title="config.yaml"
api:
  server:
    use_forwarded_for_headers: "<true|false>"
```

#### Security Engine LAPI

If you are not using a reverse proxy, you can configure TLS directly on the LAPI by providing the path to the certificate and key file. If you wish to generate a self-signed certificate you can find guides online. However, we recommend using a reverse proxy for TLS termination.

```yaml title="config.yaml"
api:
  client:
    insecure_skip_verify: "(true|false)" # Set to true if you are using a self-signed certificate
  server:
    tls:
      cert_file: "<path_to_certificat_file>"
      key_file: "<path_to_certificat_key_file>"
```

However, keep in mind when configuring the log processors you will also need to set `insecure_skip_verify` to `true` if you are using a self-signed certificate.

## Configure log processors

Please continue to the [log processors] section to configure the log processors.

## Additional Options

By default, the LAPI is able to process remote registration requests via `cscli lapi register`. However, if you would like disable remote registration and only allow manual machine additions via `cscli machines add` on the main LAPI then you can configure as per below.

```yaml title="config.yaml"
api:
  server:
    disable_remote_lapi_registration: (true|false)
```