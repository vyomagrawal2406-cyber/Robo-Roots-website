# Gallery admin setup (Firebase, free plan)

The `/admin` page lets approved Google accounts add photos and videos to the Gallery
by pasting a Google Drive or YouTube link. No code changes needed after setup.

## One-time setup (about 10 minutes, done by Vyom with vyomagrawal2406@gmail.com)

1. Go to https://console.firebase.google.com and click **Create a project** (name: `roboroots`).
   Google Analytics can be turned off. The free **Spark** plan is enough; no card needed.
2. **Build > Authentication > Get started > Sign-in method > Google > Enable**. Save.
3. **Authentication > Settings > Authorized domains**: add the website's domain
   (for example `roboroots-learning-lab.lovable.app`, and any custom domain later).
4. **Build > Firestore Database > Create database** (production mode, any region near India, e.g. `asia-south1`).
5. **Firestore > Rules**: replace everything with the contents of `firestore.rules` from this repo. Click **Publish**.
6. **Project settings (gear icon) > General > Your apps > Web (`</>`)**. Register the app (no hosting).
   Copy these four values from the config it shows:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

   Add them to the website's environment variables (in Lovable, or a `.env` file locally).
   These values are safe to be public; the Firestore rules are what protect the data.

## Using it

- Open `yourwebsite/admin`, click **Sign in with Google**, use vyomagrawal2406@gmail.com.
- Paste a link, add a caption, choose Photo or Video and a category, click **Add to Gallery**.
- Google Drive files must be shared as **Anyone with the link can view**.
- Delete an item with the bin icon.

## Changing who has access

- There is no separate password. Access is tied to the Google account, so changing the
  Gmail password changes nothing on the site.
- The owner (vyomagrawal2406@gmail.com) can add or remove other admin emails at the bottom of `/admin`.
- To change the owner email itself, replace `vyomagrawal2406@gmail.com` in both
  `firestore.rules` (then Publish again in the console) and `src/lib/media.ts` (`OWNER_EMAIL`).

## Drive vs YouTube for videos

Both work. Drive is simplest since the videos are already there, but Drive can pause
playback on files watched very often and loads slower. For a big highlight video, upload it
to YouTube as **Unlisted** and paste that link instead.
