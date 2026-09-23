import { database } from "../src/server/sqlite";

database().exec("PRAGMA integrity_check;");
console.log("Local SQLite development database is ready.");
