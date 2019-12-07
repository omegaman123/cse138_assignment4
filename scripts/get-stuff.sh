#!/usr/bin/env bash


curl --request   GET                                 \
     --header    "Content-Type: application/json"    \         \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key1

curl --request   GET                                 \
     --header    "Content-Type: application/json"    \         \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key2

curl --request   GET                                 \
     --header    "Content-Type: application/json"    \         \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key3

curl --request   GET                                 \
     --header    "Content-Type: application/json"    \         \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key4

curl --request   GET                                 \
     --header    "Content-Type: application/json"    \         \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key5

curl --request   GET                                 \
     --header    "Content-Type: application/json"    \         \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/keys/Key6

