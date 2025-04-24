create table blog (
                      id              int auto_increment primary key,
                      blog_type       varchar(400) not null,
                      title           varchar(400) not null,
                      header_text     TEXT not null,
                      main_text       TEXT not null,
                      file_id         BIGINT,
                      trainer_id      int not null,
                      foreign key (file_id) references file_entity(id),
                      foreign key (trainer_id) references trainer(id)
);
