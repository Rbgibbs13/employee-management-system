 INSERT INTO department (department_name)
 VALUES ("Meat"),
        ("Store"),
        ("Stocking");

INSERT INTO role (title, salary, department_id)
VALUES ("Butcher", 25.55, 1),
       ("Butcher Manager", 35.25, 1),
       ("Cashier", 20.25, 2),
       ("Help Desk", 20.50, 2),
       ("Head Cashier", 25.00, 2),
       ("Store Manager", 45.75, 2),
       ("Stocker", 20.75, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Jim", "Bean", 1, null),
       (2, "Sally", "Mae", 1, null),
       (3, "John", "Doe", 2, null),
       (4, "Jane", "Deer", 3, null),
       (5, "Francisco", "Alvarez", 3, null),
       (6, "Lexi", "Gibbs", 3, null),
       (7, "Laura", "Alina", 4, null),
       (8, "Ivka", "Olaya", 4, null),
       (9, "Prakash", "Suraj", 5, null),
       (10, "Waltraut", "Dardan", 6, null),
       (11, "Blanka", "Crocetta", 7, null),
       (12, "Clara", "Iris", 7, null),
       (13, "Bevin", "Beorthric", 7, null);