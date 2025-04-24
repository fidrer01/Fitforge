create table program (
    id                  int             not null        primary key auto_increment,
    trainer_id          int             not null,
    start_time          datetime        not null,
    end_time            datetime        not null,
    price               int             not null,
    capacity            int             not null,
    program_type        varchar(30)     not null,
    status              varchar(30)     not null,

    foreign key (trainer_id) references trainer (id),
    foreign key (status) references programstatus (id),
    foreign key (program_type) references programtype (id)
);