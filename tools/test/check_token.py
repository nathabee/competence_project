import subprocess
import jwt
import json

# curl -X POST http://localhost:8080/api/token/ 
# -H "Content-Type: application/json" 
# -d '{"username":"adm","password":"123456yxcvbn##"}'



# Function to get the JWT token
def get_jwt_token(username, password):
    url = "http://localhost:8080/api/token/"
    headers = {"Content-Type": "application/json"}
    data = json.dumps({"username": username, "password": password})

    #    ["curl", "-X", "POST", url, "-H", "Content-Type: application/json", "-d", data],

    # Use curl to send the POST request
    response = subprocess.run(
        ["curl", "-X", "POST", url, "-H", "Content-Type: application/json", "-d", data],
        capture_output=True,
        text=True
    )

    print("Response:", response)  # Log the entire response for debugging

    if response.returncode != 0:
        print("Error fetching token:", response.stderr)
        return None

    # Parse the JSON response
    response_data = json.loads(response.stdout)
    return response_data.get("access")  # Return the access token

# Function to decode the JWT token
def decode_jwt(token):
    try:
        # Decode the JWT token without verifying the signature
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded
    except jwt.DecodeError as e:
        print("Error decoding token:", e)
        return None

if __name__ == "__main__":
    username = "all"
    password = "123456yxcvbn##"

    # Get the JWT token
    print(f"Looking for token for username: {username}")
    token = get_jwt_token(username, password)
    if token:
        print("Access Token:", token)

        # Decode the token and print roles
        decoded_token = decode_jwt(token)
        if decoded_token:
            print("Decoded Token:", json.dumps(decoded_token, indent=4))
            roles = decoded_token.get("roles", [])
            print("Roles:", roles)
    else:
        print("No token found.")
