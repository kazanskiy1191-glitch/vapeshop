@echo off
powershell -Command "Start-Process cmd -ArgumentList '/c cd /d \"C:\Users\user\Desktop\VapeShop_OptTeamBuy_33\" ^&^& ^"%~dp0start-server-admin.bat^"' -Verb RunAs"
