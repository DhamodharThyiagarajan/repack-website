# Authentication & Route Authorization Flow

This document details how the authentication and route authorization system is structured across the frontend (React + Redux) and backend (Express + Firebase Admin + MongoDB).

---

## 1. Frontend Login & Token Generation

The login process is managed in [Login.jsx](file:///d:/AlmaBetter/explore/client/src/pages/Login.jsx). It offers two authentication flows:

### Google Sign-In (Production Flow)
1. The React app initiates login using the Firebase Client SDK configuration loaded in [firebase.js](file:///d:/AlmaBetter/explore/client/src/firebase.js):
   ```javascript
   const result = await signInWithPopup(auth, googleProvider);
   ```
2. Once Google verifies the user, the client fetches a short-lived JSON Web Token (JWT) ID token from Firebase:
   ```javascript
   const token = await result.user.getIdToken();
   ```
3. The client sends a `POST` request to the backend route `/api/auth/google` with the token in the body.

### Mock Email Sign-In (Local Developer Flow)
* To simplify local testing without setting up Firebase credentials, developers can input an email.
* The frontend generates a mock token format: `dev-email-token:<email>`.
* The client sends this mock token to the backend `/api/auth/google` route.

---

## 2. Backend Verification & MongoDB Ingestion

The backend receives the token at `/api/auth/google` in [authRoutes.js](file:///d:/AlmaBetter/explore/server/routes/authRoutes.js):

### Token Processing
* If the token is a developer mock token (e.g., starts with `dev-email-token:`), the verification step is bypassed, and Mock details (`uid`, `email`, `name`) are extracted directly from the string.
* For production tokens, the **Firebase Admin SDK** validates the token signature and expiration:
  ```javascript
  decodedToken = await getAuth().verifyIdToken(token);
  ```

### User Sync / Upsert (MongoDB)
* The server searches MongoDB for a user matching the Firebase `uid` (`firebaseUid` field in MongoDB).
* If no matching user exists, the server creates a new MongoDB user record.
* The server marks the user as `isAdmin` if they are the first user in the database or if their email is part of the hardcoded list `['admin@fitgirl.site', 'dhamodhar200@gmail.com']`.

### Response
* The server returns the user's MongoDB profile (`_id`, `username`, `email`, `isAdmin`) along with the `token` back to the frontend.

---

## 3. Frontend State and Storage

Once the frontend receives the user profile from the server:

* **Redux Dispatch:** [Login.jsx](file:///d:/AlmaBetter/explore/client/src/pages/Login.jsx) dispatches the `loginUser(data)` action in [actions.js](file:///d:/AlmaBetter/explore/client/src/redux/actions.js).
* **State & LocalStorage Sync:**
  * The user object is saved to `localStorage`:
    ```javascript
    localStorage.setItem('user', JSON.stringify(user));
    ```
  * [reducer.js](file:///d:/AlmaBetter/explore/client/src/redux/reducer.js) initializes the Redux store state (`state.user`) using the user object stored in `localStorage`. This keeps the session alive when the user refreshes their browser.

---

## 4. Authenticated Client Requests

When the user attempts an operation on a protected page (such as adding a repack in [Admin.jsx](file:///d:/AlmaBetter/explore/client/src/pages/Admin.jsx) or posting a comment), the frontend attaches the stored token to the `Authorization` header:

```javascript
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${user.token}`,
}
```

---

## 5. Backend Middleware Protection (`protect` & `admin`)

Protected routes in the backend are guarded by middlewares defined in [authMiddleware.js](file:///d:/AlmaBetter/explore/server/middleware/authMiddleware.js):

### The `protect` Middleware
1. It looks for the incoming `Authorization` header containing the prefix `Bearer `.
2. It extracts the token.
3. If it matches a dev mock token, it bypasses Firebase verification, loads or creates the mock user in the database, binds it to `req.user`, and calls `next()`.
4. Otherwise, it verifies the token with Firebase Admin:
   ```javascript
   const decodedToken = await getAuth().verifyIdToken(token);
   ```
5. It fetches the user's full document from MongoDB using the verified Firebase ID:
   ```javascript
   let user = await User.findOne({ firebaseUid: decodedToken.uid });
   ```
6. It assigns the database user object to the request object:
   ```javascript
   req.user = user;
   next();
   ```
7. If the token is invalid or missing, it responds with `401 Unauthorized` and stops the request.

### The `admin` Middleware
For routes requiring administrator rights, the `admin` middleware runs after `protect`:

```javascript
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
```
If the user's `isAdmin` property in MongoDB is not `true`, the middleware intercepts the request and responds with a `403 Forbidden`.
