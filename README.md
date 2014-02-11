# Hubiquitus logger mongo explorer

This module provides a binary that launches a webapp to query logs produced with `hubiquitus-logger-mongo`.

Install the module with :

    $ npm install -g hubiquitus-logger-mongo-explorer

Note : the `-g` option needs root privileges.

The provided executable is `h-mongo-explorer`.
The available options are :

  - -f, --file [path]  File containing expected results
  - -h, --help                output usage information
  - -V, --version             output the version number
  - -p, --port [n]            HTTP port
  - -d, --debug               Debug
  - --mongo-host [str]        Mongo host
  - --mongo-port [n]          Mongo port
  - --mongo-dbname [str]      Mongo dbname
  - --mongo-collection [str]  Mongo collection

Screenshot :

![Logs explorer](https://raw.github.com/hubiquitus-addons/hubiquitus-logger-mongo-explorer/master/screenshots/interface.png)
