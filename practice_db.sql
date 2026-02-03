CREATE DATABASE practice_db;
USE practice_db;

CREATE TABLE city (
  city_id INT PRIMARY KEY,
  city_name VARCHAR(50) NOT NULL
);
CREATE TABLE student (
  student_id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  age TINYINT UNSIGNED,
  city_id INT,
  marks INT CHECK (marks >= 0 AND marks <= 100),
  FOREIGN KEY (city_id) REFERENCES city(city_id)
);
CREATE TABLE course (
  course_id INT PRIMARY KEY,
  course_name VARCHAR(50) NOT NULL
);
CREATE TABLE enrollment (
  enroll_id INT PRIMARY KEY,
  student_id INT,
  course_id INT,
  FOREIGN KEY (student_id) REFERENCES student(student_id),
  FOREIGN KEY (course_id) REFERENCES course(course_id)
);
INSERT INTO city VALUES
(1, 'Delhi'),
(2, 'Mumbai'),
(3, 'Bangalore');
INSERT INTO student VALUES
(1, 'Aman', 20, 1, 85),
(2, 'Riya', 22, 2, 92),
(3, 'Kabir', 19, 1, 60),
(4, 'Neha', 21, 3, 75),
(5, 'Arjun', 23, 2, 45);
INSERT INTO course VALUES
(1, 'SQL'),
(2, 'Python'),
(3, 'Web Dev');
INSERT INTO enrollment VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 3, 3),
(5, 4, 2),
(6, 5, 1);

select * from city;
select name, marks from student;
select * from city;
select * from student where marks>80;
select * from student where marks between 80 and 90;
-- select * from student where city_id not in (
-- select city_id from city where name='Mumbai'
-- );
select * from student where name like 'A%';
select * from student where marks in(45,86);
select * from student where marks>70 and city_id=2;
select * from student where marks<50 or age>22;
select * from student where not marks >80;
select * from student order by marks desc limit 3;
update student set marks=marks+5 where name='Aman';
select* from student where name='Aman b';           
update student set city_id=2 where name='Aman';
update student set name="Aman b" where name='Aman';
select * from student where marks>33 order by name desc limit 3;
update student set name = 'riya g' where name = 'Riya';
update student set city_id=3 where name ='Kabir';
delete from student where marks=45;
select * from student;
delete from enrollment where student_id in(
select student_id from student where marks=45
);
delete from student where marks=45;
select * from student;
SET SQL_SAFE_UPDATES = 0;
update student set city_id=1 where name='Aman b';
-- aggregate functions 
select count(*) as total_students from student;
select sum(marks) as total_marks from student;
select avg(marks) as avg_marks from student;
select max(marks) as highest_marks from student;
select city_id,max(marks) as  lowest_marks from student group by city_id;
select min(marks) as lowest_marks from student;
select count(city_id) as del from student where city_id=1;
select * from student;

select city_id, count(*) as total_student from student group by city_id;
select city_id,avg(marks) as avg_marks from student group by city_id;
select age, count(*) as age_count from student group by age;
select city_id,max(marks) as max_marks from student group by city_id;
select city_id, count(*) as total from student group by city_id having count(*)>1;
select city_id, avg(marks) as avg from student group by city_id having avg(marks)>70;
select age,count(*) as agee from student group by age having count(*)=1;
-- alter--
alter table student add email varchar(70) unique;  
alter table student modify marks tinyint;
alter table student add constraint chk_marks check(marks between 0 and 100);
alter table student drop column age;
alter table student rename column name to stu_name;
select * from student;
update student set email = concat(stu_name,student_id,'gmail.com');
update student set stu_name='Aman' where stu_name='Aman b';
update student set stu_name='Riya' where stu_name='Riya g';
alter table student add constraint age_check check(age>=18);
alter table student add column age tinyint default(18);
update student set age=19;
alter table student modify age tinyint unsigned default 18;
alter table student drop foreign key fk_student_city;
alter table student add constraint fk_student_city foreign key (city_id) references city(city_id) on delete cascade on update cascade;
SHOW CREATE TABLE enrollment;
start transaction;
delete from student;
rollback;
alter table enrollment drop foreign key enrollment_ibfk_1;
alter table enrollment add constraint enrollment_ibfk_1 foreign key(student_id) references student(student_id) on delete cascade;
select * from student where age is not null;
select * from student where age is null;
insert into student (student_id, stu_name, city_id, marks,email,age) values
(6,'Gupta',2,72,null,null);
select stu_name, ifnull(age,11);
SELECT *, IFNULL(age, 18) AS age_or_default FROM student;
select * from student where marks> ( select avg(marks) as avg_marks from student);
select * from student where city_id in (select city_id from city where city_name='Delhi');

select stu_name, (select city_name from city where city.city_id=student.city_id) as city from student;
select temp.city_id,count(*) as stud_count from (select city_id from student)as temp group by temp.city_id;


-- level 1--  
-- select stu_name, avg(marks) as avg_mark from student where marks>avg(marks);
-- select stu_name from student where marks>avg(marks);
select stu_name from student where marks>(select avg(marks) as avg_mark from student);
select count(*) from student where city_id=1;
select * from student where age is not null;
select * from student where marks<80 order by marks desc limit 2;
select max(marks) from student;
select * from student where marks= (select max(marks) from student);
-- select city_id from student where (select city_id,count(*) from student where city_id>1 group by city_id);
select city_id,count(*) from student group by city_id having count(*)>1;
-- select * from student where age>20 (select avg(marks) from student);
-- select * from student where age>20 in (select marks, avg(marks) from student);
select stu_name, avg(marks) from student where age>20;--
select stu_name from student where (select avg(marks) from student where age>20); 
select avg(marks) as avg_mark from student where age>20;
select * from student;
update student set age=22 where stu_name='Aman';
SELECT stu_name, marks, (SELECT AVG(marks) FROM student WHERE age > 20) AS avg_marks
FROM student
WHERE age > 20;
select stu_name,marks,(select avg(marks) from student where age>20) as avg_marks from student where age>20;
select * from student where marks in(select min(marks) from student);
select name,marks from student where marks> (select avg(marks) from student);
select city_id, count(*) from student group by city_id having city_id=1;
SET SQL_SAFE_UPDATES = 0;
update student set marks=marks+5 where marks<(select max_marks from(select max(marks) as max_marks from student) as t);
select * from student where age is not null and marks between 70 and 90;
delete from student where marks<(select min_marks from(select min(marks)+10 as min_marks from student)as t);

select s.name,c.city_name from student s inner join city c on s.city_id=c.city_id where c.city_name='Mumbai';
select s.name,c.city_name from student s inner join city c on s.city_id=c.city_id where c.city_name='Mumbai';
select s.name,c.city_name from student s inner join city c on s.city_id=c.city_id
where s.marks>90;
select s.name,c.city_name from student s inner join city c on c.city_id=s.city_id 
where c.city_name='Bangalore';
select s.name,c.city_name from student s inner join city c on 
c.city_id=s.city_id where c.city_name='delhi' and s.marks>70;
select s.name,s.marks,c.city_name from student s inner join city c on
c.city_id=s.city_id;
select s.name,c.city_name from student s inner join city c on
c.city_id=s.city_id where c.city_name <>'mumbai';
select s.name,c.city_name from student s left join city c on 
s.city_id=c.city_id where c.city_id is null;























