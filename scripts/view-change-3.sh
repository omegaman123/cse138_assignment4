#!/usr/bin/env bash


curl --request PUT                                   \
     --header "Content-Type: application/json"       \
     --data '{"view": ["10.10.0.2:13800","10.10.0.3:13800","10.10.0.4:13800","10.10.0.5:13800","10.10.0.6:13800","10.10.0.7:13800"],
                     "repl-factor":3}'               \
                                                     \
     --write-out "%{http_code}\n"                    \
     http://localhost:13800/kv-store/view-change