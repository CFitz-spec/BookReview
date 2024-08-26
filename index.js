import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from 'dotenv';


//Start up app 
const app = express();
//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//.env config 
dotenv.config();
const p = process.env.PORT; //Listening Port!
// THIS TOOK AGES to work out!!! But got it now. YAY! Must be like this DB_EXAMPLE="12345" in the .env file. Can't be DB_EXAMPLE1={host:123, password:321}
const db = new pg.Client({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASS,
    port:process.env.DB_PORT
})
db.connect();

//This function joins the book_read and review table. Getting the title, review blog, and review score. 
//Do I need the getBooks function? Can I just return the result.rows and send the data across? 
//Result -- Yes I can! It also solves the duplicating bug
async function bookDB(order, filter){
    try {
        const result = await db.query(`SELECT book_read.id, book_read.title,book_read.isbn, review.id,review.review_blog,review.review_score 
            FROM book_read 
            INNER JOIN review 
            ON book_read.id=review.id
            ORDER BY ${filter} ${order};`
    )
        return result.rows;
    } catch (error) {
        console.log(`Error accessing DataBase`)
    }
};

//landing page
app.get("/", async (req,res)=>{
    const order = "ASC"
    const filter = "book_read.id"
    const review =  await bookDB(order,filter);
    res.render("index.ejs", {
        review:review,
    });
});

app.post("/filterLanding", async(req,res)=>{
    const order = req.body.order;
    const filter = req.body.filter;
    const review = await bookDB(order,filter);
    res.render("index.ejs",{
        review:review
    });
})

//Create page
app.get("/create", (req,res)=>{
    res.render("create.ejs");
});

//Review page Gets newly created blog post and renders review page for final check.  
app.post("/review",(req,res)=>{
    const review = req.body;
    res.render("review.ejs",{
        review:review
    });
});
//Sends posts off to be edited
app.post("/edit", async (req,res)=>{
const review = req.body;
res.render("create.ejs",{
    review:review
    });
});
//Allows user to select a review from the landing page to edit
app.post("/landingEdit",async (req,res)=>{
    const id = req.body.id;
    const result = await db.query("SELECT book_read.id, book_read.title,book_read.isbn, review.id,review.review_blog,review.review_score FROM book_read INNER JOIN review ON book_read.id=review.id WHERE book_read.id = $1;",
        [id]
    );
    const review = result.rows[0];
    console.log(review)
    res.render("create.ejs",{
        review:review
    });
});

//Adds review to database then redirects to landing page. 
app.post("/publish", async(req,res)=>{
const title = req.body.title;
const isbn = req.body.isbn;
    await db.query("INSERT INTO book_read (title, isbn) VALUES ($1, $2);",
    [title,isbn]
);
const review_blog = req.body.review_blog;
const review_score = req.body.review_score;
await db.query("INSERT INTO review (review_blog, review_score) VALUES ($1, $2);",
    [review_blog, review_score]
);
res.redirect("/");
});


//Allows the user to delete a review
app.post("/delete", async (req,res)=>{
    const book_id = req.body.id;
        await db.query("DELETE FROM review WHERE id = $1;",
            [book_id]
        );
        await db.query("DELETE FROM book_read WHERE id = $1;",
            [book_id]
        );
res.redirect("/");
  
});

//Apps listen 
app.listen(p, () => {
    console.log(`Server running`);
  });
  