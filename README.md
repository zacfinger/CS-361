# CS-361

## Create the tables
```
CREATE TABLE events (id int NOT NULL AUTO_INCREMENT, title varchar(63), owning_user_id int, calendar_id int, start_republic_year int, start_republic_month int, start_republic_day int, start_republic_hour int, start_republic_minute int, end_republic_year int, end_republic_month int, end_republic_day int, end_republic_hour int, end_republic_minute int, location_id int, description int, is_full_day int, primary key (id));
```

## Helpful resources
https://medium.com/good-robot/use-visual-studio-code-remote-ssh-sftp-without-crashing-your-server-a1dc2ef0936d
