# Admin portal setup (Supabase, free plan)

`/admin` lets approved people sign in with email + password and:

- **Lessons tab**: add a YouTube video and/or a PDF / PowerPoint (upload or link). It appears on `/learn`.
- **Gallery tab**: add photos/videos (Google Drive or YouTube links). They appear on `/gallery`.
- **Admins tab**: choose who else can edit.

## One-time setup (about 10 minutes)

1. **Keys**: Supabase > Project Settings > API Keys. Put the **Project URL** and the
   **publishable key** in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, see
   `.env.example`) and in Vercel > Settings > Environment Variables.
   **Never** put the secret key (`sb_secret_...`) in the website.
2. **Admin login**: Authentication > Users > **Add user** > Create new user. Enter the admin's
   email and password and tick **Auto Confirm User**.
3. **Turn off public sign-ups**: Authentication > Sign In / Providers > turn off
   **Allow new users to sign up**. Save.
4. **Database**: open `supabase/setup.sql`, replace `ADMIN_EMAIL_HERE` (last line) with the
   email from step 2, paste the whole file into SQL Editor > New query, and click **Run**.
5. **Redirect URL** (for password-reset emails): Authentication > URL Configuration > Site URL:
   the website's address.

## Using it

- Go to `yourwebsite/admin` and sign in.
- **Videos**: upload to YouTube as **Unlisted** (or Public), copy the link, paste it in the lesson.
- **Slides / notes**: upload a PDF, PPT/PPTX or DOC/DOCX (max 50 MB), or paste a Google Slides /
  Drive link shared as "Anyone with the link can view". PDFs display best on phones, so exporting
  slides as PDF is recommended.
- Edit with the pencil icon and delete with the bin icon. Deleting a lesson also deletes its
  uploaded file.

## Passwords and access

- Change a password or reset a forgotten one: Supabase > Authentication > Users > the user's
  `...` menu.
- Add another editor: create their user (step 2), then add their email in the **Admins** tab.
  An email that has a login but is not on the admin list can sign in but cannot change anything.

## Free plan limits

1 GB file storage, 50 MB per file, 500 MB database. Free projects pause after 7 days with no
activity. Visitors opening the website count as activity, and a paused project can be restored
from the dashboard.
