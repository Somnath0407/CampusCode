// Source data for the SQL problem bank. Each problem's test cases carry a
// `setup` (CREATE TABLE + INSERT statements) instead of a plain stdin value —
// see buildJudge0Payload in src/utils/problemUtillity.js for why: Judge0's
// SQLite runner (language 82) just executes a script and prints the last
// statement's result set, so the schema/data has to be part of the script,
// not fed in as separate stdin.
//
// `output` fields are intentionally left null here — scripts/verifySqlProblems.js
// fills them in by actually running `setup + referenceSolution` through the
// real Judge0 API and capturing the real stdout, so the stored "expected
// output" is guaranteed byte-for-byte correct against the engine that will
// grade real submissions, not hand-computed and possibly wrong.

const problems = [
    {
        title: "Second Highest Salary",
        difficulty: "medium",
        description: `Find the second highest distinct salary from the Employee table. If it does not exist, return NULL.

Table: Employee(id INT, salary INT)`,
        starter: "SELECT\n    -- Write your query here\n;",
        reference: `SELECT (
    SELECT salary
    FROM Employee
    GROUP BY salary
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
        tests: [
            { setup: `CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,100),(2,200),(3,300);`, explanation: "Distinct salaries descending are 300, 200, 100 — second highest is 200." },
            { setup: `CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,100),(2,100),(3,100);` },
            { setup: `CREATE TABLE Employee (id INT, salary INT);` },
            { setup: `CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,500),(2,500),(3,400),(4,300);` },
        ],
    },
    {
        title: "Nth Highest Salary",
        difficulty: "medium",
        description: `Return the Nth highest distinct salary from the Employee table. Return NULL if fewer than N distinct salaries exist.

This platform runs SQL as plain queries rather than stored functions, so N is provided via a one-row Parameter table.

Tables: Employee(id INT, salary INT), Parameter(n INT)`,
        starter: "SELECT\n    -- Write your query here\n;",
        reference: `SELECT (
    SELECT salary
    FROM Employee
    GROUP BY salary
    ORDER BY salary DESC
    LIMIT 1 OFFSET (SELECT n - 1 FROM Parameter)
) AS NthHighestSalary;`,
        tests: [
            { setup: `CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,100),(2,200),(3,300);
CREATE TABLE Parameter (n INT);
INSERT INTO Parameter VALUES (2);`, explanation: "After removing duplicates and sorting descending, the 2nd value is 200." },
            { setup: `CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,100),(2,200),(3,200),(4,300);
CREATE TABLE Parameter (n INT);
INSERT INTO Parameter VALUES (2);` },
            { setup: `CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,100),(2,200);
CREATE TABLE Parameter (n INT);
INSERT INTO Parameter VALUES (3);` },
            { setup: `CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,-10),(2,-20),(3,-30);
CREATE TABLE Parameter (n INT);
INSERT INTO Parameter VALUES (1);` },
        ],
    },
    {
        title: "Rank Scores",
        difficulty: "medium",
        description: `Rank all scores in the Scores table in descending order. Equal scores must have the same rank, and there must be no gaps between ranks.

Table: Scores(id INT, score DECIMAL(3,2))`,
        starter: "SELECT\n    score,\n    -- Add rank here\nFROM Scores;",
        reference: `SELECT score,
       DENSE_RANK() OVER (ORDER BY score DESC) AS \`rank\`
FROM Scores
ORDER BY score DESC;`,
        tests: [
            { setup: `CREATE TABLE Scores (id INT, score DECIMAL(3,2));
INSERT INTO Scores VALUES (1,3.50),(2,3.65),(3,4.00),(4,3.85),(5,4.00);`, explanation: "Two scores tie for rank 1 (4.00); ranks stay consecutive after that." },
            { setup: `CREATE TABLE Scores (id INT, score DECIMAL(3,2));
INSERT INTO Scores VALUES (1,3.00),(2,3.00),(3,3.00);` },
            { setup: `CREATE TABLE Scores (id INT, score DECIMAL(3,2));
INSERT INTO Scores VALUES (1,5.00);` },
            { setup: `CREATE TABLE Scores (id INT, score DECIMAL(3,2));
INSERT INTO Scores VALUES (1,10.00),(2,10.00),(3,9.00),(4,8.00),(5,8.00),(6,7.00);` },
        ],
    },
    {
        title: "Consecutive Numbers",
        difficulty: "medium",
        description: `Find all numbers in the Logs table that appear at least three times consecutively (by id order).

Table: Logs(id INT, num INT)`,
        starter: "SELECT DISTINCT num AS ConsecutiveNums\nFROM Logs\nWHERE ...;",
        reference: `SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l2.id = l1.id + 1 AND l2.num = l1.num
JOIN Logs l3 ON l3.id = l1.id + 2 AND l3.num = l1.num
ORDER BY ConsecutiveNums;`,
        tests: [
            { setup: `CREATE TABLE Logs (id INT, num INT);
INSERT INTO Logs VALUES (1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2);`, explanation: "The value 1 appears in rows 1,2,3 consecutively." },
            { setup: `CREATE TABLE Logs (id INT, num INT);
INSERT INTO Logs VALUES (1,7),(2,7),(3,7),(4,7);` },
            { setup: `CREATE TABLE Logs (id INT, num INT);
INSERT INTO Logs VALUES (1,1),(2,1),(3,2),(4,1),(5,1);` },
            { setup: `CREATE TABLE Logs (id INT, num INT);
INSERT INTO Logs VALUES (1,1),(2,1),(3,1),(4,2),(5,2),(6,2);` },
        ],
    },
    {
        title: "Department Highest Salary",
        difficulty: "medium",
        description: `Find employees who have the highest salary in each department. Include ties.

Tables: Employee(id INT, name TEXT, salary INT, departmentId INT), Department(id INT, name TEXT)`,
        starter: "SELECT ... FROM Employee e JOIN Department d ...;",
        reference: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
)
ORDER BY d.name, e.name;`,
        tests: [
            { setup: `CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT);
