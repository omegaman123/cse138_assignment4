#!/usr/bin/env bash

addr1="10.10.0.2:13800"
addr2="10.10.0.3:13800"
addr3="10.10.0.4:13800"

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue14","causal-context":{"clock":1,"key":"Key1"}}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key1

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue13","causal-context":{"clock":1,"key":"Key2"}}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key2

curl --request   PUT                                 \
     --header    "Content-Type: application/json"    \
     --data      '{"value": "sampleValue12","causal-context":{"clock":1,"key":"Key3"}}'          \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key3

