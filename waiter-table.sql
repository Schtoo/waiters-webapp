drop table if exists waiters, daysofweek, shifts cascade;
create table waiters(
    id serial not null primary key,
    waiter text not null
);

create table daysofweek(
    id serial not null primary key,
    day text not null
);

create table shifts(
    id serial not null primary key,
    day_id int not null,
    waiter_id int not null,
    foreign key (day_id) REFERENCES daysofweek(id),
    foreign key (waiter_id) REFERENCES shifts(id)
);

INSERT INTO daysofweek (day) values('Monday');
INSERT INTO daysofweek (day) values('Tuesday');
INSERT INTO daysofweek (day) values('Wednesday');
INSERT INTO daysofweek (day) values('Thursday');
INSERT INTO daysofweek (day) values('Friday');
INSERT INTO daysofweek (day) values('Saturday');
INSERT INTO daysofweek (day) values('Sunday');

INSERT INTO waiters (waiter) values('Vusi');
INSERT INTO waiters (waiter) values('Schtoo');
INSERT INTO waiters (waiter) values('Greg');
INSERT INTO waiters (waiter) values('Ace');
INSERT INTO waiters (waiter) values('Ayaz');
INSERT INTO waiters (waiter) values('Londi');
INSERT INTO waiters (waiter) values('Tsoman')
