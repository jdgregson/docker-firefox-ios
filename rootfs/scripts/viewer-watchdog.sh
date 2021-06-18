#!/usr/bin/with-contenv sh

while true; do
    netstat -atun | grep -e "\d 127\.0\.0\.1:5900" | grep EST | wc -l > /opt/novnc/viewers
    sleep 3
done