INSERT INTO Employee VALUES (1,'Joe',85000,1),(2,'Max',90000,1),(3,'Henry',80000,2),(4,'Sam',60000,2),(5,'Jane',80000,2);
CREATE TABLE Department (id INT, name TEXT);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');`, explanation: "Henry and Jane tie for the highest salary in Sales." },
            { setup: `CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT);
INSERT INTO Employee VALUES (1,'Ann',50000,1);
CREATE TABLE Department (id INT, name TEXT);
INSERT INTO Department VALUES (1,'HR');` },
            { setup: `CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT);
INSERT INTO Employee VALUES (1,'A',100,1),(2,'B',100,1),(3,'C',90,1);
CREATE TABLE Department (id INT, name TEXT);
INSERT INTO Department VALUES (1,'Eng');` },
            { setup: `CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT);
INSERT INTO Employee VALUES (1,'A',100,1),(2,'B',200,2),(3,'C',150,1);
CREATE TABLE Department (id INT, name TEXT);
INSERT INTO Department VALUES (1,'Eng'),(2,'Sales');` },
        ],
    },
    {
        title: "Game Play Analysis III",
        difficulty: "medium",
        description: `For every player and date, report the total number of games played by that player up to and including that date.

Table: Activity(player_id INT, device_id INT, event_date DATE, games_played INT)`,
        starter: "SELECT player_id, event_date, ... FROM Activity;",
        reference: `SELECT player_id, event_date,
       SUM(games_played) OVER (
           PARTITION BY player_id
           ORDER BY event_date
       ) AS games_played_so_far
FROM Activity
ORDER BY player_id, event_date;`,
        tests: [
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (1,2,'2016-03-01',5),(1,2,'2016-03-02',6),(2,3,'2017-06-25',1);`, explanation: "Player 1's running total is 5, then 5+6=11." },
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (1,1,'2020-01-01',5),(1,1,'2020-01-02',0),(1,1,'2020-01-03',10);` },
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (1,1,'2020-01-01',5),(2,1,'2020-01-01',3),(1,1,'2020-01-02',2),(2,1,'2020-01-02',4);` },
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (9,1,'2020-05-05',7);` },
        ],
    },
    {
        title: "Game Play Analysis IV",
        difficulty: "medium",
        description: `Find the fraction of players who logged in again exactly one day after their first login date. Round to 2 decimal places.

Table: Activity(player_id INT, device_id INT, event_date DATE, games_played INT)`,
        starter: "SELECT ROUND(..., 2) AS fraction;",
        reference: `SELECT ROUND(
    1.0 * COUNT(DISTINCT a.player_id) /
    (SELECT COUNT(DISTINCT player_id) FROM Activity),
    2
) AS fraction
FROM Activity a
JOIN (
    SELECT player_id, MIN(event_date) AS first_date
    FROM Activity
    GROUP BY player_id
) f ON a.player_id = f.player_id
   AND a.event_date = date(f.first_date, '+1 day');`,
        tests: [
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (1,2,'2016-03-01',5),(1,2,'2016-03-02',6),(2,3,'2017-06-25',1);`, explanation: "Player 1 returned exactly one day later; player 2 did not. 1/2 = 0.50." },
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (1,1,'2020-01-01',3),(2,1,'2020-01-05',2),(3,1,'2020-02-01',1);` },
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (1,1,'2020-01-01',3),(1,1,'2020-01-02',3),(2,1,'2020-01-01',2),(2,1,'2020-01-02',2);` },
            { setup: `CREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);
INSERT INTO Activity VALUES (1,1,'2020-01-01',3),(2,1,'2020-01-01',3),(3,1,'2020-01-03',3);` },
        ],
    },
    {
        title: "Managers with at Least 5 Direct Reports",
        difficulty: "medium",
        description: `Find the names of managers who have at least 5 direct reports.

Table: Employee(id INT, name TEXT, department TEXT, managerId INT)`,
        starter: "SELECT name FROM Employee WHERE ...;",
        reference: `SELECT e.name
FROM Employee e
JOIN Employee r ON e.id = r.managerId
GROUP BY e.id, e.name
HAVING COUNT(r.id) >= 5
ORDER BY e.name;`,
        tests: [
            { setup: `CREATE TABLE Employee (id INT, name TEXT, department TEXT, managerId INT);
INSERT INTO Employee VALUES
(1,'John','D1',NULL),
(2,'A','D1',1),(3,'B','D1',1),(4,'C','D1',1),(5,'D','D1',1),(6,'E','D1',1);`, explanation: "John has exactly 5 direct reports." },
            { setup: `CREATE TABLE Employee (id INT, name TEXT, department TEXT, managerId INT);
INSERT INTO Employee VALUES
(1,'Mia','D1',NULL),
(2,'A','D1',1),(3,'B','D1',1),(4,'C','D1',1),(5,'D','D1',1);` },
            { setup: `CREATE TABLE Employee (id INT, name TEXT, department TEXT, managerId INT);
INSERT INTO Employee VALUES
(1,'Sam','D1',NULL),(2,'Tia','D2',NULL),
(3,'A','D1',1),(4,'B','D1',1),(5,'C','D1',1),(6,'D','D1',1),(7,'E','D1',1),(8,'F','D1',1),
(9,'A2','D2',2),(10,'B2','D2',2),(11,'C2','D2',2),(12,'D2x','D2',2),(13,'E2','D2',2),(14,'F2','D2',2);` },
        ],
    },
    {
        title: "Winning Candidate",
        difficulty: "medium",
        description: `Find the candidate who received the largest number of votes. Exactly one candidate wins.

Tables: Candidate(id INT, name TEXT), Vote(id INT, candidateId INT)`,
        starter: "SELECT ...;",
        reference: `SELECT c.name
FROM Candidate c
JOIN Vote v ON c.id = v.candidateId
GROUP BY c.id, c.name
ORDER BY COUNT(*) DESC
LIMIT 1;`,
        tests: [
            { setup: `CREATE TABLE Candidate (id INT, name TEXT);
INSERT INTO Candidate VALUES (1,'A'),(2,'B'),(3,'C');
CREATE TABLE Vote (id INT, candidateId INT);
INSERT INTO Vote VALUES (1,1),(2,2),(3,2),(4,2),(5,3),(6,3);`, explanation: "B has 3 votes, the highest." },
            { setup: `CREATE TABLE Candidate (id INT, name TEXT);
INSERT INTO Candidate VALUES (1,'A'),(2,'B');
CREATE TABLE Vote (id INT, candidateId INT);
INSERT INTO Vote VALUES (1,1);` },
            { setup: `CREATE TABLE Candidate (id INT, name TEXT);
