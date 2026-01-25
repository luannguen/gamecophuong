-- Add image_url column to video_categories if it doesn't exist
alter table video_categories add column if not exists image_url text;

-- Clear existing data to ensure clean slate (optional, but safer for seeding demo data)
truncate table video_categories cascade;

-- Seed Categories with Rich Graphics (using mockup assets)
insert into video_categories (name, icon, color, image_url) values
(
  'Animals', 
  'pets', 
  '#FF8CBE', -- Pink
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDP2B_YKvQjZpPdgqhYeb3JEpLdTiWl8MYqG7igxGJIocsDqVAfcfRF9XKRfoPY1xNQ88SiPh61XjCGjq1GA_Tt94TEXI6N0w_odP72ra9uCehJ-8qp9xDENRcAFP0uvYO9LxrMuEgCtRBnhOGtpY0jcJv51V8N6yLub703wAaMqEzraHmcyUt1U1v5rUuEQxa0Y5M-w9IQcGuX8eMK5FedfAxK7fkff8SO9FxyaqT3Mz1oAQ6jaroZKkMTCG54qDdRWC361aUzQDU'
),
(
  'Family', 
  'diversity_3', 
  '#FCCD2B', -- Yellow
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlDxR7C3_vLQN95kUCHrufcJeu7orvvTEscElUJzFX-j3hxAvDxPl8D1n_nkQ1qxKEERZMKdWTuxKMqF0xWNjbNQ14kTRlWB7NNKYhtRuBfamYmgbahUzdAdRP2UMeLqGFf5KwegkmksmrlhRVzDzwH04UQ7lN8pm_B1oSMC_PqJaxtzHX1mdwVGtU8tIS-CNP-9vzuInWl5XFP7DG_SOUi2Hcqlcrk0Mo_hlVlgi6Zrg69nRrvGJEVyAVuQ0Lkbc47k6LUFko35w'
),
(
  'Foods', 
  'restaurant', 
  '#26d9d9', -- Primary Teal
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDx6-N2rAXSrwFq-26Y55lmm2tMKnfML6QL6SDUScpCMSUbHZheQhausPbtrNwtisiifpfQrCAPn9DFE52N8oNQvmPzd45JapdGqY2YUtdkkPuZJ6-sgreHoWdNN-bZCDXju8ayZl3-Ynw7Pkuc_Jg6hz0KzsStusaq8eu56A_YBE42ZYvz4QFJdImdNPPJTgWBn8FXgtYYCp2A0QYcRLCqsffisEosd-rw6d9yiXfhv7WBI7sbNsJTqjs6rQxIFqNH65b5a3kMqF4'
),
(
  'School', 
  'school', 
  '#A855F7', -- Purple
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAs4UEenaAPcJeTtGieLaRAKUqXuA_ExjnAmGOna36XFwyMBEztsyvTdVlXTO4P2DJ0BByyqDk5ppEqIbMjOfOsYu2VaOdbmxNjOeCxPgBUTiyRRt-H1j1bvEswgXZnKQZCR1iaFubCOOWFquHD0y9YQz6DOOc7uT_6WttcLd_Z5IcLkVyTSeAHOe2mkcHDDBGbuZ7AovO48iUaEKCX6MZj6YxmJOzogNpmn9ACg5AYmUK6CmYyynv5kWjMsgROXVRILvOP8WL7q4U'
),
(
  'My Home', 
  'cottage', 
  '#F97316', -- Orange
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxmRMVM5Til8HoSOgyoa7DZJBTMXAEr6-7Cjy8w8QAIE9X6pIq50Wti7FmqnO8cnGPoNN8P4z0LzZZ5xE5IJmw5DV3nTxBA4Cf-nlLJVkOGAW-Xnecdqd73fAqfjEeeIVN0zXELpKcz5cAU2O0lFv5NIsW1cIHlNLN2_kdZoyYrzpsSdKgED3tVeIw-aRId3yOPa-UvW8zJn6VpPHUwI4OQniRiJvTgof3g4q7nWvyzCoTd0DCpovg2IDSaxC3hD025QlkkR4EGjs'
),
(
  'Music', 
  'music_note', 
  '#EC4899', -- Pink Dark
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAa-D_16tkmmLlQK6de_4ARj0fGpfsFTEKg2dgMX2f9V42cOaGhpMwslqMo1JALBSiuZfokKVhPLe9Vlz-5lcXH9qBL9deTI7MLwg3AHw_C2aYEOnagdLvmDdn7X34riT023UnkNp6vIe44m7yodoFQrXvOXvqhxyrUxL9fD1EUZ_3z2liM1xP-Q87W-KDf66sa-MyC2MmVMCY-V7Rp7I1FCosQob6vpHCCuB14_tlqlZEA0-gtnR7YTkaCMjB3JXlAjgajaNiexpQ'
);
