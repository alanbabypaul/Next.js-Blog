const { db } = require("@vercel/postgres");
const { posts, images } = require("../src/app/lib/placeholder-data.js");

async function seedPosts(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "posts" table if it doesn't exist
    await client.sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `;
    console.log(`Created "posts" table`);

    // Create another table for post_images
    await client.sql`
      CREATE TABLE IF NOT EXISTS post_images (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL UNIQUE,
        image_url TEXT NOT NULL,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE
      );
    `;
    console.log(`Created "post_images" table`);

    // Insert data into the "posts" table
    const insertedPosts = await Promise.all(
      posts.map(async (post) => {
        return client.sql`
          INSERT INTO posts (id, title, content, date, author)
          VALUES (${post.id}, ${post.title}, ${post.content}, ${post.date}, ${post.user})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );
    console.log(`Seeded ${insertedPosts.length} posts`);

    // Insert data into the "post_images" table
    const insertedImages = await Promise.all(
      images.map(async (image) => {
        return client.sql`
          INSERT INTO post_images (id, author, title, image_url, post_id)
          VALUES (${image.id}, ${image.author}, ${image.title}, ${image.image_url}, ${image.post_id})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );
    console.log(`Seeded ${insertedImages.length} post_images`);

    return {
      posts: insertedPosts,
      post_images: insertedImages,
    };
  } catch (error) {
    console.error("Error seeding posts:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedPosts(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