INSERT INTO Candidate VALUES (1,'A'),(2,'B'),(3,'C');
CREATE TABLE Vote (id INT, candidateId INT);
INSERT INTO Vote VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,2),(12,3);` },
        ],
    },
    {
        title: "Get Highest Answer Rate Question",
        difficulty: "medium",
        description: `Return the question with the highest answer rate: (number of answer actions) / (number of show actions).

Table: SurveyLog(id INT, action TEXT, question_id INT, answer_id INT, q_num INT, timestamp INT)`,
        starter: "SELECT question_id AS survey_log FROM SurveyLog ...;",
        reference: `SELECT question_id AS survey_log
FROM SurveyLog
GROUP BY question_id
ORDER BY 1.0 * SUM(action = 'answer') / SUM(action = 'show') DESC
LIMIT 1;`,
        tests: [
            { setup: `CREATE TABLE SurveyLog (id INT, action TEXT, question_id INT, answer_id INT, q_num INT, timestamp INT);
INSERT INTO SurveyLog VALUES
(1,'show',1,NULL,1,100),(2,'show',1,NULL,1,101),(3,'answer',1,101,1,102),
(4,'show',1,NULL,1,103),(5,'answer',1,102,1,104),(11,'show',1,NULL,1,110),
(6,'show',2,NULL,2,105),(7,'answer',2,201,2,106),(8,'show',2,NULL,2,107),
(9,'answer',2,202,2,108),(10,'show',2,NULL,2,109);`, explanation: "Q1 rate=2/4=0.5, Q2 rate=2/3=0.667 — Q2 wins." },
            { setup: `CREATE TABLE SurveyLog (id INT, action TEXT, question_id INT, answer_id INT, q_num INT, timestamp INT);
INSERT INTO SurveyLog VALUES
(1,'show',5,NULL,1,1),(2,'show',5,NULL,1,2),(3,'show',5,NULL,1,3);` },
            { setup: `CREATE TABLE SurveyLog (id INT, action TEXT, question_id INT, answer_id INT, q_num INT, timestamp INT);
INSERT INTO SurveyLog VALUES
(1,'show',1,NULL,1,1),(2,'answer',1,1,1,2),
(3,'show',2,NULL,1,3),(4,'show',2,NULL,1,4),(5,'answer',2,2,1,5);` },
        ],
    },
    {
        title: "Count Student Number in Departments",
        difficulty: "medium",
        description: `Report each department and the number of students in it. Sort by student count descending, then department name ascending.

Tables: Student(student_id INT, student_name TEXT, gender TEXT, dept_id INT), Department(dept_id INT, dept_name TEXT)`,
        starter: "SELECT dept_name, ... FROM Student;",
        reference: `SELECT d.dept_name, COUNT(s.student_id) AS student_number
FROM Department d
LEFT JOIN Student s ON s.dept_id = d.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY student_number DESC, d.dept_name ASC;`,
        tests: [
            { setup: `CREATE TABLE Department (dept_id INT, dept_name TEXT);
INSERT INTO Department VALUES (1,'CS'),(2,'EE');
CREATE TABLE Student (student_id INT, student_name TEXT, gender TEXT, dept_id INT);
INSERT INTO Student VALUES (1,'A','M',1),(2,'B','F',1),(3,'C','M',2);`, explanation: "CS has 2 students, EE has 1." },
            { setup: `CREATE TABLE Department (dept_id INT, dept_name TEXT);
INSERT INTO Department VALUES (1,'Math');
CREATE TABLE Student (student_id INT, student_name TEXT, gender TEXT, dept_id INT);
INSERT INTO Student VALUES (1,'A','M',1);` },
            { setup: `CREATE TABLE Department (dept_id INT, dept_name TEXT);
INSERT INTO Department VALUES (1,'Bio'),(2,'Art'),(3,'CS');
CREATE TABLE Student (student_id INT, student_name TEXT, gender TEXT, dept_id INT);
INSERT INTO Student VALUES (1,'A','M',1),(2,'B','M',2),(3,'C','M',3),(4,'D','M',3),(5,'E','M',3);` },
        ],
    },
    {
        title: "Investments in 2016",
        difficulty: "medium",
        description: `Sum tiv_2016 for policies whose tiv_2015 value occurs more than once and whose (lat, lon) location is unique. Round to 2 decimals.

Table: Insurance(pid INT, tiv_2015 DECIMAL, tiv_2016 DECIMAL, lat DECIMAL, lon DECIMAL)`,
        starter: "SELECT ROUND(SUM(tiv_2016), 2) AS tiv_2016 FROM Insurance;",
        reference: `SELECT ROUND(SUM(tiv_2016), 2) AS tiv_2016
FROM Insurance
WHERE tiv_2015 IN (
    SELECT tiv_2015 FROM Insurance GROUP BY tiv_2015 HAVING COUNT(*) > 1
)
AND (lat, lon) IN (
    SELECT lat, lon FROM Insurance GROUP BY lat, lon HAVING COUNT(*) = 1
);`,
        tests: [
            { setup: `CREATE TABLE Insurance (pid INT, tiv_2015 DECIMAL, tiv_2016 DECIMAL, lat DECIMAL, lon DECIMAL);
INSERT INTO Insurance VALUES
(1,10,5,10,10),(2,20,20,20,20),(3,10,30,20,20),(4,10,40,40,40);`, explanation: "pid 1 and 4 share tiv_2015=10 and both have unique locations; sum of their tiv_2016 = 5+40=45." },
            { setup: `CREATE TABLE Insurance (pid INT, tiv_2015 DECIMAL, tiv_2016 DECIMAL, lat DECIMAL, lon DECIMAL);
INSERT INTO Insurance VALUES (1,5,100,1,1),(2,5,200,1,1);` },
            { setup: `CREATE TABLE Insurance (pid INT, tiv_2015 DECIMAL, tiv_2016 DECIMAL, lat DECIMAL, lon DECIMAL);
INSERT INTO Insurance VALUES (1,5,100,1,1),(2,7,200,2,2);` },
        ],
    },
    {
        title: "Friend Requests II: Who Has the Most Friends",
        difficulty: "medium",
        description: `Find the person with the largest number of friends.

