BASE_DIR=$(realpath)

services=(
    "$BASE_DIR/Codes/user_service"
    "$BASE_DIR/Codes/category_service"
    "$BASE_DIR/Codes/api_gateway"
    "$BASE_DIR/Codes/client_interface"
)

for service in "${services[@]}"; do
    osascript -e "tell application \"Terminal\" to do script \"cd $service && nodemon server.js\""
done