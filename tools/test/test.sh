echo "test token"
curl -X POST http://localhost:8080/api/token/ -H "Content-Type: application/json" -d '{"username":"adm","password":"123456yxcvbn##"}'

pip install PyJWT

python check_token.py