Table: RequestAccepted(requester_id INT, accepter_id INT, accept_date DATE)`,
        starter: "SELECT id, num FROM ...;",
        reference: `WITH friends AS (
    SELECT requester_id AS id FROM RequestAccepted
    UNION ALL
    SELECT accepter_id AS id FROM RequestAccepted
)
SELECT id, COUNT(*) AS num
FROM friends
GROUP BY id
ORDER BY num DESC
LIMIT 1;`,
        tests: [
            { setup: `CREATE TABLE RequestAccepted (requester_id INT, accepter_id INT, accept_date DATE);
INSERT INTO RequestAccepted VALUES (1,2,'2016-06-03'),(2,3,'2016-06-08'),(2,4,'2016-06-09');`, explanation: "Person 2 appears in all three accepted friendships." },
            { setup: `CREATE TABLE RequestAccepted (requester_id INT, accepter_id INT, accept_date DATE);
INSERT INTO RequestAccepted VALUES (5,6,'2020-01-01'),(5,7,'2020-01-02');` },
            { setup: `CREATE TABLE RequestAccepted (requester_id INT, accepter_id INT, accept_date DATE);
INSERT INTO RequestAccepted VALUES (1,2,'2020-01-01'),(3,2,'2020-01-02'),(4,2,'2020-01-03'),(2,5,'2020-01-04');` },
        ],
    },
    {
        title: "Tree Node",
        difficulty: "medium",
        description: `Classify every node in the Tree table as Root, Inner, or Leaf.

Table: Tree(id INT, p_id INT)`,
        starter: "SELECT id, CASE ... END AS type FROM Tree;",
        reference: `SELECT id,
       CASE
           WHEN p_id IS NULL THEN 'Root'
           WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN 'Inner'
           ELSE 'Leaf'
       END AS type
FROM Tree
ORDER BY id;`,
        tests: [
            { setup: `CREATE TABLE Tree (id INT, p_id INT);
INSERT INTO Tree VALUES (1,NULL),(2,1),(3,1);`, explanation: "1 is Root; 2 and 3 have no children, so they're Leaf." },
            { setup: `CREATE TABLE Tree (id INT, p_id INT);
INSERT INTO Tree VALUES (1,NULL);` },
            { setup: `CREATE TABLE Tree (id INT, p_id INT);
INSERT INTO Tree VALUES (1,NULL),(2,1),(3,2);` },
            { setup: `CREATE TABLE Tree (id INT, p_id INT);
INSERT INTO Tree VALUES (1,NULL),(2,1),(3,1),(4,1),(5,2);` },
        ],
    },
    {
        title: "Shortest Distance in a Plane",
        difficulty: "medium",
        description: `Find the shortest Euclidean distance between any two points in the Point table, rounded to 2 decimal places.

Table: Point(x INT, y INT)

Note: this judge's SQLite build has no SQRT()/POWER() functions. Since sqrt is monotonic, MIN(sqrt(d)) = sqrt(MIN(d)) — find the minimum squared distance with plain arithmetic first, then take a single square root (e.g. via a recursive CTE doing a few steps of Newton's method).`,
        starter: "SELECT ROUND(..., 2) AS shortest;",
        reference: `WITH pairs AS (
    SELECT (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) AS d2
    FROM Point p1
    JOIN Point p2 ON p1.x < p2.x OR (p1.x = p2.x AND p1.y < p2.y)
),
minval AS (
    SELECT MIN(d2) AS d2 FROM pairs
),
newton(x, n) AS (
    SELECT d2 / 2.0, 0 FROM minval
    UNION ALL
    SELECT (x + (SELECT d2 FROM minval) / x) / 2.0, n + 1
    FROM newton WHERE n < 20
)
SELECT ROUND((SELECT x FROM newton ORDER BY n DESC LIMIT 1), 2) AS shortest;`,
        tests: [
            { setup: `CREATE TABLE Point (x INT, y INT);
INSERT INTO Point VALUES (0,0),(3,4),(1,1);`, explanation: "Distance between (0,0) and (1,1) is sqrt(2) ~= 1.41, the shortest pair." },
            { setup: `CREATE TABLE Point (x INT, y INT);
INSERT INTO Point VALUES (0,0),(3,4);` },
            { setup: `CREATE TABLE Point (x INT, y INT);
INSERT INTO Point VALUES (-1,-1),(2,3);` },
            { setup: `CREATE TABLE Point (x INT, y INT);
INSERT INTO Point VALUES (5,5),(0,0),(1,1),(9,9);` },
        ],
    },
    {
        title: "Second Degree Follower",
        difficulty: "medium",
        description: `Find each user and the number of their second-degree followers (a follows b, b follows c => a is a second-degree follower of c).

Table: Follow(followee TEXT, follower TEXT)`,
        starter: "SELECT ... FROM Follow f1 JOIN Follow f2 ...;",
        reference: `SELECT f2.followee, COUNT(DISTINCT f1.follower) AS num
FROM Follow f1
JOIN Follow f2 ON f1.followee = f2.follower
GROUP BY f2.followee
ORDER BY f2.followee;`,
        tests: [
            { setup: `CREATE TABLE Follow (followee TEXT, follower TEXT);
INSERT INTO Follow VALUES ('B','A'),('C','B');`, explanation: "A follows B, B follows C, so C has 1 second-degree follower (A)." },
            { setup: `CREATE TABLE Follow (followee TEXT, follower TEXT);
INSERT INTO Follow VALUES ('B','A');` },
            { setup: `CREATE TABLE Follow (followee TEXT, follower TEXT);
INSERT INTO Follow VALUES ('B','A'),('C','A'),('D','B'),('D','C');` },
        ],
    },
    {
        title: "Exchange Seats",
        difficulty: "medium",
        description: `Swap the id of every pair of consecutive students. If the number of students is odd, the last student's id remains unchanged.

Table: Seat(id INT, student TEXT)`,
        starter: "SELECT ... FROM Seat ORDER BY id;",
        reference: `SELECT CASE
           WHEN id % 2 = 1 AND id < (SELECT MAX(id) FROM Seat) THEN id + 1
           WHEN id % 2 = 0 THEN id - 1
           ELSE id
       END AS id,
       student
FROM Seat
ORDER BY id;`,
        tests: [
            { setup: `CREATE TABLE Seat (id INT, student TEXT);
