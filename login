curl -s -X POST 'http://localhost:5000/register' -H 'Content-Type: application/json' -d '{"username":"zeni","password":"1234"}'
{"message":"User already exists"}curl -s -X POST 'http://localhost:5000/customer/login' -H 'Content-Type: application/json' -d '{"username":"zeni","password":"1234"}'
Customer successfully logged in