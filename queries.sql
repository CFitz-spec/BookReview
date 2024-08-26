CREATE TABLE book_read(
	id SERIAL UNIQUE PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	isbn VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE review(
	id SERIAL REFERENCES book_read (id) UNIQUE,
	review_blog TEXT NOT NULL,
	review_score CHAR(2) NOT NULL
);
---After nearly going mad. API only works with isbn13 number
---Also side note. These aren't my reviews. Don't get me wrong I've read these books. 
--Just the reviews are thrown together by Google AI. 
--I've made this decision as it allows me to spend more time making the app instead of making reviews. 

INSERT INTO book_read(title, isbn)
VALUES('Atomic Habits', 9780735211292);

INSERT INTO review (review_blog ,review_score)
VALUES (
	'Atomic Habits by James Clear is a practical guide to achieving big goals through small, consistent steps. Clear outlines a simple yet effective system for building good habits and breaking bad ones. With real-world examples and actionable advice, the book empowers readers to create lasting change.',
	'07'
	);
INSERT INTO book_read (title,isbn)
VALUES ('Can''t Hurt Me', 9781544507859);

INSERT INTO review(review_blog,review_score)
VALUES ('Can''t Hurt Me by David Goggins is a raw, inspiring memoir about overcoming adversity. Goggins'' journey from a troubled youth to a decorated military member and elite athlete is both harrowing and motivating. While the book contains explicit language and may not be suitable for all readers, it''s a must-read for anyone seeking inspiration or a glimpse into the power of the human mind.',
 04
 );

---inside the index.js---
--This gives a joined table of book_read and corresponding reviews--
SELECT book_read.id, book_read.title, review.id, review.review_blog, review.review_score 
FROM book_read 
INNER JOIN review 
ON book_read.id=review.id;

-- This allowed me to find the review from the landing page and edit it in create.ejs
SELECT book_read.id, book_read.title,book_read.isbn, review.id,review.review_blog,review.review_score 
FROM book_read 
INNER JOIN review 
ON book_read.id=review.id 
WHERE book_read.id = $1
[id]

--This one allowed me to add a new review into the DB. 
INSERT INTO book_read (title, isbn) 
VALUES ($1, $2);
[title,isbn]
INSERT INTO review (review_blog, review_score) 
VALUES ($1, $2);
[review_blog, review_score]