INSERT INTO Seat VALUES (1,'Abbot'),(2,'Doris'),(3,'Emerson');`, explanation: "Positions 1 and 2 swap; position 3 (odd, last) stays." },
            { setup: `CREATE TABLE Seat (id INT, student TEXT);
INSERT INTO Seat VALUES (1,'A'),(2,'B'),(3,'C'),(4,'D');` },
            { setup: `CREATE TABLE Seat (id INT, student TEXT);
INSERT INTO Seat VALUES (1,'A'),(2,'B'),(3,'C'),(4,'D'),(5,'E');` },
            { setup: `CREATE TABLE Seat (id INT, student TEXT);
INSERT INTO Seat VALUES (1,'Solo');` },
        ],
    },
    {
        title: "Customers Who Bought All Products",
        difficulty: "medium",
        description: `Find customer IDs of customers who bought every product listed in the Product table.

Tables: Customer(customer_id INT, product_key INT), Product(product_key INT)`,
        starter: "SELECT customer_id FROM Customer ...;",
        reference: `SELECT customer_id
FROM Customer
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product)
ORDER BY customer_id;`,
        tests: [
            { setup: `CREATE TABLE Product (product_key INT);
INSERT INTO Product VALUES (1),(2),(3);
CREATE TABLE Customer (customer_id INT, product_key INT);
INSERT INTO Customer VALUES (1,1),(1,2),(1,3),(2,1),(2,2);`, explanation: "Only customer 1 bought all three products." },
            { setup: `CREATE TABLE Product (product_key INT);
INSERT INTO Product VALUES (5);
CREATE TABLE Customer (customer_id INT, product_key INT);
INSERT INTO Customer VALUES (1,5),(1,5),(2,5);` },
            { setup: `CREATE TABLE Product (product_key INT);
INSERT INTO Product VALUES (1),(2);
CREATE TABLE Customer (customer_id INT, product_key INT);
INSERT INTO Customer VALUES (1,1),(1,2),(2,1),(2,2),(3,1);` },
        ],
    },
    {
        title: "Product Sales Analysis III",
        difficulty: "medium",
        description: `For each product, report all rows corresponding to the first year that product was sold.

Table: Sales(sale_id INT, product_id INT, year INT, quantity INT, price INT)`,
        starter: "SELECT product_id, year AS first_year, quantity, price FROM Sales ...;",
        reference: `SELECT product_id, year AS first_year, quantity, price
FROM Sales
WHERE (product_id, year) IN (
    SELECT product_id, MIN(year)
    FROM Sales
    GROUP BY product_id
)
ORDER BY product_id, sale_id;`,
        tests: [
            { setup: `CREATE TABLE Sales (sale_id INT, product_id INT, year INT, quantity INT, price INT);
INSERT INTO Sales VALUES (1,100,2018,10,20),(2,100,2019,12,25),(3,200,2020,5,30);`, explanation: "Product 100's earliest year is 2018; product 200's is 2020." },
            { setup: `CREATE TABLE Sales (sale_id INT, product_id INT, year INT, quantity INT, price INT);
INSERT INTO Sales VALUES (1,1,2015,1,1);` },
            { setup: `CREATE TABLE Sales (sale_id INT, product_id INT, year INT, quantity INT, price INT);
INSERT INTO Sales VALUES (1,1,2018,10,20),(2,1,2018,5,20),(3,1,2019,1,1);` },
        ],
    },
    {
        title: "Project Employees III",
        difficulty: "medium",
        description: `Find the most experienced employee(s) in each project. Include ties.

Tables: Project(project_id INT, employee_id INT), Employee(employee_id INT, name TEXT, experience_years INT)`,
        starter: "SELECT ... FROM Project p JOIN Employee e ...;",
        reference: `SELECT p.project_id, p.employee_id
FROM Project p
JOIN Employee e ON p.employee_id = e.employee_id
WHERE (p.project_id, e.experience_years) IN (
    SELECT p2.project_id, MAX(e2.experience_years)
    FROM Project p2
    JOIN Employee e2 ON p2.employee_id = e2.employee_id
    GROUP BY p2.project_id
)
ORDER BY p.project_id, p.employee_id;`,
        tests: [
            { setup: `CREATE TABLE Employee (employee_id INT, name TEXT, experience_years INT);
INSERT INTO Employee VALUES (1,'A',3),(2,'B',5),(3,'C',5);
CREATE TABLE Project (project_id INT, employee_id INT);
INSERT INTO Project VALUES (1,1),(1,2),(1,3);`, explanation: "Employees 2 and 3 tie for 5 years experience on project 1." },
            { setup: `CREATE TABLE Employee (employee_id INT, name TEXT, experience_years INT);
INSERT INTO Employee VALUES (1,'Solo',2);
CREATE TABLE Project (project_id INT, employee_id INT);
INSERT INTO Project VALUES (1,1);` },
            { setup: `CREATE TABLE Employee (employee_id INT, name TEXT, experience_years INT);
INSERT INTO Employee VALUES (1,'A',1),(2,'B',2),(3,'C',3),(4,'D',9);
CREATE TABLE Project (project_id INT, employee_id INT);
INSERT INTO Project VALUES (1,1),(1,2),(2,3),(2,4);` },
        ],
    },
    {
        title: "Unpopular Books",
        difficulty: "medium",
        description: `Find books available for at least one month before 2019-05-23 that sold fewer than 10 copies between 2018-06-23 and 2019-06-23.

Tables: Books(book_id INT, name TEXT, available_from DATE), Orders(order_id INT, book_id INT, quantity INT, dispatch_date DATE)`,
        starter: "SELECT b.book_id, b.name FROM Books b ...;",
        reference: `SELECT b.book_id, b.name
FROM Books b
LEFT JOIN Orders o
  ON b.book_id = o.book_id
 AND o.dispatch_date BETWEEN '2018-06-23' AND '2019-06-23'
WHERE b.available_from < '2019-05-23'
GROUP BY b.book_id, b.name
HAVING COALESCE(SUM(o.quantity), 0) < 10
ORDER BY b.book_id;`,
        tests: [
            { setup: `CREATE TABLE Books (book_id INT, name TEXT, available_from DATE);
INSERT INTO Books VALUES (1,'Book A','2018-01-01'),(2,'Book B','2019-06-01');
CREATE TABLE Orders (order_id INT, book_id INT, quantity INT, dispatch_date DATE);
INSERT INTO Orders VALUES (1,1,5,'2019-01-01');`, explanation: "Book A qualifies (old enough, only 5 sold); Book B is too recent to qualify." },
            { setup: `CREATE TABLE Books (book_id INT, name TEXT, available_from DATE);
