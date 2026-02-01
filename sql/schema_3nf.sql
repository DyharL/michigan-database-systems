-- 3NF Relational Schema with Referential Integrity and Cascade
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL,
    building VARCHAR(64)
);

CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    code VARCHAR(16) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    department_id INT NOT NULL REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE roster (
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    role INT DEFAULT 0, -- 0: Student, 1: TA, 2: Instructor
    PRIMARY KEY (student_id, course_id)
);
