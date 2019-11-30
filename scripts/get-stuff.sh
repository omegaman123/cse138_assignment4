#!/usr/bin/env bash


curl --request   GET                                 \
     --header    "Content-Type: application/json"    \         \
     --write-out "%{http_code}\n"                    \
     http://localhost:13800/kv-store/keys/Key1