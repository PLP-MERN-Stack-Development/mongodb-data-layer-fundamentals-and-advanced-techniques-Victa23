const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://Victor:wambuguvicta23@ex1.xlf33z5.mongodb.net/?retryWrites=true&w=majority&appName=EX1";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    console.log("===== TASK 2: BASIC CRUD =====");

    // Find all books in a specific genre
    console.log("Books in 'Fantasy' genre:");
    console.log(await books.find({ genre: "Fantasy" }).toArray());

    // Find books published after a certain year
    console.log("Books published after 2000:");
    console.log(await books.find({ published_year: { $gt: 2000 } }).toArray());

    // Find books by a specific author
    console.log("Books by George Orwell:");
    console.log(await books.find({ author: "George Orwell" }).toArray());

    // Update the price of a specific book
    await books.updateOne({ title: "1984" }, { $set: { price: 20 } });
    console.log("Updated price of '1984' to 20");

    // Delete a book by its title
    await books.deleteOne({ title: "The Hobbit" });
    console.log("Deleted 'The Hobbit'");

    console.log("\n===== TASK 3: ADVANCED QUERIES =====");

    // Books in stock and published after 2010 with projection
    console.log("Books in stock and published after 2010 (title, author, price):");
    console.log(await books.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray());

    // Sorting by price
    console.log("Books sorted by price ascending:");
    console.log(await books.find().sort({ price: 1 }).toArray());

    console.log("Books sorted by price descending:");
    console.log(await books.find().sort({ price: -1 }).toArray());

    // Pagination: 5 books per page
    console.log("Pagination - page 1 (5 books):");
    console.log(await books.find().skip(0).limit(5).toArray());

    console.log("Pagination - page 2 (5 books):");
    console.log(await books.find().skip(5).limit(5).toArray());

    console.log("\n===== TASK 4: AGGREGATION PIPELINES =====");

    // Average price of books by genre
    console.log("Average price by genre:");
    console.log(await books.aggregate([
      { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
    ]).toArray());

    // Author with the most books
    console.log("Author with most books:");
    console.log(await books.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray());

    // Group books by publication decade
    console.log("Books grouped by publication decade:");
    console.log(await books.aggregate([
      { 
        $group: { 
          _id: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]).toArray());

    console.log("\n===== TASK 5: INDEXING =====");

    // Create index on title
    await books.createIndex({ title: 1 });
    console.log("Index on 'title' created.");

    // Create compound index on author and published_year
    await books.createIndex({ author: 1, published_year: -1 });
    console.log("Compound index on 'author' and 'published_year' created.");

    // Explain queries to show performance
    console.log("Explain plan for finding by title:");
    console.log(await books.find({ title: "1984" }).explain("executionStats"));

    console.log("Explain plan for finding by author and year:");
    console.log(await books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats"));

  } finally {
    await client.close();
  }
}

run().catch(console.dir);