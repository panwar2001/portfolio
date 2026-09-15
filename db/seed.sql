-- GENERATED FILE — do not edit by hand.
-- Source: app/lib/mock-data.ts  ·  Regenerate: npm run seed:generate
-- Applies to both `wrangler d1 execute --local` and `--remote`.

DELETE FROM product_screenshots;
DELETE FROM product_links;
DELETE FROM products;
DELETE FROM experience;
DELETE FROM stats;
DELETE FROM socials;
DELETE FROM profile;

INSERT INTO profile (id, name, headline, role, tagline, location, avatar_url, bio, email, availability) VALUES
  (1, 'Ayush Panwar', 'Indie app maker', 'App Developer', 'Engineer by day, indie app maker by night — building small apps for Android, iOS and the web.', 'India', NULL, 'I''m Ayush Panwar, an app developer who ships small, focused products.

I like apps that do one thing properly: an OCR scanner that turns any document into editable text, a dual-camera recorder for reactions, a PDF toolkit, a meditation timer that counts every second. No bloat, no dark patterns — local-first processing, privacy by default, and interfaces that stay out of the way.

Everything here is designed, built and maintained by me — from the screens and the store listings to the release pipeline. Same approach on every platform.', NULL, 'Open to freelance app work');

INSERT INTO stats (label, value, sort_order) VALUES
  ('Apps shipped', '4+', 1),
  ('Installs', '570+', 2),
  ('Platforms', '1', 3),
  ('Years building', '3+', 4);

INSERT INTO socials (label, url, icon, sort_order) VALUES
  ('Google Play', 'https://play.google.com/store/apps/dev?id=4944030915077582132', 'play', 1),
  ('GitHub', 'https://github.com/panwar2001', 'github', 2),
  ('LinkedIn', 'https://www.linkedin.com/in/panwar2001/', 'linkedin', 3),
  ('X', 'https://x.com/panwar_2001', 'x', 4),
  ('LeetCode', 'https://leetcode.com/u/panwar2001/', 'leetcode', 5);

INSERT INTO experience (role, company, period, summary, location, is_current, sort_order) VALUES
  ('Software Engineer', 'Accenture', 'Sep 2024 – Present', NULL, 'India', 1, 1),
  ('Software Engineer', 'Tally Solutions', 'Oct 2023 – Jan 2024', NULL, 'India', 0, 2);

INSERT INTO products (slug, title, tagline, description, platform, store_url, installs_label, min_installs, score, ratings, reviews, genre, released_at, updated_at, version, ad_supported, offers_iap, size_label, icon_url, header_image_url, accent_color, featured, sort_order) VALUES
  ('pdf-to-text-ai', 'PDF to Text AI', 'AI OCR scanner — extract editable text from any PDF, scan or photo.', 'Need a fast, accurate way to convert PDF to text? PDF to Text AI is an AI-powered PDF to text converter, OCR scanner, and text extractor for Android.

Whether you need to extract text from PDF files, scanned documents, images, receipts, invoices, books, notes, or contracts, the OCR engine returns clean, editable text in seconds. No manual retyping — this all-in-one image to text converter turns any non-editable file into something you can edit and share.

Key features
• PDF to text converter — multi-page documents, research papers and complex layouts.
• Smart AI OCR scanner — printed text, forms, business cards and handwriting via the camera.
• Image to text — import from the gallery, capture with live camera, extract instantly.
• Translation in 100+ languages, with downloadable offline language packs.
• Natural text to speech, so you can listen to documents instead of reading them.
• Biometric vault (fingerprint / face unlock) for sensitive history.
• Real-time search plus word, character and reading-time statistics.
• Built-in text editor and export to .TXT, email, WhatsApp, Drive or Slack.

Privacy first: files are processed locally on device wherever possible. Offline OCR and translation keep working without a connection.', 'android', 'https://play.google.com/store/apps/details?id=com.panwar2001.pdf2txt', '500+', 500, NULL, 0, 0, 'Productivity', '2024-02-12', '2026-08-04', '6.1.0', 1, 0, NULL, 'https://play-lh.googleusercontent.com/IRb1mfCw3PReJlzA-qmeHS8sM8WhIK5O2DodPicZR-Iv6Z1Qd41ith0j-XI1JVx89HaWk9yb8BalxgmeI8lIdQ', 'https://play-lh.googleusercontent.com/1eWyp1fkiieavZgZNjc35dL0JhPH-I5-Lxh4T3gUhYFZE-sZYWdiLgT0a0836K9o9wEOwhus0d0uj3fZJ_g9d3E', '#4f46e5', 1, 1),
  ('pdf-pro', 'Pdf Pro', 'Turn images into clean, shareable PDFs in a few taps.', 'Pdf Pro is a focused PDF toolkit for Android: convert images into high-quality PDF files, then share them anywhere.

Key features
• Image to PDF — batch your photos or scans into a single, well-formed document.
• Share PDFs — email, cloud services and any other share target straight from the app.
• Multi-language support: English, French, Hindi, Japanese and Russian.

Whether you''re filing a reimbursement, sending signed paperwork or building a portfolio, Pdf Pro keeps the flow short: pick, convert, share.', 'android', 'https://play.google.com/store/apps/details?id=com.panwar2001.pdfpro', '50+', 50, NULL, 0, 0, 'Tools', '2024-08-05', '2026-07-27', '2.0.1', 1, 0, NULL, 'https://play-lh.googleusercontent.com/Re8GOwx6JCE_PFqAFvk6dvyju4vBjvUwDH_mTQu8fLDFfx2wI54IelIxyR5jrjIlyx4qbbhCVJS0oPA_bMaRIg', 'https://play-lh.googleusercontent.com/ScUXoMNEDwQs87I5tRUwSzKIDeDCJLLu4bmM6UytuSdR7JVIWkGNuoxmKb8QZ1rzNTkrTpJGZBAVYY5mm5Kw', '#dc2626', 1, 2),
  ('paircam', 'PairCam', 'Dual-camera recorder — capture both sides of the story at once.', 'Paircam is a dual-camera video recorder for creators, vloggers and anyone who wants to capture more. Record with the front and back cameras simultaneously to make reaction videos, vlogs and dual-perspective memories in one take.

Why Paircam
• Dual-camera recording with Picture-in-Picture or split-view layouts.
• 100% private and offline — all merging happens on device with FFmpeg. No cloud uploads, no accounts, no data collection.
• High-quality processing straight to your gallery.
• Built-in gallery to review, manage and share recordings.
• Clean, simple interface: create instead of configure.

Perfect for reaction videos, vlogs, interviews, tutorials — or just showing your face and the scenery at the same time. Media never leaves the phone unless you choose to share it.', 'android', 'https://play.google.com/store/apps/details?id=com.panwar2001.paircam', '10+', 10, NULL, 0, 0, 'Photography', '2026-07-22', '2026-07-22', '1.1', 0, 0, NULL, 'https://play-lh.googleusercontent.com/4Lw_Slfv4LU9p4jFhmGDFWXefypO2oUpHymCUW6gpaYA2h2W6lWVM2p4qZEwoNvquq5UMAam5gG__yTJD955Pw', 'https://play-lh.googleusercontent.com/9JditDXmwldZnpgzwtoDe2XVbQQcjcF-XtQryHE4qFYMQ9DN8T_GZxYT-yEwb8bTnuur_EGhb6Gx5wpBddl0oQ', '#0891b2', 0, 3),
  ('alpha-wave', 'Meditation — Alpha Wave', 'Minimalist meditation timer with precise tracking and frequency soundscapes.', 'Find your center in the noise of the digital world. Alpha Wave is a hyper-minimalist mindfulness sanctuary built for deep relaxation and focused attention.

Precision tracking
Unlike apps that only count rounded minutes, Alpha Wave records every second of your practice and grows your daily streak. Your total time is shown with decimal-point accuracy.

Audio sanctuaries
Three master frequency layers, calibrated for different states:
• Movement Sanctuary (160 Hz) — an active drone to synchronise flow and settle physical anxiety.
• Just Relax Sanctuary (110 Hz) — deep grounding resonance to calm the heart and release tension.
• Lotus Sanctuary (220 Hz) — ethereal vibrations for quietude and non-dual awareness.

Also inside
• Zen dashboard with total minutes, streaks and a calendar of your journey.
• Curated journeys: Morning Clarity, Box Breathing, Somatic Tracking.
• Absolute privacy — everything stays on your device. No accounts, no cloud tracking.

Alpha Wave starts from a clean slate: no pre-filled data, no social pressure, just your own progress from day one.', 'android', 'https://play.google.com/store/apps/details?id=com.panwar2001.alphameditation', '10+', 10, NULL, 0, 0, 'Health & Fitness', '2026-05-23', '2026-05-23', '1.0', 0, 0, NULL, 'https://play-lh.googleusercontent.com/z7_HT08Z-e0SZ6iRK6vZYSlAOpFcOaZt2dW8K_giahOWgdVLMHJnoQuiWDHLL-jo_Hb2P_-XnT6tCN-BKRrRDug', 'https://play-lh.googleusercontent.com/cp_lOTotcUK6Xeakcy-NJr8en0U2cfBZnOre_ZdD5CcEDkaZvPYNP9kURMbPC6t0Z2PLnsPIUnId6BcFbHdjJJE', '#8b5cf6', 0, 4);

INSERT INTO product_links (product_slug, label, url, kind, sort_order) VALUES
  ('pdf-to-text-ai', 'Google Play', 'https://play.google.com/store/apps/details?id=com.panwar2001.pdf2txt', 'play', 1),
  ('pdf-to-text-ai', 'Privacy policy', 'https://sites.google.com/view/privacy-policy-pdf2txt?usp=sharing', 'privacy', 2),
  ('pdf-pro', 'Google Play', 'https://play.google.com/store/apps/details?id=com.panwar2001.pdfpro', 'play', 1),
  ('pdf-pro', 'Privacy policy', 'https://sites.google.com/view/privacy-policy-pdfpro?usp=sharing', 'privacy', 2),
  ('paircam', 'Google Play', 'https://play.google.com/store/apps/details?id=com.panwar2001.paircam', 'play', 1),
  ('paircam', 'Privacy policy', 'https://www.inovaforge.com/privacy-policy-paircam.html', 'privacy', 2),
  ('alpha-wave', 'Google Play', 'https://play.google.com/store/apps/details?id=com.panwar2001.alphameditation', 'play', 1),
  ('alpha-wave', 'Privacy policy', 'https://sites.google.com/view/meditation-app-privacy-policy?usp=sharing', 'privacy', 2);

INSERT INTO product_screenshots (product_slug, url, sort_order) VALUES
  ('pdf-to-text-ai', 'https://play-lh.googleusercontent.com/Pa39Ox3J3aHG2Qzy8WhSwPrTlqmofVGrWBepAZ6fnV7NPEu_qdIt07U90H22NGbES6YRENKW6tsRic3lmDM9', 1),
  ('pdf-to-text-ai', 'https://play-lh.googleusercontent.com/tPiV4DE5MaNEEOPPeky6WzT7rZZ0-5D91p9yb2s1y169UJv6QDhcnXLl3109L1cv5IBtDoyT0yZ539pup-Lzmw', 2),
  ('pdf-to-text-ai', 'https://play-lh.googleusercontent.com/Oao-tMJ_yhC2nO0Hi-fJgYNRt6JBxS6iZ1Z7_J8is_R2v8_ObmmEUAsl_eyGy4ZzBCPWAqIxNIpSf4ciLUKnQg', 3),
  ('pdf-to-text-ai', 'https://play-lh.googleusercontent.com/m5pvmMf2u3EoimCYShtXkPMOIGoU4RUUDaCYKaqKt2ZdxigOc6HlAuACJF1iCPcRCcvYrDRMXJpht3aq9pJwqQ', 4),
  ('pdf-pro', 'https://play-lh.googleusercontent.com/LhHYQZsny9gY1Em9CFoiHBJxiBuEme9Ie37VzHaffgAKLdeGLmutMOVnnq6u7fzXWJ6ss1nbsBcmx0eeW1HL', 1),
  ('pdf-pro', 'https://play-lh.googleusercontent.com/d80T2VHPgjUp6UwZaXdWxVH-PDqkXB70dEDuReTgiAQyG9HTwOCQjregl0X4e5Or0wQMCSZtQJ8TqN8J6MP2', 2),
  ('paircam', 'https://play-lh.googleusercontent.com/VZg-6Mg-FzhssSaxfke7xvsriJJCKwTuSHPKEyixTFagQC1eQAhtFMjKN6yNGVuUHHdYHUXElVttRJNk2mjjZQ', 1),
  ('paircam', 'https://play-lh.googleusercontent.com/Up91JvX0Sf-RAPBpvbBgIMVA3EjkVmSKvu3D78IRRl21rizyUbMELfWYZu3dHquNdxtBtIXes0yGA51u-leymw', 2),
  ('paircam', 'https://play-lh.googleusercontent.com/JyVTrkOzPoA9oeThKUBtQ9esSQcUE9jXLEcQCkPVK-45Dg0sCELTc0qmjnF3RgPWzWLB0blXABrtPcQsk6Bjzw', 3),
  ('paircam', 'https://play-lh.googleusercontent.com/AVKwLygygl-x2Yc2sKHHhQaD8v8wd2Q4y4G_Yrf8f8sRxuMBEMraARJJaiG0uLWzDIpFdr2O24tb9AZcwuNw5Q', 4),
  ('alpha-wave', 'https://play-lh.googleusercontent.com/HTvvGFc3WvUKhEoEa5x_q8CwqgkR8HJulfSlJwz0xOMZTfbL6XeCuocj7NoyUcL-WNppcp-KD7aWE44NXOyN', 1),
  ('alpha-wave', 'https://play-lh.googleusercontent.com/8dUE2rqmD2NPzM6e7xqxIS-1FZDKVAKGn3QTkCa3HT3inMrfUm92NdkYkcFrv2Ra38Z8uZk5oQlV4a4vtlyjlA', 2),
  ('alpha-wave', 'https://play-lh.googleusercontent.com/PnLUe56NwRYrzhjaDmho1iVW_nUA45O17JJmek7KjGBhqSlD_4ciIu6xL_CpAFYOn3wpWNWyeP_rjmf9v-gF', 3),
  ('alpha-wave', 'https://play-lh.googleusercontent.com/tD02OBqqPGIStEK88Qw4BM1jEln_sNytgtP8XZRW-nIyPlvHyus9J1bWUEFUdDCBtZUpaBYK1BM-2n2EKw3n1w', 4);

