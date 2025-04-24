package hu.fitness.enumeration;

public enum Permission {
    //trainer
    CREATE_PROGRAM,
    UPDATE_PROGRAM,
    DELETE_PROGRAM,
    LIST_PROGRAMS_CLIENTS,
    PATCH_TRAINER,
    UPLOAD_TRAINER_IMAGE,
    UPLOAD_BLOG_IMAGE,
    CREATE_BLOG,
    UPDATE_BLOG,
    DELETE_BLOG,

    //client
    ADD_RATING,
    PATCH_CLIENT,
    JOIN_PROGRAM,
    LEAVE_PROGRAM,
    LIST_CLIENTS_PROGRAMS,

    //admin
    GET_CLIENT,
    LIST_CLIENTS,
    DELETE_USER
}
