-- Preserve existing bundle data and permissions. Already applied on the live VPS.
ALTER TABLE public.bundle_items ADD COLUMN IF NOT EXISTS custom_label text;
ALTER TABLE public.bundle_items ADD COLUMN IF NOT EXISTS custom_icon_url text;
