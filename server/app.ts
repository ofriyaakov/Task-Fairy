import appInit from "./server";

const port = process.env.PORT || 5000;

const buildApp = async () => {
  const app = await appInit();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

buildApp();
