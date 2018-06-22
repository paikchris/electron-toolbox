#!/bin/bash

# until webpack-dev-server --port 8081 | grep -m 1 "Compiled successfully"; do : electron . ; done
electron . & webpack-dev-server --port 8081 

exit_script() {
    echo "Printing something special!"
    echo "Maybe executing other commands!"
    trap - SIGINT SIGTERM # clear the trap
    kill -- -$$ # Sends SIGTERM to child/sub processes
}

trap exit_script SIGINT SIGTERM