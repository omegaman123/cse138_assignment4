#!/usr/bin/env bash


curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store/key-count

curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13803/kv-store/key-count

curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13804/kv-store/key-count

curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13805/kv-store/key-count





curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13802/kv-store

curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13803/kv-store


curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13804/kv-store

curl --request GET                                   \
     --header "Content-Type: application/json"       \
     --write-out "%{http_code}\n"                    \
     http://localhost:13805/kv-store