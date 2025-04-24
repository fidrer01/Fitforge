create table login (
    id          int          not null        primary key    auto_increment,
    email       varchar(100)  not null  unique,
    password    varchar(255)  not null,
    role        varchar(30)   not null
);