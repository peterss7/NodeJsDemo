import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { getEnv } from '../utils/env.js';

let db: Database | null = null;

/**
 * Init SQLite db
 * Return opened connection
 */
export async function initDb() {
    const filename = getEnv('DB_FILE', './tims-pizza.db');
    db = await open({
    filename: './tims-pizza-pizzaria.db',
    driver: sqlite3.Database
});

    // create tables, seed data
    await db.exec(`
        PRAGMA foreign_keys = ON;



        CREATE TABLE IF NOT EXISTS inventory (
            sku TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            unit_cost_cents INTEGER NOT NULL
            menu_price_cents INTEGER NOT NULL,
            quantity INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
        );

        CREATE TABLE IF NOT EXISTS orders (
            order_id INTEGER NOT NULL,
            sku TEXT NOT NULL,
            qty INTEGER NOT NULL,
            total INTEGER NOT NULL,
            FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY(sku) REFERENCES inventory(sku),
            PRIMARY KEY(order_id, sku)
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            transaction_amount INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY(customer_id) REFERENCES customers(id)
        );

        CREATE TABLE IF NOT EXISTS p_and_l (
            id INTEGER PRIMARY KEY CHECK (id=1),
            profits_cents INTEGER NOT NULL,
            losses_cents INTEGER NOT NULL,
            revenue_cents INTEGER NOT NULL
        );

        // Revenue starts at 0 
        INSERT INTO p_and_l(id, revenue_cents)
            SELECT 1, 0, 0, 0
            WHERE NOT EXISTS (SELECT 1 FROM p_and_l WHERE id=1);

        INSERT INTO customers(name) VALUES
            ('Aragorn');
            ('Sauron');

        INSERT INTO inventory(sku, name, menu_price, unit_cost_cents, menu_price_cents, quantity) VALUES
            ('PZ-PEPP', 'Pepperoni', 45, 125, 500);
            ('PZ-GRPP', 'Green Peppers', 66, 125, 20);
            ('PZ-SHRM', 'Mushrooms', 20, 125, 100);
            ('PZ-OLVS', 'Olives', 55, 125, 50);
            ('PZ-CHVS', 'Chives', 55, 125, 50);
            ('BEV-LTCL', 'A Liter Cola', 3, 350, 24);
                
    `);

    console.log(`Database ready at ${filename}`);
    return db;
}

/**
 * Returns the existing database connection after init.
 */
export function getDb() {
    if (!db) throw new Error('Database not initialized — call initDb() first.');
    return db;
}
