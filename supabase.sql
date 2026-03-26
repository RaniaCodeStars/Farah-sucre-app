-- ============================================================
-- FARAH SUCRÉ — Supabase Schema
-- Colle ce fichier dans Supabase > SQL Editor > Run
-- ============================================================

-- 1. TABLE: profiles (liée à auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nom text not null default '',
  tel text default '',
  adresse text default '',
  commune text default '',
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Auto-créer un profil quand un user s'inscrit
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nom)
  values (new.id, coalesce(new.raw_user_meta_data->>'nom', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. TABLE: halwas
create table public.halwas (
  id serial primary key,
  nom text not null,
  type text not null check (type in ('traditionnels', 'sablees', 'moa3ssalat')),
  description text default '',
  prix integer not null,
  image_url text default '',
  disponible boolean default true,
  bestseller boolean default false,
  created_at timestamptz default now()
);

-- 3. TABLE: orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  nom_client text not null,
  tel text not null,
  adresse text not null,
  commune text not null,
  deadline date not null,
  notes text default '',
  items jsonb not null default '[]',
  total integer not null default 0,
  status text not null default 'en_attente'
    check (status in ('en_attente','confirmee','en_preparation','prete','en_livraison','livree','annulee')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- 4. TABLE: reviews
create table public.reviews (
  id serial primary key,
  user_id uuid references auth.users(id) on delete set null,
  nom_auteur text not null,
  commune text default '',
  note integer not null check (note between 1 and 5),
  texte text not null,
  likes integer default 0,
  visible boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.halwas enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;

-- profiles: chaque user voit/modifie le sien. Admin voit tout.
create policy "profiles: voir le sien" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: modifier le sien" on public.profiles
  for update using (auth.uid() = id);

-- halwas: tout le monde peut lire
create policy "halwas: lecture publique" on public.halwas
  for select using (true);
-- seul admin peut modifier (via service_role key en prod)
create policy "halwas: admin write" on public.halwas
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- orders: client voit les siennes. Admin voit toutes.
create policy "orders: client voit les siennes" on public.orders
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
create policy "orders: client peut créer" on public.orders
  for insert with check (true);
create policy "orders: admin peut modifier" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- reviews: lecture publique, création authentifiée
create policy "reviews: lecture publique" on public.reviews
  for select using (visible = true);
create policy "reviews: créer si connecté" on public.reviews
  for insert with check (auth.uid() is not null);
create policy "reviews: admin tout" on public.reviews
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- ENABLE REALTIME sur orders
-- ============================================================
alter publication supabase_realtime add table public.orders;

-- ============================================================
-- DONNÉES DE DÉPART — Halwas
-- ============================================================
insert into public.halwas (nom, type, description, prix, bestseller) values
('Baklawa Royale',     'traditionnels', 'Pâte fine au beurre clarifié, farce aux amandes, sirop fleur d''oranger', 1440, true),
('Makrout el Louz',    'traditionnels', 'Semoule fine, pâte d''amandes, miel ambré', 1200, true),
('Zlabia',             'traditionnels', 'Beignets croustillants au sirop de miel', 900, false),
('Griwech',            'traditionnels', 'Pâtisserie frite, miel, sésame doré', 980, false),
('Ghoriba Djouz',      'sablees',       'Sablé fondant, cœur de noix, sucre glace', 950, true),
('Samsa',              'sablees',       'Pâte feuilletée, amandes, cannelle', 1100, false),
('Mchewek',            'sablees',       'Sablé moelleux aux amandes grillées', 880, false),
('Kalb el Louz',       'sablees',       'Gâteau de semoule, miel, fleur d''oranger', 1050, false),
('Chamia Kawkaw',      'moa3ssalat',    'Nougat tendre, cacahuètes caramélisées', 800, false),
('Halwa Dial',         'moa3ssalat',    'Confiture de figues, sésame, miel', 750, false),
('Nougat Blanc',       'moa3ssalat',    'Nougat moelleux aux amandes et pistaches', 920, false),
('Simsimiya',          'moa3ssalat',    'Praline de sésame, miel floral', 700, false);

-- ============================================================
-- METTRE TON COMPTE ADMIN
-- Après ton inscription, lance cette commande avec ton email:
-- update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'ton@email.com');
-- ============================================================
