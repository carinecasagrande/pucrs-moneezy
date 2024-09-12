const app = require("./src/app");
const config = require("./src/config/config");

app.listen(config.port, () => {
  console.log(`User service running on port ${config.port}`);
});
