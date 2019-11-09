#!/usr/bin/env bash

addr1="10.10.0.2:13800"
addr2="10.10.0.3:13800"
addr3="10.10.0.4:13800"

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key1

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key2

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key3

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key4

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key5

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key6




curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/blah

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/blah12

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/blah1

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/blahblah

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/blahhalb1

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/hwfefwe




curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/lllflf

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/ollll

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/pllle

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/phgfds

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/mllllme

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue"}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/mark
