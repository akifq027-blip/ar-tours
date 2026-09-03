import mysql, { Pool } from 'mysql2/promise';
import { config } from './config.js';

let pool: Pool | null = null;
let isConnected = false;

export function getMySQLPool(): Pool | null {
  if (!pool && config.mysql.host && config.mysql.database) {
    try {
      pool = mysql.createPool({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });
    } catch (err) {
      console.warn('[MySQL] Could not initialize connection pool:', err);
    }
  }
  return pool;
}

export let isMySqlConnected = false;

export function isMySQLActive(): boolean {
  return isConnected;
}

export async function initMySQLDatabase(): Promise<boolean> {
  const currentPool = getMySQLPool();
  if (!currentPool) {
    console.log('[MySQL] Database configuration not fully provided. Falling back to active memory store.');
    return false;
  }

  try {
    const connection = await currentPool.getConnection();
    isConnected = true;
    isMySqlConnected = true;
    console.log(`[MySQL] Connected to MySQL database "${config.mysql.database}" on ${config.mysql.host}:${config.mysql.port}`);

    // Create Tables if not exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(191) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100),
        category VARCHAR(50) NOT NULL,
        registration_number VARCHAR(50) NOT NULL,
        seating_capacity INT DEFAULT 5,
        transmission VARCHAR(50) DEFAULT 'Manual',
        fuel_type VARCHAR(50) DEFAULT 'Diesel',
        price_per_day DECIMAL(10,2) NOT NULL,
        security_deposit DECIMAL(10,2) DEFAULT 3000,
        booking_amount DECIMAL(10,2) DEFAULT 99,
        description TEXT,
        features JSON,
        images JSON,
        location VARCHAR(191) DEFAULT 'Main Hub',
        status VARCHAR(50) DEFAULT 'available',
        total_slots INT DEFAULT 5,
        available_slots INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS car_bookings (
        id VARCHAR(64) PRIMARY KEY,
        booking_number VARCHAR(64) NOT NULL UNIQUE,
        user_id VARCHAR(64),
        customer_name VARCHAR(191) NOT NULL,
        customer_email VARCHAR(191) NOT NULL,
        customer_phone VARCHAR(32) NOT NULL,
        car_id VARCHAR(64) NOT NULL,
        pickup_location VARCHAR(191) NOT NULL,
        drop_location VARCHAR(191),
        pickup_date VARCHAR(32) NOT NULL,
        pickup_time VARCHAR(16) DEFAULT '10:00',
        return_date VARCHAR(32) NOT NULL,
        return_time VARCHAR(16) DEFAULT '10:00',
        rental_days INT DEFAULT 1,
        rental_rate_per_day DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        booking_fee DECIMAL(10,2) DEFAULT 499,
        security_deposit DECIMAL(10,2) DEFAULT 3000,
        remaining_amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(32) DEFAULT 'UPI',
        utr_number VARCHAR(128),
        payment_screenshot LONGTEXT,
        payment_status VARCHAR(32) DEFAULT 'awaiting_approval',
        booking_status VARCHAR(32) DEFAULT 'pending_verification',
        rejection_reason TEXT,
        verified_at TIMESTAMP NULL,
        verified_by VARCHAR(128),
        razorpay_order_id VARCHAR(128),
        razorpay_payment_id VARCHAR(128),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(191) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        destination VARCHAR(191) NOT NULL,
        category VARCHAR(64) DEFAULT 'Domestic',
        short_description TEXT,
        description TEXT,
        duration VARCHAR(64) NOT NULL,
        starting_price DECIMAL(10,2) NOT NULL,
        itinerary JSON,
        inclusions JSON,
        exclusions JSON,
        important_info JSON,
        images JSON,
        available BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3,2) DEFAULT 4.9,
        reviews_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tour_enquiries (
        id VARCHAR(64) PRIMARY KEY,
        tour_id VARCHAR(64),
        tour_title VARCHAR(191) NOT NULL,
        user_id VARCHAR(64),
        full_name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        travel_date VARCHAR(32) NOT NULL,
        number_of_adults INT DEFAULT 1,
        number_of_children INT DEFAULT 0,
        special_requests TEXT,
        status VARCHAR(32) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS pilgrimage_packages (
        id VARCHAR(64) PRIMARY KEY,
        package_type VARCHAR(64) NOT NULL,
        title VARCHAR(191) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        duration VARCHAR(64) NOT NULL,
        starting_price DECIMAL(10,2) NOT NULL,
        hotel_details TEXT,
        makkah_hotel VARCHAR(191),
        makkah_distance VARCHAR(100),
        madinah_hotel VARCHAR(191),
        madinah_distance VARCHAR(100),
        transport_details TEXT,
        food_details TEXT,
        ziyarat_details TEXT,
        inclusions JSON,
        exclusions JSON,
        itinerary JSON,
        images JSON,
        available BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3,2) DEFAULT 5.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS pilgrimage_enquiries (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        package_id VARCHAR(64),
        package_title VARCHAR(191),
        pilgrimage_type VARCHAR(64),
        full_name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        number_of_people INT DEFAULT 1,
        preferred_month VARCHAR(64),
        departure_city VARCHAR(64),
        room_sharing VARCHAR(64),
        message TEXT,
        status VARCHAR(32) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(32),
        subject VARCHAR(191),
        service_interest VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(32) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        user_name VARCHAR(191) NOT NULL,
        user_location VARCHAR(191),
        service_type VARCHAR(100) NOT NULL,
        rating INT DEFAULT 5,
        title VARCHAR(191),
        comment TEXT NOT NULL,
        approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(64) PRIMARY KEY,
        setting_value JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    connection.release();
    console.log('[MySQL] Schema initialization and table checks completed successfully.');
    return true;
  } catch (err: any) {
    isConnected = false;
    isMySqlConnected = false;
    console.warn(`[MySQL] Note: Could not connect to MySQL server (${err.message}). The application is safely running using resilient in-memory database.`);
    return false;
  }
}

export const initMySQL = initMySQLDatabase;

