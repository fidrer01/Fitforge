create table allocate (
    id              int             not null        primary key         auto_increment,
    login_id        int             not null,
    permission_id   varchar(30)     not null,

    foreign key (login_id) references login (id),
    foreign key (permission_id) references permission (id)

);