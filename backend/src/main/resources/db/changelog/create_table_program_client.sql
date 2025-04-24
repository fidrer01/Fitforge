create table program_client (
    program_id int not null,
    client_id int not null,
    primary key (program_id, client_id),
    foreign key (program_id) references program(id),
    foreign key (client_id) references client(id)
);
