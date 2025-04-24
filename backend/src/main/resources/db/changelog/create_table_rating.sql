create table rating (
    id              int             not null        primary key     auto_increment,
    trainer_id      int             not null,
    score           int             not null,
    foreign key (trainer_id) references trainer (id) on delete cascade
);