---
title: CrowdSec Configuration
id: crowdsec_configuration
---

# Crowdsec configuration

CrowdSec has a main `yaml` configuration file, usually located in `/etc/crowdsec/config.yaml`.

## Configuration example

You can find the default configurations on our GitHub repository:

[Linux default configuration](https://github.com/crowdsecurity/crowdsec/blob/releases/1.4.x/config/config.yaml)

[Windows default configuration](https://github.com/crowdsecurity/crowdsec/blob/releases/1.4.x/config/config_win.yaml)

## Environment variables

It is possible to set configuration values based on environment variables.

For example, if you don't want to store your database password in the configuration file, you can do this:

```yaml
db_config:
  type:     mysql
  user:     database_user
  password: ${DB_PASSWORD}
  db_name:  db_name
  host:     192.168.0.2
  port:     3306
```

And export the environment variable such as:

```bash
export DB_PASSWORD="<db_password>"
```

:::warning
**Note**: you need to be `root` or put the environment variable in `/etc/environment`
:::


## Overriding values

If you change `config.yaml` and later upgrade crowdsec, the package system may
ask if you want to replace the configuration with the version from the new
package, or leave the file with your changes untouched. This is usually not a
problem because new directives have default values, but they won't appear in
your configuration file until you manually merge them in. On some OSes
(like freebsd) the package system just writes a `config.yaml.sample` with the
new values if there has been any change to `config.yaml`.

It can also be easier, while automating deployments, to write local
configuration changes to a separate file instead of parsing and rewriting
`config.yaml`.

For all these reasons, you can write your local settings in
`config.yaml.local`, which follows the same format and has the same options as
`config.yaml`. Values defined in `config.yaml.local` will take precedence.
Mappings are merged, sequences are replaced. You can use the environment
variable susbtitution, explained above, in both files.

Example:

```yaml title="/etc/crowdsec/config.yaml.local"
common:
  log_level: debug
api:
  server:
    trusted_ips:
     - 192.168.100.0/24
```

:::info
**Note:** you cannot remove configuration keys from a `.local` file, only
change them (possibly with an empty or default value). So for example, removing
`db_config.db_path` is not possible, even if you don't use it. And you cannot
remove a whole mapping (like `api.server`). Sequences on the other hand, are
always replaced.
:::

### Configuration files that support `.yaml.local`:

- `config.yaml`
- `local_api_credentials.yaml`
- `simulation.yaml`
- `profiles.yaml`

In the case of `profiles.yaml`, the files are read as a whole (as if they were
attached) instead of merged. See [profiles - introduction](/profiles/intro.md).


## Configuration directives

```yaml title="/etc/crowdsec/config.yaml"
common:
  daemonize: "(true|false)"
  pid_dir: "<path_to_pid_folder>"
  log_media: "(file|stdout)"
  log_level: "(error|info|debug|trace)"
  log_dir: "<path_to_log_folder>"
  working_dir: "<path_to_working_folder>"
  log_max_size: <max_size_of_log_file>
  log_max_age: <max_age_of_log_file>
  log_max_files: <number_of_log_files_to_keep>
  compress_logs: (true|false)
config_paths:
  config_dir: "<path_to_crowdsec_config_folder>"
  data_dir: "<path_to_crowdsec_data_folder>"
  simulation_path: "<path_to_simulation_file>"
  hub_dir: "<path_to_crowdsec_hub_folder>"
  index_path: "<path_to_hub_index_file>"
  notification_dir: "<path_to_notification_config_folder>"
  plugin_dir: "<path_to_notification_binaries_folder>"
crowdsec_service:
  acquisition_path: "<acqusition_file_path>"
  acquisition_dir: "<acquisition_dir_path>"
  parser_routines: "<number_of_parser_routines>"
  buckets_routines: "<number_of_buckets_routines>"
  output_routines: "<number_of_output_routines>"
plugin_config:
  user: "<user_to_run_plugin_process_as>"
  group: "<group_to_run_plugin_process_as>"
cscli:
  output: "(human|json|raw)"
  hub_branch: "<hub_branch>"
db_config:
  type:     "<db_type>"
  db_path:  "<path_to_database_file>"
  user:     "<db_user>"      # for mysql/pgsql
  password: "<db_password>"  # for mysql/pgsql
  db_name:  "<db_name>"      # for mysql/pgsql
  host:     "<db_host_ip>"   # for mysql/pgsql
  port:     "<db_host_port>" # for mysql/pgsql
  sslmode:  "<require/disable>" # for pgsql
  max_open_conns: "<max_number_of_conns_to_db>"
  flush:
    max_items: "<max_alerts_in_db>"
    max_age: "<max_age_of_alerts_in_db>"
    bouncers_autodelete:
      cert: "<max_duration_since_last_pull>"
      api_key: "<max_duration_since_last_pull>"
    agents_autodelete:
      cert: "<max_duration_since_last_push>"
      login_password: "<max_duration_since_last_push>"
api:
  client:
    insecure_skip_verify: "(true|false)"
    credentials_path: "<path_to_local_api_client_credential_file>"
  server:
    log_level: "(error|info|debug|trace>")"
    listen_uri: "<listen_uri>" # host:port
    profiles_path: "<path_to_profile_file>"
    use_forwarded_for_headers: "<true|false>"
    console_path: <path_to_console_file>
    online_client:
      credentials_path: "<path_to_crowdsec_api_client_credential_file>"
    tls:
      cert_file: "<path_to_certificat_file>"
      key_file: "<path_to_certificat_key_file>"
      client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequireAndVerifyClientCert"
      ca_cert_path: "<path_to_ca_cert_file>"
      agents_allowed_ou: # List of allowed Organisational Unit for the agents
       - agents_ou
      bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
       - bouncers_ou
      crl_path: "<path_to_crl_file>"
      cache_expiration: "<cache_duration_for_revocation_check>"
    trusted_ips: # IPs or IP ranges which should have admin API access
      #- 127.0.0.1
      #- ::1
      #- 10.0.0.0/24
prometheus:
  enabled: "(true|false)"
  level: "(full|aggregated)"
  listen_addr: "<listen_address>"
  listen_port: "<listen_port>"
```

### `common`

```yaml
common:
  daemonize: "(true|false)"
  pid_dir: "<path_to_pid_folder>"
  log_media: "(file|stdout)"
  log_level: "(error|info|debug|trace)"
  log_dir: "<path_to_log_folder>"
  working_dir: "<path_to_working_folder>"
  log_max_size: <max_size_of_log_file>
  log_max_age: <max_age_of_log_file>
  log_max_files: <number_of_log_files_to_keep>
  compress_logs: (true|false)
```

#### `daemonize`
> bool

Daemonize or not the crowdsec daemon.

#### `pid_dir`
> string

Folder to store PID file.

:::caution
The directive is no longer supported.
:::

#### `log_media`
> string

Log media. Can be `stdout` or `file`.

#### `log_level`
> string

Log level. Can be `error`, `info`, `debug`, `trace`.

#### `log_dir`
> string

Folder to write log file.

:::warning
Works only with `log_media = file`.
:::

#### `working_dir`
> string

Current working directory.

#### `log_max_size`
> int

Maximum size the log file in MB before rotating it.

#### `log_max_age`
> int

Maximum age of previous log files before deleting them.

#### `log_max_files`
> int

Number of previous log files to keep.

#### `compress_logs`
> bool

Whether to compress the log file after rotation or not.

### `config_paths`

This section contains most paths to various sub configuration items.


```yaml
config_paths:
  config_dir: "<path_to_crowdsec_config_folder>"
  data_dir: "<path_to_crowdsec_data_folder>"
  simulation_path: "<path_to_simulation_file>"
  hub_dir: "<path_to_crowdsec_hub_folder>"
  index_path: "<path_to_hub_index_file>"
  notification_dir: "<path_to_notification_config_folder>"
  plugin_dir: "<path_to_notification_binaries_folder>"
```

#### `config_dir`
> string

Main configuration directory of crowdsec.

#### `data_dir`
> string

This is where crowdsec is going to store data, such as files downloaded by scenarios, geolocalisation database, metabase configuration database, or even SQLite database.

#### `simulation_path`
> string

Path to the simulation configuration.

#### `hub_dir`
> string

Directory where `cscli` will store parsers, scenarios, collections and such.

#### `index_path`
> string

Path to the `.index.json` file downloaded by `cscli` to know the list of available configurations.

#### `plugin_dir`
> string
Path to directory where the plugin binaries/scripts are located. 

**Note:** binaries must be root-owned and non-world writable, and binaries/scripts must be named like `<plugin_type>-<plugin_subtype>` eg "notification-slack"

#### `notification_dir`
> string
Path to directory where configuration files for `notification` plugins are kept.

Each notification plugin is expected to have its own configuration file.


### `crowdsec_service`

This section is only used by crowdsec agent.


```yaml
crowdsec_service:
  acquisition_path: "<acqusition_file_path>"
  acquisition_dir: "<acqusition_dir_path>"
  parser_routines: "<number_of_parser_routines>"
  buckets_routines: "<number_of_buckets_routines>"
  output_routines: "<number_of_output_routines>"
```


#### `parser_routines`
> int

Number of dedicated goroutines for parsing files.

#### `buckets_routines`
> int

Number of dedicated goroutines for managing live buckets.

#### `output_routines`
> int

Number of dedicated goroutines for pushing data to local api.

#### `acquisition_path`
> string

Path to the yaml file containing logs that needs to be read.

#### `acquisition_dir`
> string

(>1.0.7) Path to a directory where each yaml is considered as a acquisition configuration file containing logs that needs to be read.
If both `acquisition_dir` and `acquisition_path` are specified, the entries are merged alltogether.


### `cscli`

This section is only used by `cscli`.

```yaml
cscli:
  output: "(human|json|raw)"
  hub_branch: "<hub_branch>"
  prometheus_uri: "<uri>"
```

#### `output`
> string

The default output format (human, json or raw).

#### `hub_branch`
> string

The git branch on which `cscli` is going to fetch configurations.

#### `prometheus_uri`
> uri

(>1.0.7) An uri (without the trailing `/metrics`) that will be used by `cscli metrics` command, ie. `http://127.0.0.1:6060/`


### `plugin_config`

#### `user`
> string

The owner of the plugin process. If set to an empty string, the plugin process
will run as the same user as crowdsec. Both user and group must be either set
or unset.

#### `group`
> string

The group of the plugin process. If set to an empty string, the plugin process
will run in the same group as crowdsec. Both user and group must be either set
or unset.

### `db_config`

The configuration of the database to use for the local API.

```yaml
db_config:
  type:     "<db_type>"

  db_path:  "<path_to_database_file>"  # for sqlite

  user:     "<db_user>"      # for mysql/postgresql/pgx
  password: "<db_password>"  # for mysql/postgresql/pgx
  db_name:  "<db_name>"      # for mysql/postgresql/pgx
  host:     "<db_host_ip>"   # for mysql/postgresql/pgx
  port:     "<db_host_port>" # for mysql/postgresql/pgx
  sslmode:  "<require/disable>" # for postgresql/pgx
  max_open_conns: "<max_number_of_conns_to_db>"
  flush:
    max_items: "<max_alerts_in_db>"
    max_age: "<max_age_of_alerts_in_db>"
    bouncers_autodelete:
      cert: "<max_duration_since_last_pull>"
      api_key: "<max_duration_since_last_pull>"
    agents_autodelete:
      cert: "<max_duration_since_last_push>"
      login_password: "<max_duration_since_last_push>"
```

#### `type`

```yaml
db_config:
  type: sqlite
```

The `type` of database to use. It can be:

- `sqlite`
- `mysql`
- `postgresql`
- `pgx`

#### `db_path`

```yaml
db_config:
  type: sqlite
  db_path: "/var/lib/crowdsec/data/crowdsec.db
```

The path to the database file (only if the type of database is `sqlite`)

#### `user`

```yaml
db_config:
  type: mysql|postgresql|pgx

  user: foo
```
The username to connect to the database (only if the type of database is `mysql` or `postgresql`)

#### `password`

```yaml
db_config:
  type: mysql|postgresql|pgx

  password: foobar
```
The password to connect to the database (only if the type of database is `mysql` or `postgresql`)

#### `db_name`

```yaml
db_config:
  type: mysql|postgresql|pgx

  db_name: crowdsec
```
The database name to connect to (only if the type of database is `mysql` or `postgresql`)

#### `db_host`

```yaml
db_config:
  type: mysql|postgresql|pgx

  user: foo
```
The host to connect to (only if the type of database is `mysql` or `postgresql`)

#### `db_port`

```yaml
db_config:
  type: mysql|postgresql|pgx

  user: foo
```
The port to connect to (only if the type of database is `mysql` or `postgresql`)


```yaml
db_config:
  type: postgresql

  sslmode: require
```
Require or disable ssl connection to database (only if the type of database is `postgresql`). See [PostgreSQL SSL modes](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS) for possible values.

#### `max_open_conns`

```yaml
db_config:
  type: mysql|postgresql|pgx|sqlite
  max_open_conns: 100
```
Maximum number of open connections to the database.

Defaults to 100. Set to 0 for unlimited connections.

#### `flush`

```yaml
flush:
  max_items: <nb_max_alerts_in_database>
  max_age: <max_alerts_age_in_database>
  bouncers_autodelete:
    cert: "<max_duration_since_last_pull>"
    api_key: "<max_duration_since_last_pull>"
  agents_autodelete:
    cert: "<max_duration_since_last_push>"
    login_password: "<max_duration_since_last_push>"
```

#### `max_items`
> int

Number max of alerts in database.

#### `max_age`
> string

Alerts retention time.

Supported units:

 - `s`: seconds

 - `m`: minutes

 - `h`: hours

 - `d`: days

#### `bouncers_autodelete`

##### `cert`

Bouncers authenticated using TLS certificate will be deleted after `duration` without any requests.

Supported units are the same as for `max_age`

##### `api_key`

Bouncers authenticated using API key auth will be deleted after `duration` without any requests.

Supported units are the same as for `max_age`

#### `agents_autodelete`

##### `cert`

Agents authenticated using TLS certificate will be deleted after `duration` without any requests and if there is no active alerts for them.

Supported units are the same as for `max_age`


##### `login_password`

Agents authenticated using login/password will be deleted after `duration` without any requests and if there is no active alerts for them.

Supported units are the same as for `max_age`


### `api`

The api section is used by both `cscli`, `crowdsec` and the local API.

```yaml
api:
  client:
    insecure_skip_verify: "(true|false)"
    credentials_path: "<path_to_local_api_client_credential_file>"
  server:
    log_level: "(error|info|debug|trace>"
    listen_uri: "<listen_uri>" # host:port
    profiles_path: "<path_to_profile_file>"
    use_forwarded_for_headers: "(true|false)"
    console_path: <path_to_console_file>
    online_client:
      credentials_path: "<path_to_crowdsec_api_client_credential_file>"
    tls:
      cert_file: "<path_to_certificat_file>"
      key_file: "<path_to_certificat_key_file>"
      client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequireAndVerifyClientCert"
      ca_cert_path: "<path_to_ca_cert_file>"
      agents_allowed_ou: # List of allowed Organisational Unit for the agents
       - agents_ou
      bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
       - bouncers_ou
      crl_path: "<path_to_crl_file>"
      cache_expiration: "<cache_duration_for_revocation_check>"
      
```

#### `client`

The client subsection is used by `crowdsec` and `cscli` to read and write decisions to the local API.

```yaml
client:
  insecure_skip_verify: "(true|false)"
  credentials_path: "<path_to_local_api_client_credential_file>"
```

##### `insecure_skip_verify`
>bool

Allows the use of https with self-signed certificates.

##### `credentials_path`
>string

Path to the credential files (contains API url + login/password).

#### `server`

The `server` subsection is the local API configuration.

```yaml
server:
  log_level: (error|info|debug|trace)
  listen_uri: <listen_uri> # host:port
  profiles_path: <path_to_profile_file>
  use_forwarded_for_headers: (true|false)
  trusted_ips: # IPs or IP ranges which should have admin API access
    #- 127.0.0.1
    #- ::1
    #- 10.0.0.0/24
  console_path: <path_to_console_file>
  online_client:
    credentials_path: <path_to_crowdsec_api_client_credential_file>
  tls:
    cert_file: <path_to_certificat_file>
    key_file: <path_to_certificat_key_file>
    client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequestAndVerifyClientCert"
      ca_cert_path: "<path_to_ca_cert_file>"
      agents_allowed_ou: # List of allowed Organisational Unit for the agents
       - agents_ou
      bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
       - bouncers_ou
      crl_path: "<path_to_crl_file>"
      cache_expiration: "<cache_duration_for_revocation_check>"
```

##### `listen_uri`
> string

Address and port listen configuration, the form `host:port`.

##### `profiles_path`
> string

The path to the profiles configuration.

##### `console_path`
> string

The path to the console configuration.

##### `use_forwarded_for_headers`
> string

Allow the usage of `X-Forwarded-For` or `X-Real-IP` to get the client IP address. Do not enable if you are not running the LAPI behind a trusted reverse-proxy or LB.

##### `online_client`

Configuration to push signals and receive bad IPs from Crowdsec API.

```yaml
online_client:
  credentials_path: "<path_to_crowdsec_api_client_credential_file>"
```

###### `credentials_path`
> string

Path to a file containing credentials for the Central API.

##### `tls`

if present, holds paths to certs and key files.

```yaml
tls:
  cert_file: "<path_to_certificat_file>"
  key_file: "<path_to_certificat_key_file>"
  client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequireAndVerifyClientCert"
  ca_cert_path: "<path_to_ca_cert_file>"
  agents_allowed_ou: # List of allowed Organisational Unit for the agents
    - agents_ou
  bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
    - bouncers_ou
  crl_path: "<path_to_crl_file>"
  cache_expiration: "<cache_duration_for_revocation_check>"

```

###### `cert_file`
> string

Path to certificate file.

###### `key_file`
> string

Path to certficate key file.

###### `client_verification`

Whether LAPI should require or not a client certificate for authentication.

Supported values mirror the ones available in the [golang TLS library](https://pkg.go.dev/crypto/tls#ClientAuthType).

Default to `VerifyClientCertIfGiven` which will allow connection without certificate or require a valid client certificate if one is provided

:::warning

Crowdsec supports all `ClientAuthType` value from the go TLS library for sake of completness, but using any value other than `NoClientCert` (completly disable authentication with certificates), `VerifyClientCertIfGiven` (only use the certificate if provided) or `RequireAndVerifyClientCert` (only allows certificate authentication and disable password/API key auth) is insecure and must not be used.

:::

###### ca_cert_path

Path to the CA certificates used to sign the client private keys.

Only required if using TLS auth and if the system does not trust the CA.

If not set and if the system does not trust the CA, all TLS authenticated requests will fail.

###### agents_allowed_ou

List of Organizational Unit allowed for the agents.

If not set, no agents will be able to authenticate with TLS.

###### bouncers_allowed_ou

List of Organizational Unit allowed for the bouncers.

If not set, no bouncers will be able to authenticate with TLS.

###### crl_path

Path to the certificate revocation list of the CA.

Optional. If not set, only OCSP revocation check will be performed (only if the client certificate contains an OCSP URL).

##### cache_expiration

How log to cache the result of a revocation check.

Defaults to 1h.

The format must be compatible with golang [time.Duration](https://pkg.go.dev/time#ParseDuration)

##### `trusted_ips`
> list

IPs or IP ranges which have admin access to API. The APIs would still need to have API keys.
127.0.0.1 and ::1 are always given admin access whether specified or not.

### `prometheus`

This section is used by local API and crowdsec.

```yaml
prometheus:
  enabled: "(true|false)"
  level: "(full|aggregated)"
  listen_addr: "<listen_interface>"
  listen_port: "<listen_port>"
```


#### `enabled`
> bool

Allows to enable/disable prometheus instrumentation.

#### `level`
> string

Can be `full` (all metrics) or `aggregated` (to allow minimal metrics that will keep cardinality low).

#### `listen_addr`
> string

Prometheus listen interface.

Can be set to `0.0.0.0` to listen to all interfaces.

#### `listen_port`
> int

Prometheus listen port.

