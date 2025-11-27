/*
  # Create Profiles Table with Admin Support

  ## Amaç
  Kullanıcı profillerini ve admin yetkilerini yönetmek için profiles tablosu oluşturuyoruz.

  ## Yeni Tablo

  ### profiles
  - `id` (uuid, primary key) - Supabase Auth user ID ile eşleşir
  - `email` (text) - Kullanıcı e-mail adresi
  - `full_name` (text) - Kullanıcı tam adı
  - `is_admin` (boolean) - Admin yetkisi kontrolü
  - `created_at` (timestamptz) - Kayıt tarihi
  - `updated_at` (timestamptz) - Güncelleme tarihi

  ## Güvenlik
  - RLS aktif
  - Kullanıcılar sadece kendi profillerini okuyabilir
  - Admin kontrolü middleware tarafından yapılır
  - Profil güncellemelerini sadece kullanıcının kendisi yapabilir

  ## Önemli Notlar
  ⚠️ Bu tablo Supabase Auth ile entegre çalışır
  ⚠️ is_admin default olarak false
  ⚠️ İlk admin kullanıcıyı manuel olarak Supabase Dashboard'dan true yapmanız gerekir
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  is_admin boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow profile creation on signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- Add helpful comment
COMMENT ON TABLE profiles IS 'Kullanıcı profilleri ve admin yetkileri. is_admin sütunu middleware tarafından admin erişim kontrolü için kullanılır.';
COMMENT ON COLUMN profiles.is_admin IS 'Admin yetkisi. İlk admin kullanıcıyı Supabase Dashboard üzerinden manuel olarak true yapın.';