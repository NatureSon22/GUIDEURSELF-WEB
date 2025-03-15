// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// Switch to the 'GUIDEURSELF' database
db = db.getSiblingDB('GUIDEURSELF');

// Create a new document in the collection.
db.getCollection('activitylog').insertMany([
    {
        "user_number": "12345",
        "username": "johndoe",
        "firstname": "John",
        "lastname": "Doe",
        "role_type": "Admin",
        "campus_name": "My Campus",
        "action": "Created a new document"
    }
]);
