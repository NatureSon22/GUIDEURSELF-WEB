// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('GUIDEURSELF');

// Create a new document in the collection.
db.getCollection('users').insertOne(  {
    "user_number": "B3056-1589",
    "username": "jperez",
    "email": "jperez@example.com",
    "firstname": "Juan",
    "middlename": "Cruz",
    "lastname": "Perez",
    "role_id": "6763b9c320a290da8481665f",
    "custom_permissions": [],
    "campus_id": "67831e0e6502c14535cfe742",
    "password": "password"
  });
