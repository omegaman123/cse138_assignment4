#!/usr/bin/env bash

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue","key":"Key2","clock":2}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13800/kv-store/gossip