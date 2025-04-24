create table file_entity (
    id          bigint          not null           auto_increment          primary key,
    file_name   varchar(255)    not null,
    file_type   varchar(255),
    data        longblob
);