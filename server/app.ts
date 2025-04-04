import appInit from "./server";
import db from "./src/config/db";

const port = process.env.PORT || 5000;

const testDB = async () => {
  try {
    const result = await db.query('SELECT * FROM user_levels');
    console.log("All user levels:",result.rows);
  } catch (err) {
    console.error(err);
  }
}

const buildApp = async () => {
  const app = await appInit();

  app.listen(port, () => {
    testDB(); // TODO: Delete later - only test DB connection
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

buildApp();
