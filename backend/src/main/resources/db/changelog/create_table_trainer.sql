create table trainer (
    id                  int             not null        primary key         auto_increment,
    name                varchar(30)     not null,
    birth_date          date            not null,
    gender              varchar(30)     not null,
    qualification       varchar(30)     not null,
    phone_number        varchar(30)     not null,
    rating              decimal(3,2)    not null,
    login_id            int             not null,
    file_id             bigint,

    foreign key (gender) references gender (id),
    foreign key (qualification) references qualification (id),
    foreign key (login_id) references login (id),
    foreign key (file_id) references file_entity (id) on delete set null
);