INSERT INTO Books VALUES (3,'Book C','2017-01-01');
CREATE TABLE Orders (order_id INT, book_id INT, quantity INT, dispatch_date DATE);` },
            { setup: `CREATE TABLE Books (book_id INT, name TEXT, available_from DATE);
INSERT INTO Books VALUES (4,'Book D','2017-01-01');
CREATE TABLE Orders (order_id INT, book_id INT, quantity INT, dispatch_date DATE);
INSERT INTO Orders VALUES (1,4,10,'2019-01-01');` },
        ],
    },
    {
        title: "New Users Daily Count",
        difficulty: "medium",
        description: `Count users whose first-ever activity fell in the 90-day period ending on 2019-06-30, grouped by first activity date.

Table: Traffic(user_id INT, activity TEXT, activity_date DATE)`,
        starter: "SELECT ... FROM Traffic;",
        reference: `WITH first_activity AS (
    SELECT user_id, MIN(activity_date) AS login_date
    FROM Traffic
    GROUP BY user_id
)
SELECT login_date, COUNT(*) AS user_count
FROM first_activity
WHERE login_date BETWEEN date('2019-06-30', '-89 days') AND '2019-06-30'
GROUP BY login_date
ORDER BY login_date;`,
        tests: [
            { setup: `CREATE TABLE Traffic (user_id INT, activity TEXT, activity_date DATE);
INSERT INTO Traffic VALUES (1,'login','2019-06-20'),(2,'login','2019-01-01');`, explanation: "User 1's first activity is inside the 90-day window; user 2's is not." },
            { setup: `CREATE TABLE Traffic (user_id INT, activity TEXT, activity_date DATE);
INSERT INTO Traffic VALUES (1,'login','2019-06-01'),(1,'logout','2019-06-02');` },
            { setup: `CREATE TABLE Traffic (user_id INT, activity TEXT, activity_date DATE);
INSERT INTO Traffic VALUES (1,'login','2019-06-15'),(2,'login','2019-06-15'),(3,'login','2019-06-15');` },
        ],
    },
    {
        title: "Highest Grade For Each Student",
        difficulty: "medium",
        description: `For every student, return the course with the highest grade. If tied, return the smallest course ID.

Table: Enrollments(student_id INT, course_id INT, grade INT)`,
        starter: "SELECT ... FROM Enrollments;",
        reference: `WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY student_id
        ORDER BY grade DESC, course_id ASC
    ) AS rn
    FROM Enrollments
)
SELECT student_id, course_id, grade
FROM ranked
WHERE rn = 1
ORDER BY student_id;`,
        tests: [
            { setup: `CREATE TABLE Enrollments (student_id INT, course_id INT, grade INT);
INSERT INTO Enrollments VALUES (1,10,90),(1,20,90),(1,30,80);`, explanation: "Courses 10 and 20 tie at 90 — the smaller course ID (10) is returned." },
            { setup: `CREATE TABLE Enrollments (student_id INT, course_id INT, grade INT);
INSERT INTO Enrollments VALUES (1,5,70);` },
            { setup: `CREATE TABLE Enrollments (student_id INT, course_id INT, grade INT);
INSERT INTO Enrollments VALUES (1,1,60),(1,2,95),(2,1,88),(2,2,88);` },
        ],
    },
    {
        title: "Active Businesses",
        difficulty: "medium",
        description: `Find businesses that have more events than the average for the same event type, in at least two event types.

Table: Events(business_id INT, event_type TEXT, occurrences INT)`,
        starter: "SELECT business_id FROM Events ...;",
        reference: `WITH avg_events AS (
    SELECT event_type, AVG(occurrences) AS avg_occ
    FROM Events
    GROUP BY event_type
)
SELECT e.business_id
FROM Events e
JOIN avg_events a ON e.event_type = a.event_type
WHERE e.occurrences > a.avg_occ
GROUP BY e.business_id
HAVING COUNT(*) >= 2
ORDER BY e.business_id;`,
        tests: [
            { setup: `CREATE TABLE Events (business_id INT, event_type TEXT, occurrences INT);
INSERT INTO Events VALUES
(1,'reviews',7),(2,'reviews',3),(3,'reviews',2),
(1,'ads',11),(2,'ads',2),(3,'ads',1);`, explanation: "Business 1 is above average in both 'reviews' and 'ads'." },
            { setup: `CREATE TABLE Events (business_id INT, event_type TEXT, occurrences INT);
INSERT INTO Events VALUES (1,'reviews',10),(2,'reviews',1),(1,'ads',1),(2,'ads',1);` },
            { setup: `CREATE TABLE Events (business_id INT, event_type TEXT, occurrences INT);
INSERT INTO Events VALUES (1,'a',5),(2,'a',5),(1,'b',5),(2,'b',5);` },
        ],
    },
    {
        title: "Reported Posts II",
        difficulty: "medium",
        description: `Find the average daily percentage of spam-reported posts that were removed.

Tables: Actions(post_id INT, action_date DATE, extra TEXT), Removals(post_id INT, remove_date DATE)`,
        starter: "SELECT ROUND(AVG(...), 2) AS average_daily_percent;",
        reference: `WITH daily AS (
    SELECT a.action_date,
           COUNT(DISTINCT r.post_id) * 100.0 / COUNT(DISTINCT a.post_id) AS pct
    FROM Actions a
    LEFT JOIN Removals r ON a.post_id = r.post_id
    WHERE a.extra = 'spam'
    GROUP BY a.action_date
)
SELECT ROUND(AVG(pct), 2) AS average_daily_percent
FROM daily;`,
        tests: [
            { setup: `CREATE TABLE Actions (post_id INT, action_date DATE, extra TEXT);
INSERT INTO Actions VALUES (1,'2019-07-01','spam'),(2,'2019-07-01','spam');
CREATE TABLE Removals (post_id INT, remove_date DATE);
INSERT INTO Removals VALUES (1,'2019-07-02');`, explanation: "On 2019-07-01, 1 of 2 spam posts was later removed: 50%." },
            { setup: `CREATE TABLE Actions (post_id INT, action_date DATE, extra TEXT);
