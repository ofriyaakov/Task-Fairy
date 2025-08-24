import appInit from "./server";

const port = process.env.PORT || 5000;

const buildApp = async () => {
  const app = await appInit();
}

buildApp();
