curl -s -X POST 'http://localhost:5000/register' -H 'Content-Type: application/json' -d '{"username":"zeni","password":"1234"}'
{"message":"User successfully registered. Now you can login"}
curl -s -X POST 'http://localhost:5000/customer/login' -H 'Content-Type: application/json' -d '{"username":"zeni","password":"1234"}'
Customer successfully logged in
