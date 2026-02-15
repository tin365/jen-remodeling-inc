-- Optional: Seed initial reviews
-- Run this in Supabase Dashboard → SQL Editor after running schema.sql

INSERT INTO reviews (name, service, rating, text, helpful) VALUES
('Sarah Johnson', 'kitchen', 5, 'Absolutely amazing transformation! Our kitchen went from outdated to stunning. The team was professional, punctual, and the attention to detail was exceptional. Highly recommend!', 24),
('Michael Chen', 'basement', 5, 'We couldn''t be happier with our new basement entertainment room. They turned an unused space into the heart of our home. The quality of work exceeded our expectations.', 18),
('Emily Rodriguez', 'bathroom', 5, 'Our master bathroom is now a spa-like retreat. The team was incredibly responsive and worked within our budget. They helped us choose materials and the result is breathtaking!', 31),
('David Thompson', 'living-room', 4, 'Great experience overall. The living room remodel opened up our space beautifully. Minor delays due to material shortages, but they kept us informed every step of the way.', 12),
('Jennifer Martinez', 'kitchen', 5, 'From design to completion, everything was seamless. Our new kitchen is functional and gorgeous. The custom cabinets are exactly what we wanted!', 27),
('Robert Williams', 'basement', 5, 'Converted our basement into a home office and guest suite. The craftsmanship is top-notch. Very satisfied with the entire process and would definitely hire again.', 15),
('Lisa Anderson', 'bathroom', 4, 'Beautiful bathroom renovation. The walk-in shower is perfect. Only giving 4 stars because it took a week longer than expected, but the quality makes up for it.', 9),
('James Parker', 'kitchen', 5, 'Incredible work! They completely transformed our dated kitchen. The quartz countertops and modern fixtures are stunning. Professional team from start to finish.', 22),
('Amanda White', 'living-room', 5, 'Our living room looks like it''s from a magazine! The built-in entertainment center and new hardwood floors are perfect. Couldn''t be happier!', 19),
('Christopher Lee', 'basement', 4, 'Good quality work on our basement finishing. The space is much more usable now. Team was friendly and cleaned up well after each day. Would recommend.', 11),
('Michelle Taylor', 'bathroom', 5, 'Absolutely love our new bathroom! The tile work is flawless and the dual vanities are exactly what we needed. Very professional and respectful of our home.', 16),
('Daniel Brown', 'kitchen', 5, 'Best decision we made was hiring this team for our kitchen remodel. They listened to our needs and delivered beyond expectations. The island is the centerpiece of our home now!', 25);
