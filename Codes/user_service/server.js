const app = require("./src/app");
const config = require("./src/config/config");

app.listen(config.PORT, () => {
  console.log(`User service running on port ${config.PORT}`);
});