INSERT INTO Actions VALUES (1,'2019-07-01','spam'),(2,'2019-07-01','spam');
CREATE TABLE Removals (post_id INT, remove_date DATE);` },
            { setup: `CREATE TABLE Actions (post_id INT, action_date DATE, extra TEXT);
INSERT INTO Actions VALUES (1,'2019-07-01','spam'),(2,'2019-07-02','spam');
CREATE TABLE Removals (post_id INT, remove_date DATE);
INSERT INTO Removals VALUES (1,'2019-07-01');` },
        ],
    },
    {
        title: "Article Views II",
        difficulty: "medium",
        description: `Find viewers who viewed more than one distinct article on the same day.

Table: Views(article_id INT, author_id INT, viewer_id INT, view_date DATE)`,
        starter: "SELECT DISTINCT viewer_id AS id FROM Views ...;",
        reference: `SELECT DISTINCT viewer_id AS id
FROM Views
GROUP BY viewer_id, view_date
HAVING COUNT(DISTINCT article_id) > 1
ORDER BY id;`,
        tests: [
            { setup: `CREATE TABLE Views (article_id INT, author_id INT, viewer_id INT, view_date DATE);
INSERT INTO Views VALUES (10,5,1,'2019-08-01'),(20,5,1,'2019-08-01');`, explanation: "Viewer 1 saw 2 distinct articles on the same day." },
            { setup: `CREATE TABLE Views (article_id INT, author_id INT, viewer_id INT, view_date DATE);
INSERT INTO Views VALUES (10,5,1,'2019-08-01'),(10,5,1,'2019-08-01');` },
            { setup: `CREATE TABLE Views (article_id INT, author_id INT, viewer_id INT, view_date DATE);
INSERT INTO Views VALUES (10,5,1,'2019-08-01'),(20,5,1,'2019-08-02');` },
        ],
    },
    {
        title: "Market Analysis I",
        difficulty: "medium",
        description: `Report every user's join date and number of orders placed in 2019.

Tables: Users(user_id INT, join_date DATE, favorite_brand TEXT), Orders(order_id INT, order_date DATE, item_id INT, buyer_id INT, seller_id INT)`,
        starter: "SELECT u.user_id AS buyer_id, u.join_date, ... FROM Users u;",
        reference: `SELECT u.user_id AS buyer_id,
       u.join_date,
       COUNT(o.order_id) AS orders_in_2019
FROM Users u
LEFT JOIN Orders o
  ON u.user_id = o.buyer_id
 AND o.order_date >= '2019-01-01'
 AND o.order_date < '2020-01-01'
GROUP BY u.user_id, u.join_date
ORDER BY u.user_id;`,
        tests: [
            { setup: `CREATE TABLE Users (user_id INT, join_date DATE, favorite_brand TEXT);
INSERT INTO Users VALUES (1,'2018-01-01','Nike');
CREATE TABLE Orders (order_id INT, order_date DATE, item_id INT, buyer_id INT, seller_id INT);
INSERT INTO Orders VALUES (1,'2019-03-01',1,1,2),(2,'2019-05-01',2,1,2);`, explanation: "User 1 placed 2 orders in 2019." },
            { setup: `CREATE TABLE Users (user_id INT, join_date DATE, favorite_brand TEXT);
INSERT INTO Users VALUES (2,'2019-01-01','Adidas');
CREATE TABLE Orders (order_id INT, order_date DATE, item_id INT, buyer_id INT, seller_id INT);` },
            { setup: `CREATE TABLE Users (user_id INT, join_date DATE, favorite_brand TEXT);
INSERT INTO Users VALUES (3,'2017-01-01','Puma');
CREATE TABLE Orders (order_id INT, order_date DATE, item_id INT, buyer_id INT, seller_id INT);
INSERT INTO Orders VALUES (1,'2018-01-01',1,3,1);` },
        ],
    },
    {
        title: "Product Price at a Given Date",
        difficulty: "medium",
        description: `Return the price of every product on 2019-08-16. If a product had no price change before that date, its price is 10.

Table: Products(product_id INT, new_price INT, change_date DATE)`,
        starter: "SELECT ...;",
        reference: `SELECT product_id, new_price AS price
FROM Products
WHERE (product_id, change_date) IN (
    SELECT product_id, MAX(change_date)
    FROM Products
    WHERE change_date <= '2019-08-16'
    GROUP BY product_id
)
UNION
SELECT product_id, 10 AS price
FROM Products
GROUP BY product_id
HAVING MIN(change_date) > '2019-08-16'
ORDER BY product_id;`,
        tests: [
            { setup: `CREATE TABLE Products (product_id INT, new_price INT, change_date DATE);
INSERT INTO Products VALUES (1,20,'2019-08-14'),(1,30,'2019-08-17');`, explanation: "The latest change on/before 08-16 is 20 (from 08-14)." },
            { setup: `CREATE TABLE Products (product_id INT, new_price INT, change_date DATE);
INSERT INTO Products VALUES (2,50,'2019-08-16');` },
            { setup: `CREATE TABLE Products (product_id INT, new_price INT, change_date DATE);
INSERT INTO Products VALUES (3,15,'2019-08-01'),(3,25,'2019-08-10'),(3,35,'2019-08-15');` },
        ],
    },
    {
        title: "Immediate Food Delivery II",
        difficulty: "medium",
        description: `Find the percentage of customers whose first order was delivered on the same day they ordered it.

Table: Delivery(delivery_id INT, customer_id INT, order_date DATE, customer_pref_delivery_date DATE)`,
        starter: "SELECT ROUND(..., 2) AS immediate_percentage;",
        reference: `WITH first_orders AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY customer_id ORDER BY order_date
    ) AS rn
    FROM Delivery
)
SELECT ROUND(100.0 * AVG(order_date = customer_pref_delivery_date), 2) AS immediate_percentage
FROM first_orders
WHERE rn = 1;`,
        tests: [
            { setup: `CREATE TABLE Delivery (delivery_id INT, customer_id INT, order_date DATE, customer_pref_delivery_date DATE);
INSERT INTO Delivery VALUES (1,1,'2019-08-01','2019-08-01'),(2,2,'2019-08-02','2019-08-05');`, explanation: "Customer 1's first order was immediate; customer 2's was not — 50%." },
            { setup: `CREATE TABLE Delivery (delivery_id INT, customer_id INT, order_date DATE, customer_pref_delivery_date DATE);
