import "dotenv/config";
import {pool} from "./db.js";

async function migrate() {
    await pool.query(`
        CREATE TABLE  IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            passwordHash VARCHAR(255) NOT NULL,
            full_name VARCHAR(150),
            role ENUM('user','admin') DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS films (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      genre VARCHAR(50),
      duration INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);


    await pool.query(`
    CREATE TABLE IF NOT EXISTS showtimes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      film_id INT NOT NULL,
      show_date DATE NOT NULL,
      show_time TIME NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      total_seats INT DEFAULT 50,
      available_seats INT DEFAULT 50,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_showtime_film
        FOREIGN KEY (film_id) REFERENCES films(id)
        ON DELETE CASCADE
    );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      showtime_id INT NOT NULL,
      seats VARCHAR(255) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      booking_reference VARCHAR(100) UNIQUE NOT NULL,
      booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status ENUM('confirmed','cancelled') DEFAULT 'confirmed',

      CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_booking_showtime
        FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
        ON DELETE CASCADE
    );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      film_id INT NOT NULL,
      rating INT CHECK (rating BETWEEN 1 AND 5),
      comment_text VARCHAR(500) NOT NULL,
      status ENUM('pending','approved','rejected','deleted') DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_comment_film
        FOREIGN KEY (film_id) REFERENCES films(id)
        ON DELETE CASCADE,

      UNIQUE KEY unique_user_film (user_id, film_id)
    );
  `);

    console.log("✅ Migration finished successfully");

}

migrate().catch(err => {
    console.error("❌ Migration error:", err);
});
