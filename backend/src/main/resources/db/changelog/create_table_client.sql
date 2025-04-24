create table client (
    id              int             not null        primary key        auto_increment,
    name            varchar(30)     not null,
    birth_date      date            not null,
    gender       varchar(30)     not null,
    phone_number    varchar(30)     not null,
    login_id        int             not null,

    foreign key (gender) references gender (id),
    foreign key (login_id) references login (id)
);