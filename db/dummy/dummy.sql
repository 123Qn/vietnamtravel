-- Regions
INSERT INTO regions (name, description) VALUES
('Northern Vietnam','The northern region of Vietnam'),
('Central Vietnam','The central region of Vietnam'),
('Southern Vietnam','The southern region of Vietnam');

-- Cities
INSERT INTO cities (name, description, population, weather, region_id) VALUES
('Hanoi','Capital of Vietnam',8000000,'{"temp":28,"condition":"Sunny"}',1),
('Ho Chi Minh City','Largest city in Vietnam',9000000,'{"temp":32,"condition":"Hot"}',3);

-- Destinations
INSERT INTO destinations (name, description, images, location, city_id) VALUES
('Hoan Kiem Lake','Famous lake in Hanoi',ARRAY['hoankiem1.jpg','hoankiem2.jpg'],'Hanoi center',1),
('Ben Thanh Market','Popular market in HCM City',ARRAY['benthanh1.jpg','benthanh2.jpg'],'District 1',2);

-- Events
INSERT INTO events (destination_id,name,description,start_date,end_date) VALUES
(1,'Mid-Autumn Festival','Celebration at Hoan Kiem Lake','2025-09-25','2025-09-27');

-- Foods
INSERT INTO foods (destination_id,name,description) VALUES
(1,'Pho','Vietnamese noodle soup'),
(2,'Banh Mi','Vietnamese sandwich');

-- Restaurants
INSERT INTO restaurants (name,address,phone) VALUES
('Pho 10','10 Ly Quoc Su, Hanoi','0123456789'),
('Banh Mi Huynh Hoa','26 Le Thi Rieng, HCM','0987654321');

-- Food-Restaurant link
INSERT INTO food_restaurants (food_id,restaurant_id) VALUES
(1,1),
(2,2);

-- Translations
INSERT INTO translations (item_type,item_id,lang,name,description) VALUES
('destination',1,'vi','Hồ Hoàn Kiếm','Hồ nổi tiếng ở Hà Nội'),
('destination',1,'en','Hoan Kiem Lake','Famous lake in Hanoi'),
('food',1,'vi','Phở','Món phở Việt Nam'),
('food',1,'en','Pho','Vietnamese noodle soup');
--experience
INSERT INTO experiences (type,item_id,name,comment,rating,image_url) VALUES
('destination',1,'Quan','Beautiful place to walk around',9,NULL),
('food',1,'Lan','Pho is so tasty!',10,NULL),
('restaurant',2,'Minh','Great banh mi and service',8,NULL),
('destination',2,'Huong','Busy but fun market',7,NULL);
-- Contributed table (pending submissions by users)
INSERT INTO contributed (type, item_id, name, comment, rating, image_url)
VALUES
('destination', 1, 'Nam', 'Loved the lake at sunset!', 8, NULL),
('food', 2, 'Thao', 'Banh Mi is delicious!', 9, NULL),
('restaurant', 1, 'Anh', 'Pho 10 has great broth', 10, NULL);