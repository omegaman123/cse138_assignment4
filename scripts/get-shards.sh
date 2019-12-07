#!/usr/bin/env bash

curl --request   GET                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/shards


curl --request   GET                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/shards/1


curl --request   GET                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/shards/2