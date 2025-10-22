const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://Victor:wambuguvicta23@ex1.xlf33z5.mongodb.net/?retryWrites=true&w=majority&appName=EX1"; // mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("plp_bookstore");
    const books = db.collection("books");

    const docs = [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", published_year: 1925, price: 12.99, in_stock: true, pages: 180, publisher: "Scribner" },
      { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", published_year: 1960, price: 10.99, in_stock: true, pages: 281, publisher: "J.B. Lippincott & Co." },
      { title: "1984", author: "George Orwell", genre: "Dystopian", published_year: 1949, price: 15.5, in_stock: false, pages: 328, publisher: "Secker & Warburg" },
      { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", published_year: 1937, price: 18.0, in_stock: true, pages: 310, publisher: "Allen & Unwin" },
      { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", published_year: 1997, price: 20.0, in_stock: true, pages: 350, publisher: "Bloomsbury" },
      { title: "Inferno", author: "Dan Brown", genre: "Thriller", published_year: 2013, price: 14.99, in_stock: true, pages: 480, publisher: "Doubleday" },
      { title: "Gone Girl", author: "Gillian Flynn", genre: "Mystery", published_year: 2012, price: 13.75, in_stock: true, pages: 422, publisher: "Crown" },
      { title: "Becoming", author: "Michelle Obama", genre: "Biography", published_year: 2018, price: 22.0, in_stock: true, pages: 448, publisher: "Crown" },
      { title: "The Alchemist", author: "Paulo Coelho", genre: "Adventure", published_year: 1988, price: 9.99, in_stock: true, pages: 208, publisher: "HarperOne" },
      { title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", published_year: 1965, price: 17.5, in_stock: false, pages: 412, publisher: "Chilton Books" }
    ];

    const result = await books.insertMany(docs);
    // for mongodb driver v5+: insertedIds exists rather than insertedCount in some contexts
    const inserted = result.insertedCount ?? Object.keys(result.insertedIds || {}).length;
    console.log('✅ Successfully inserted ${inserted} books.');
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();