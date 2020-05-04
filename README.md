# argus-keepalive-test

## Quick Start

1. Run ```npm install``` and then ```npm start ``` to start the sample API server.
2. Run
    ```
    pip install -r requirement.txt
    ```
    and then,
    ```
    locust -f ./test/stress_test.py --host=http://localhost:3030
    ```
    to strat the load testing server.
3. Go to ```http://localhost:8089``` and key in the needed parameters to start the load testing.