INSERT INTO Delivery VALUES (1,1,'2019-08-01','2019-08-01'),(2,2,'2019-08-01','2019-08-01');` },
            { setup: `CREATE TABLE Delivery (delivery_id INT, customer_id INT, order_date DATE, customer_pref_delivery_date DATE);
INSERT INTO Delivery VALUES (1,1,'2019-08-01','2019-08-04'),(2,2,'2019-08-01','2019-08-05');` },
        ],
    },
    {
        title: "Monthly Transactions I",
        difficulty: "medium",
        description: `For each country and month, report transaction count, approved count, total amount, and approved amount.

Table: Transactions(id INT, country TEXT, state TEXT, amount INT, trans_date DATE)`,
        starter: "SELECT ... FROM Transactions GROUP BY ...;",
        reference: `SELECT strftime('%Y-%m', trans_date) AS month,
       country,
       COUNT(*) AS trans_count,
       SUM(state = 'approved') AS approved_count,
       SUM(amount) AS trans_total_amount,
       SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount
FROM Transactions
GROUP BY month, country
ORDER BY month, country;`,
        tests: [
            { setup: `CREATE TABLE Transactions (id INT, country TEXT, state TEXT, amount INT, trans_date DATE);
INSERT INTO Transactions VALUES (1,'US','approved',1000,'2019-05-01'),(2,'US','declined',500,'2019-05-02');`, explanation: "2 transactions in 2019-05 for US, 1 approved, totals 1500 / 1000." },
            { setup: `CREATE TABLE Transactions (id INT, country TEXT, state TEXT, amount INT, trans_date DATE);
INSERT INTO Transactions VALUES (1,'US','approved',100,'2019-01-01'),(2,'US','approved',200,'2019-01-02');` },
            { setup: `CREATE TABLE Transactions (id INT, country TEXT, state TEXT, amount INT, trans_date DATE);
INSERT INTO Transactions VALUES (1,'US','declined',50,'2019-02-01'),(2,'IN','declined',75,'2019-02-01');` },
        ],
    },
    {
        title: "Last Person to Fit in the Bus",
        difficulty: "medium",
        description: `Find the last person (by turn order) who can board a bus with a maximum total weight of 1000.

Table: Queue(person_id INT, person_name TEXT, weight INT, turn INT)`,
        starter: "SELECT person_name FROM ...;",
        reference: `WITH q AS (
    SELECT person_name, turn,
           SUM(weight) OVER (ORDER BY turn) AS total_weight
    FROM Queue
)
SELECT person_name
FROM q
WHERE total_weight <= 1000
ORDER BY turn DESC
LIMIT 1;`,
        tests: [
            { setup: `CREATE TABLE Queue (person_id INT, person_name TEXT, weight INT, turn INT);
INSERT INTO Queue VALUES (1,'Alice',400,1),(2,'Bob',700,2);`, explanation: "Alice (400) fits; adding Bob would make 1100, so Alice is last to fit." },
            { setup: `CREATE TABLE Queue (person_id INT, person_name TEXT, weight INT, turn INT);
INSERT INTO Queue VALUES (1,'A',500,1),(2,'B',500,2);` },
            { setup: `CREATE TABLE Queue (person_id INT, person_name TEXT, weight INT, turn INT);
INSERT INTO Queue VALUES (1,'Solo',900,1);` },
            { setup: `CREATE TABLE Queue (person_id INT, person_name TEXT, weight INT, turn INT);
INSERT INTO Queue VALUES (1,'A',300,1),(2,'B',300,2),(3,'C',300,3),(4,'D',300,4);` },
        ],
    },
    {
        title: "Monthly Transactions II",
        difficulty: "medium",
        description: `Report monthly transaction statistics including approved transactions and chargebacks, by country and month.

Tables: Transactions(id INT, country TEXT, state TEXT, amount INT, trans_date DATE), Chargebacks(trans_id INT, trans_date DATE)`,
        starter: "SELECT ...;",
        reference: `WITH t AS (
    SELECT strftime('%Y-%m', trans_date) AS month, country,
           1 AS trans_count,
           (state = 'approved') AS approved_count,
           amount AS trans_total_amount,
           CASE WHEN state = 'approved' THEN amount ELSE 0 END AS approved_total_amount,
           0 AS chargeback_count, 0 AS chargeback_total_amount
    FROM Transactions
    UNION ALL
    SELECT strftime('%Y-%m', c.trans_date), t.country,
           0, 0, 0, 0, 1, t.amount
    FROM Chargebacks c
    JOIN Transactions t ON c.trans_id = t.id
)
SELECT month, country,
       SUM(trans_count) AS trans_count,
       SUM(approved_count) AS approved_count,
       SUM(trans_total_amount) AS trans_total_amount,
       SUM(approved_total_amount) AS approved_total_amount,
       SUM(chargeback_count) AS chargeback_count,
       SUM(chargeback_total_amount) AS chargeback_total_amount
FROM t
GROUP BY month, country
ORDER BY month, country;`,
        tests: [
            { setup: `CREATE TABLE Transactions (id INT, country TEXT, state TEXT, amount INT, trans_date DATE);
INSERT INTO Transactions VALUES (1,'US','approved',100,'2019-05-18');
CREATE TABLE Chargebacks (trans_id INT, trans_date DATE);
INSERT INTO Chargebacks VALUES (1,'2019-05-29');`, explanation: "One approved transaction and one chargeback referencing it, same month/country." },
            { setup: `CREATE TABLE Transactions (id INT, country TEXT, state TEXT, amount INT, trans_date DATE);
INSERT INTO Transactions VALUES (1,'IN','declined',50,'2019-06-01');
CREATE TABLE Chargebacks (trans_id INT, trans_date DATE);` },
            { setup: `CREATE TABLE Transactions (id INT, country TEXT, state TEXT, amount INT, trans_date DATE);
INSERT INTO Transactions VALUES (1,'US','approved',200,'2019-07-01'),(2,'US','approved',300,'2019-07-02');
CREATE TABLE Chargebacks (trans_id INT, trans_date DATE);
INSERT INTO Chargebacks VALUES (1,'2019-07-15'),(2,'2019-07-16');` },
        ],
    },
];

module.exports = problems;
