--
-- PostgreSQL database dump
--

\restrict x89A35UWnMtulQw2wlAzRcoXJycMprxV3ylzjv4O1BjCzBEMbual9N57tXU0SWX

-- Dumped from database version 16.12 (6d3029c)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: _system; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA _system;


ALTER SCHEMA _system OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: replit_database_migrations_v1; Type: TABLE; Schema: _system; Owner: neondb_owner
--

CREATE TABLE _system.replit_database_migrations_v1 (
    id bigint NOT NULL,
    build_id text NOT NULL,
    deployment_id text NOT NULL,
    statement_count bigint NOT NULL,
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE _system.replit_database_migrations_v1 OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE; Schema: _system; Owner: neondb_owner
--

CREATE SEQUENCE _system.replit_database_migrations_v1_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE _system.replit_database_migrations_v1_id_seq OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE OWNED BY; Schema: _system; Owner: neondb_owner
--

ALTER SEQUENCE _system.replit_database_migrations_v1_id_seq OWNED BY _system.replit_database_migrations_v1.id;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admin_users OWNER TO neondb_owner;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO neondb_owner;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: blog_articles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.blog_articles (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    image_url text NOT NULL,
    external_url text NOT NULL,
    category text NOT NULL,
    strip_position integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.blog_articles OWNER TO neondb_owner;

--
-- Name: blog_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.blog_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_articles_id_seq OWNER TO neondb_owner;

--
-- Name: blog_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.blog_articles_id_seq OWNED BY public.blog_articles.id;


--
-- Name: car_listings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.car_listings (
    id integer NOT NULL,
    vehicle_number text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    variant text,
    year integer NOT NULL,
    fuel_type text NOT NULL,
    transmission text NOT NULL,
    kilometers integer NOT NULL,
    color text,
    owner_count integer DEFAULT 1,
    location text NOT NULL,
    state text,
    rto_code text,
    expected_price integer NOT NULL,
    description text,
    image_urls text[],
    seller_name text NOT NULL,
    seller_phone text NOT NULL,
    seller_email text,
    status text DEFAULT 'pending'::text NOT NULL,
    is_approved boolean DEFAULT false,
    session_id text,
    insurance_valid boolean DEFAULT false,
    rc_status text,
    engine_number text,
    chassis_number text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    rc_document_url text,
    insurance_document_url text,
    other_document_urls text[],
    hide_number_plate boolean DEFAULT false,
    remove_watermark boolean DEFAULT false
);


ALTER TABLE public.car_listings OWNER TO neondb_owner;

--
-- Name: car_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.car_listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.car_listings_id_seq OWNER TO neondb_owner;

--
-- Name: car_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.car_listings_id_seq OWNED BY public.car_listings.id;


--
-- Name: car_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.car_reviews (
    id integer NOT NULL,
    car_id integer NOT NULL,
    session_id text NOT NULL,
    rating integer NOT NULL,
    review_text text,
    reviewer_name text,
    is_helpful boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.car_reviews OWNER TO neondb_owner;

--
-- Name: car_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.car_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.car_reviews_id_seq OWNER TO neondb_owner;

--
-- Name: car_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.car_reviews_id_seq OWNED BY public.car_reviews.id;


--
-- Name: cars; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cars (
    id integer NOT NULL,
    name text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    price integer NOT NULL,
    fuel_type text NOT NULL,
    transmission text NOT NULL,
    kilometers integer NOT NULL,
    location text NOT NULL,
    image_url text NOT NULL,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    variant text,
    ownership text
);


ALTER TABLE public.cars OWNER TO neondb_owner;

--
-- Name: cars_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cars_id_seq OWNER TO neondb_owner;

--
-- Name: cars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cars_id_seq OWNED BY public.cars.id;


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    title text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.conversations OWNER TO neondb_owner;

--
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.conversations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversations_id_seq OWNER TO neondb_owner;

--
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- Name: dealer_cities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dealer_cities (
    id integer NOT NULL,
    name text NOT NULL,
    region text NOT NULL,
    dealer_count integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    image_url text
);


ALTER TABLE public.dealer_cities OWNER TO neondb_owner;

--
-- Name: dealer_cities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dealer_cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dealer_cities_id_seq OWNER TO neondb_owner;

--
-- Name: dealer_cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dealer_cities_id_seq OWNED BY public.dealer_cities.id;


--
-- Name: marketing_banners; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.marketing_banners (
    id integer NOT NULL,
    title text NOT NULL,
    subtitle text,
    description text,
    cta_text text,
    cta_link text,
    image_url text,
    "position" text DEFAULT 'homepage'::text,
    is_active boolean DEFAULT true,
    priority integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.marketing_banners OWNER TO neondb_owner;

--
-- Name: marketing_banners_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.marketing_banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketing_banners_id_seq OWNER TO neondb_owner;

--
-- Name: marketing_banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.marketing_banners_id_seq OWNED BY public.marketing_banners.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    conversation_id integer NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.messages OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notification_subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_subscriptions (
    id integer NOT NULL,
    email text,
    phone text,
    session_id text NOT NULL,
    notify_price_drops boolean DEFAULT false,
    notify_new_listings boolean DEFAULT false,
    preferred_brands text[],
    budget_min integer,
    budget_max integer,
    preferred_locations text[],
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notification_subscriptions OWNER TO neondb_owner;

--
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notification_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_subscriptions_id_seq OWNER TO neondb_owner;

--
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notification_subscriptions_id_seq OWNED BY public.notification_subscriptions.id;


--
-- Name: nxcar_locations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.nxcar_locations (
    id integer NOT NULL,
    city text NOT NULL,
    location text NOT NULL,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    phone text,
    email text
);


ALTER TABLE public.nxcar_locations OWNER TO neondb_owner;

--
-- Name: nxcar_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.nxcar_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nxcar_locations_id_seq OWNER TO neondb_owner;

--
-- Name: nxcar_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.nxcar_locations_id_seq OWNED BY public.nxcar_locations.id;


--
-- Name: platform_feedback; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.platform_feedback (
    id integer NOT NULL,
    session_id text NOT NULL,
    feedback_type text NOT NULL,
    feedback_text text NOT NULL,
    rating integer,
    email text,
    name text,
    page text,
    user_agent text,
    is_resolved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.platform_feedback OWNER TO neondb_owner;

--
-- Name: platform_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.platform_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.platform_feedback_id_seq OWNER TO neondb_owner;

--
-- Name: platform_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.platform_feedback_id_seq OWNED BY public.platform_feedback.id;


--
-- Name: sell_car_leads; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sell_car_leads (
    id integer NOT NULL,
    car_number text NOT NULL,
    name text,
    phone text,
    email text,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sell_car_leads OWNER TO neondb_owner;

--
-- Name: sell_car_leads_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sell_car_leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sell_car_leads_id_seq OWNER TO neondb_owner;

--
-- Name: sell_car_leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sell_car_leads_id_seq OWNED BY public.sell_car_leads.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: site_content; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.site_content (
    id integer NOT NULL,
    section_key text NOT NULL,
    title text,
    subtitle text,
    description text,
    cta_text text,
    cta_link text,
    image_url text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.site_content OWNER TO neondb_owner;

--
-- Name: site_content_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.site_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_content_id_seq OWNER TO neondb_owner;

--
-- Name: site_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.site_content_id_seq OWNED BY public.site_content.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    image_url text NOT NULL,
    testimonial_text text NOT NULL,
    car_sold_or_bought text NOT NULL,
    rating integer DEFAULT 5,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    google_review_link text
);


ALTER TABLE public.testimonials OWNER TO neondb_owner;

--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.testimonials_id_seq OWNER TO neondb_owner;

--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: user_car_preferences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_car_preferences (
    id integer NOT NULL,
    session_id text NOT NULL,
    budget_min integer,
    budget_max integer,
    preferred_brands text[],
    preferred_fuel_types text[],
    preferred_transmissions text[],
    preferred_locations text[],
    max_kilometers integer,
    min_year integer,
    usage_type text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_car_preferences OWNER TO neondb_owner;

--
-- Name: user_car_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_car_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_car_preferences_id_seq OWNER TO neondb_owner;

--
-- Name: user_car_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_car_preferences_id_seq OWNED BY public.user_car_preferences.id;


--
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_favorites (
    id integer NOT NULL,
    session_id text NOT NULL,
    car_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_favorites OWNER TO neondb_owner;

--
-- Name: user_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorites_id_seq OWNER TO neondb_owner;

--
-- Name: user_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_favorites_id_seq OWNED BY public.user_favorites.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    phone character varying,
    city character varying
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1 id; Type: DEFAULT; Schema: _system; Owner: neondb_owner
--

ALTER TABLE ONLY _system.replit_database_migrations_v1 ALTER COLUMN id SET DEFAULT nextval('_system.replit_database_migrations_v1_id_seq'::regclass);


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: blog_articles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_articles ALTER COLUMN id SET DEFAULT nextval('public.blog_articles_id_seq'::regclass);


--
-- Name: car_listings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.car_listings ALTER COLUMN id SET DEFAULT nextval('public.car_listings_id_seq'::regclass);


--
-- Name: car_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.car_reviews ALTER COLUMN id SET DEFAULT nextval('public.car_reviews_id_seq'::regclass);


--
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- Name: dealer_cities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dealer_cities ALTER COLUMN id SET DEFAULT nextval('public.dealer_cities_id_seq'::regclass);


--
-- Name: marketing_banners id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketing_banners ALTER COLUMN id SET DEFAULT nextval('public.marketing_banners_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notification_subscriptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.notification_subscriptions_id_seq'::regclass);


--
-- Name: nxcar_locations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nxcar_locations ALTER COLUMN id SET DEFAULT nextval('public.nxcar_locations_id_seq'::regclass);


--
-- Name: platform_feedback id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_feedback ALTER COLUMN id SET DEFAULT nextval('public.platform_feedback_id_seq'::regclass);


--
-- Name: sell_car_leads id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sell_car_leads ALTER COLUMN id SET DEFAULT nextval('public.sell_car_leads_id_seq'::regclass);


--
-- Name: site_content id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.site_content ALTER COLUMN id SET DEFAULT nextval('public.site_content_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Name: user_car_preferences id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_car_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_car_preferences_id_seq'::regclass);


--
-- Name: user_favorites id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_favorites ALTER COLUMN id SET DEFAULT nextval('public.user_favorites_id_seq'::regclass);


--
-- Data for Name: replit_database_migrations_v1; Type: TABLE DATA; Schema: _system; Owner: neondb_owner
--

COPY _system.replit_database_migrations_v1 (id, build_id, deployment_id, statement_count, applied_at) FROM stdin;
1	cc84c90e-45b8-4af6-9d7e-7dfe5623f1b7	53ecb92b-0448-4046-a951-5daf794e7539	5	2026-01-28 04:40:35.761544+00
2	99ce05e9-a45c-4e2c-810d-51012081b19d	53ecb92b-0448-4046-a951-5daf794e7539	7	2026-01-28 06:43:41.626011+00
3	bb06e19b-ea5d-4649-9cab-11bbb91ab424	53ecb92b-0448-4046-a951-5daf794e7539	1	2026-01-28 15:17:22.803261+00
4	3d2191c9-ba9a-47d7-bba0-ba679565c004	53ecb92b-0448-4046-a951-5daf794e7539	1	2026-01-28 17:10:41.608485+00
5	4fdead2f-e442-4c92-9012-46c842de9209	53ecb92b-0448-4046-a951-5daf794e7539	1	2026-02-20 05:53:20.45774+00
6	9963af2e-12cc-4357-9d89-90c279eef7fd	53ecb92b-0448-4046-a951-5daf794e7539	4	2026-02-20 08:15:31.814215+00
7	c08a9950-7d06-487d-bc1a-da2b035254e2	53ecb92b-0448-4046-a951-5daf794e7539	7	2026-03-05 09:03:32.061871+00
\.


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admin_users (id, username, password_hash, created_at) FROM stdin;
1	admin	$2b$10$Z9ZccTZINbL1FF/PXo322uMfAQ2bPfp53621F3x7nSU.cp4eVVo6.	2026-01-28 04:42:52.740652
\.


--
-- Data for Name: blog_articles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.blog_articles (id, title, slug, excerpt, image_url, external_url, category, strip_position, is_active, sort_order, created_at) FROM stdin;
1	Why Buying a Brand New Car is the Dumbest Financial Decision	new-car-financial-mistake	The controversial truth about new car depreciation and why used cars make better financial sense.	https://nxcarloves.replit.app/images/stock/generated/new_car_depreciation_loss.png	https://www.nxcar.in/blog/category/blog/why-buying-a-brand-new-car-is-the-dumbest-financial-decision-youll-ever-make-1768657322354-30	blog	1	t	1	2026-01-29 09:03:06.784199
2	Top Used SUVs Under 5 Lakhs in India for Maximum Value	top-used-suvs-5-lakhs	Get the most value for your money with these affordable and reliable used SUVs priced under 5 lakhs.	https://nxcarloves.replit.app/images/stock/generated/post-pandemic_mobility_study.png	https://www.nxcar.in/blog/category/blog	blog	1	t	2	2026-01-29 09:03:06.808738
3	Modern Car Infotainment Systems Are Actively Dangerous	infotainment-danger	Automakers have replaced simple buttons with complex touchscreens that require visual attention.	https://nxcarloves.replit.app/images/stock/generated/infotainment_distraction_danger.png	https://www.nxcar.in/blog/category/blog/modern-car-infotainment-systems-are-actively-dangerous-1768657322467-59	blog	1	t	3	2026-01-29 09:03:06.830696
4	The Uncomfortable Truth About Car Safety in India	car-safety-india	Indian roads are among the world's deadliest - here's what you need to know.	https://nxcarloves.replit.app/images/stock/generated/indian_road_safety_crisis.png	https://www.nxcar.in/blog/category/blog/the-uncomfortable-truth-about-car-safety-in-india-1768657322464-58	blog	1	t	4	2026-01-29 09:03:06.852433
5	Why Your Next Car Should Be Boring	boring-car-best	The most rational vehicle choice is almost always the most boring one - here's why.	https://nxcarloves.replit.app/images/stock/generated/boring_reliable_car_wins.png	https://www.nxcar.in/blog/category/blog/why-your-next-car-should-be-boring-1768657322460-57	blog	1	t	5	2026-01-29 09:03:06.874381
6	Renault Announces India-Specific Electric Platform for Sub-Rs 10 Lakh EVs	renault-ev-platform	French automaker Renault unveils plans to develop an India-specific EV platform targeting Rs 8 lakh starting price.	https://nxcarloves.replit.app/images/stock/generated/renault_india_ev_concept.png	https://www.nxcar.in/blog/category/news/renault-announces-india-specific-electric-platform-for-sub-rs-10-lakh-evs-1768657322325-22	news	2	t	1	2026-01-29 09:03:06.896727
7	Autonomous Vehicle Testing Gets Green Signal on Delhi-Mumbai Expressway	autonomous-testing	NHAI approves dedicated autonomous vehicle testing zone, creating India's first highway testing corridor.	https://nxcarloves.replit.app/images/stock/generated/autonomous_testing_delhi.png	https://www.nxcar.in/blog/category/news/autonomous-vehicle-testing-gets-green-signal-on-delhi-mumbai-expressway-1768657322339-26	news	2	t	2	2026-01-29 09:03:06.917996
8	Flex-Fuel Vehicles Launched as Government Pushes Ethanol Blending	flex-fuel-launch	Toyota launches India's first commercially available flex-fuel vehicle, the Innova Hycross FFV.	https://nxcarloves.replit.app/images/stock/generated/flex-fuel_ethanol_vehicle.png	https://www.nxcar.in/blog/category/news/flex-fuel-vehicles-launched-as-government-pushes-ethanol-blending-1768657322346-28	news	2	t	3	2026-01-29 09:03:06.940433
9	Two-Wheeler Sales Hit Record 25 Million Units Amid Electric Shift	two-wheeler-sales-record	India's two-wheeler industry records highest-ever annual sales of 25.2 million units in fiscal year 2025.	https://nxcarloves.replit.app/images/stock/generated/two-wheeler_sales_record.png	https://www.nxcar.in/blog/category/news/two-wheeler-sales-hit-record-25-million-units-amid-electric-shift-1768657322343-27	news	2	t	4	2026-01-29 09:03:06.96223
10	Auto Component Sector Achieves Record Exports of $22 Billion	auto-exports-record	India's automotive component industry establishes the country as a critical node in global automotive supply chains.	https://nxcarloves.replit.app/images/stock/generated/auto_component_exports.png	https://www.nxcar.in/blog/category/news/auto-component-sector-achieves-record-exports-of-22-billion-1768657322335-25	news	2	t	5	2026-01-29 09:03:06.984112
11	Engine Oil Viscosity and Specifications Decoded	engine-oil-guide	Understanding oil viscosity and specifications enables informed selection for your vehicle.	https://nxcarloves.replit.app/images/stock/generated/800v_ev_charging_system.png	https://www.nxcar.in/blog/category/insights/engine-oil-viscosity-and-specifications-decoded-1768657322552-89	insights	3	t	1	2026-01-29 09:03:07.00573
12	Suspension Geometry: Understanding What Makes Cars Handle	suspension-geometry	How suspension geometry determines vehicle response to driver inputs and road surfaces.	https://nxcarloves.replit.app/images/stock/generated/rollover_stability_analysis.png	https://www.nxcar.in/blog/category/insights/suspension-geometry-understanding-what-makes-cars-handle-1768657322549-88	insights	3	t	2	2026-01-29 09:03:07.027406
13	Wheel Alignment: Science and Specifications Explained	wheel-alignment	Wheel alignment affects tire wear, fuel consumption, handling, and safety.	https://nxcarloves.replit.app/images/stock/generated/nexa_engine_durability_test.png	https://www.nxcar.in/blog/category/insights/wheel-alignment-science-and-specifications-explained-1768657322547-87	insights	3	t	3	2026-01-29 09:03:07.049443
14	Bollywood's Love Affair with Imported Cars	bollywood-cars	From Raj Kapoor's Impala to SRK's Bugatti collection - how Hindi cinema uses cars as status symbols.	https://nxcarloves.replit.app/images/stock/generated/bollywood_car_chase_scene.png	https://www.nxcar.in/blog/category/culture/bollywoods-love-affair-with-imported-cars-1768657322673-130	culture	3	t	4	2026-01-29 09:03:07.071762
15	Understanding Vehicle Electrical Systems: 12V to 48V Migration	vehicle-electrical-systems	Modern vehicles need more power - the shift from 12-volt to 48-volt systems explained.	https://nxcarloves.replit.app/images/stock/generated/tata_punch_safety_design.png	https://www.nxcar.in/blog/category/insights/understanding-vehicle-electrical-systems-12v-to-48v-migration-1768657322544-86	insights	3	t	5	2026-01-29 09:03:07.093309
17	Urban Mobility Patterns Post-Pandemic: A GPS Analysis	urban-mobility-analysis	Study analyzes GPS data from 50,000 vehicles in Mumbai to identify mobility pattern changes.	https://nxcarloves.replit.app/images/stock/generated/post-pandemic_mobility_study.png	https://www.nxcar.in/blog/category/research/urban-mobility-patterns-post-pandemic-a-gps-analysis-1768657322587-101	research	4	t	2	2026-01-29 09:03:07.136977
18	Connected Vehicle Data Privacy: Consumer Attitudes	vehicle-data-privacy	Consumer awareness and attitudes toward vehicle data collection and privacy.	https://nxcarloves.replit.app/images/stock/generated/connected_car_privacy_study.png	https://www.nxcar.in/blog/category/research/connected-vehicle-data-privacy-consumer-attitudes-and-regulatory-frameworks-1768657322638-119	research	4	t	3	2026-01-29 09:03:07.158617
19	Vehicle End-of-Life Management: Informal Recycling Sector	vehicle-recycling	Analysis of India's informal vehicle recycling sector and the new scrappage policy.	https://nxcarloves.replit.app/images/stock/generated/vehicle_recycling_analysis.png	https://www.nxcar.in/blog/category/research/vehicle-end-of-life-management-informal-recycling-sector-analysis-1768657322636-118	research	4	t	4	2026-01-29 09:03:07.18194
20	Mobility-as-a-Service Integration in Indian Urban Contexts	maas-integration	Challenges of implementing integrated multimodal transport booking in Indian cities.	https://nxcarloves.replit.app/images/stock/generated/maas_integration_research.png	https://www.nxcar.in/blog/category/research/mobility-as-a-service-integration-challenges-in-indian-urban-contexts-1768657322630-116	research	4	t	5	2026-01-29 09:03:07.206774
38	Connected Vehicle Data Privacy: Consumer Attitudes	vehicle-data-privacy	Consumer awareness and attitudes toward vehicle data collection and privacy.	https://nxcarloves.replit.app/images/stock/generated/connected_car_privacy_study.png	https://nxcarloves.replit.app/content/article/connected-vehicle-data-privacy-consumer-attitudes-and-regulatory-frameworks-1768695131179-118	research	4	t	3	2026-01-29 13:45:11.697705
39	Vehicle End-of-Life Management: Informal Recycling Sector	vehicle-recycling	Analysis of India's informal vehicle recycling sector and the new scrappage policy.	https://nxcarloves.replit.app/images/stock/generated/vehicle_recycling_analysis.png	https://nxcarloves.replit.app/content/article/vehicle-end-of-life-management-informal-recycling-sector-analysis-1768695131149-117	research	4	t	4	2026-01-29 13:45:11.719371
\.


--
-- Data for Name: car_listings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.car_listings (id, vehicle_number, brand, model, variant, year, fuel_type, transmission, kilometers, color, owner_count, location, state, rto_code, expected_price, description, image_urls, seller_name, seller_phone, seller_email, status, is_approved, session_id, insurance_valid, rc_status, engine_number, chassis_number, created_at, rc_document_url, insurance_document_url, other_document_urls, hide_number_plate, remove_watermark) FROM stdin;
1	SEARCH & SELECT YOUR CITY...	Maruti Suzuki	800	ads	2024	Hybrid	Automatic	2324		1	3			23234	23	{}	Rohan Khandelwal	07999491672	rohan.khandelwal1431@gmail.com	pending	f	vmzHyOXnFj13HeaZs69OXDrzXbR6uwvz	f	\N	\N	\N	2026-02-20 05:57:02.175636	\N	\N	\N	f	f
2	HR76B6719	Maruti Suzuki	800	AC Uniq[2008-2014]	2014	PETROL	Manual	6666	SILKY SILVER	1	Haryana	Haryana	HR76	666666		{/objects/uploads/58cddc6f-6ff8-486c-9821-7e523ec8eec8}	Test	Test	test	pending	f	kBwC9_ypb07WGVjy5Xx8L_i-16q0x5do	f	\N	\N	\N	2026-02-20 05:58:13.504435	\N	\N	\N	f	f
3	DL10CP1393	Hyundai	Creta	E 1.5 Petrol	2020	PETROL	Automatic	322342	2TONE X5B+PWT	1	New Delhi	Delhi	DL10	3242342		{}	Rohan Khandelwal	07999491672	rohan.khandelwal1431@gmail.com	pending	f	gLiCaF4Oi-j_o59lD5A7gqaZcW8H_wfX	f	\N	\N	\N	2026-02-20 08:44:27.918746	\N	\N	\N	f	f
4	DL8CAY6186	MG	Hector		2019	DIESEL	Automatic	2323423	CANDY WHITE	2	B-104 RISHI NAGAR	Delhi	DL8	3242343		{}	Rohan Khandelwal	07999491672	rohan.khandelwal1431@gmail.com	pending	f	H3Mrtk8Ey51oo7J3q1hx6ZTOxGbmsnsS	f	\N	\N	\N	2026-02-20 12:24:09.71542	\N	\N	\N	f	f
5	KA05NG6022	Kia	Sonet	GTX 1.5 Diesel AT	2023	DIESEL	Automatic	34242	GLACIER WHITE PEARL	1	NO 77 TOWN CENTER BUILDING NO 3	Karnataka	KA05	43234342		{}	Rohan Khandelwal	07999491672	rohan.khandelwal1431@gmail.com	pending	f	6JgXM1LwZlQbHUKhs0lgfHulQgKnlb4Y	f	\N	\N	\N	2026-02-21 07:58:52.748631	\N	\N	\N	f	f
6	HR76B6719	Maruti Suzuki	800	AC BS-III[2000-2008]	2014	PETROL	Manual	11111	SILKY SILVER	1	Haryana	Haryana	HR76	140000		{}	Parshant Yadav	8826448907	parshant.yadav@nxcar.in	pending	f	l9e-LshK2XJZnwdaOz4-vnt5luFg8-kK	f	\N	\N	\N	2026-02-24 06:03:58.318414	\N	\N	\N	f	f
7	HR26EV0001	Toyota	Fortuner	4X2 AT 2.8 Diesel	2021	DIESEL	Automatic	4590	WHITE PEARL&A.BLACK	1	Gurgaon	Haryana	HR26	3456785		{}	Parshant Yadav	88264489807	parshant.yadav@nxcar.in	pending	f	2951b44b-0aa8-4bae-bcfe-8fa6dd1c7a05	f	\N	\N	\N	2026-02-24 06:15:01.834627	\N	\N	\N	f	f
8	HR76B6719	Maruti Suzuki	800	AC BS-III[2000-2008]	2014	PETROL	Automatic	222222	SILKY SILVER	2	Haryana	Haryana	HR76	234433		{}	Parshant Yadav	882644879072222222	parshant.yadav@nxcar.in	pending	f	2951b44b-0aa8-4bae-bcfe-8fa6dd1c7a05	f	\N	\N	\N	2026-02-24 06:54:08.385966	\N	\N	\N	f	f
9	HR76B6719	Maruti Suzuki	800	AC BS-III[2000-2008]	2014	PETROL	Manual	23456789	SILKY SILVER	2	Haryana	Haryana	HR76	34567		{/replit-objstore-63e28147-92b5-4856-b125-aaa7f3617e08/.private/cars/1766310402_8009-ff391039-918a-47d4-b62d-3607be2619c6.webp,/replit-objstore-63e28147-92b5-4856-b125-aaa7f3617e08/.private/cars/1766310412_8464-9bafe90e-241d-4038-9aa5-829f848f193f.webp,/replit-objstore-63e28147-92b5-4856-b125-aaa7f3617e08/.private/cars/1766310421_4427-41c3c0e3-9fc9-4db0-b313-5fd121c0dd1d.webp}	Parshant Yadav	456789	parshant.yadav@nxcar.in	pending	f	ad55bc02-78a2-4aeb-8ffc-9a06469bd966	f	\N	\N	\N	2026-02-24 09:51:08.63722	\N	\N	\N	f	f
10	MMMMMMM	Maruti Suzuki	1000		2014	Petrol	Automatic	9889	black	1	delhi			100000		{}	kkkkkkkkk	8447		pending	f	33b5ef3d-b466-49c9-b9ca-7f3e47e5b8b4	f	\N	\N	\N	2026-02-24 10:18:23.649903	\N	\N	\N	f	f
11	UP14DF4565	Honda	Accord	Hybrid	2017	PETROL	Manual	345678	GREY	1	Faridabad	Uttar Pradesh	UP14	0	\N	\N	N/A	N/A		pending	f	a3188744-2503-4ca8-8dbd-38d4c409f981	f	\N	\N	\N	2026-03-05 09:28:06.320132	\N	\N	\N	f	f
12	HR26EV0001	Toyota	Fortuner	4X2 AT 2.8 Diesel	2022	DIESEL	Manual	54321	WHITE PEARL&A.BLACK	1	Gurgaon	Haryana	HR26	0	\N	\N	N/A	N/A		pending	f	0d8eea32-5aad-477f-9892-4c822add0e16	f	\N	\N	\N	2026-03-05 09:37:05.435293	\N	\N	\N	f	f
13	DL8CAC4133	Hyundai	Grand i10	Magna 1.2	2016	PETROL	Automatic	30000	PURE WHITE	2	New Delhi	Delhi	DL8	0	\N	\N	N/A	N/A		pending	f	925c5784-1843-4ae6-bbaf-f63010339ba8	f	\N	\N	\N	2026-03-05 09:54:31.544915	\N	\N	\N	f	f
14	HR26EV0001	Toyota	Fortuner	4X2 MT 2.8 Diesel	2022	DIESEL	Automatic	6789	WHITE PEARL&A.BLACK	1	Balaghat	Haryana	HR26	567887		\N	Parshant Yadav	8888888888	parshant.yadav@nxcar.in	pending	f	0d8eea32-5aad-477f-9892-4c822add0e16	f	\N	\N	\N	2026-03-05 10:36:29.356396	\N	\N	\N	f	f
\.


--
-- Data for Name: car_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.car_reviews (id, car_id, session_id, rating, review_text, reviewer_name, is_helpful, created_at) FROM stdin;
\.


--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cars (id, name, brand, model, year, price, fuel_type, transmission, kilometers, location, image_url, is_featured, created_at, variant, ownership) FROM stdin;
1	Maruti Swift ZXi+	Maruti	Swift ZXi+	2020	650000	Petrol	Manual	35000	Delhi	/images/car-hatchback.png	t	2026-01-29 09:03:05.570895	\N	\N
2	Hyundai Creta SX	Hyundai	Creta SX	2021	1280000	Diesel	Automatic	25000	Mumbai	/images/car-suv.png	t	2026-01-29 09:03:05.60438	\N	\N
3	Honda City ZX	Honda	City ZX	2019	925000	Petrol	Manual	42000	Bangalore	/images/car-sedan.png	f	2026-01-29 09:03:05.626782	\N	\N
4	Tata Nexon XZ+	Tata	Nexon XZ+	2022	1150000	Petrol	Manual	28000	Delhi	/images/car-suv.png	t	2026-01-29 09:03:05.649539	\N	\N
5	Toyota Fortuner 4x4	Toyota	Fortuner	2021	3850000	Diesel	Automatic	45000	Mumbai	/images/car-suv.png	t	2026-01-29 09:03:05.671771	\N	\N
6	Mahindra XUV700 AX7	Mahindra	XUV700	2023	2250000	Diesel	Automatic	15000	Pune	/images/car-suv.png	t	2026-01-29 09:03:05.693913	\N	\N
7	Kia Seltos HTX	Kia	Seltos	2022	1450000	Petrol	Automatic	32000	Chennai	/images/car-suv.png	f	2026-01-29 09:03:05.715505	\N	\N
8	Volkswagen Virtus GT	Volkswagen	Virtus	2023	1680000	Petrol	Automatic	12000	Hyderabad	/images/car-sedan.png	f	2026-01-29 09:03:05.737419	\N	\N
9	Skoda Slavia Style	Skoda	Slavia	2022	1520000	Petrol	Manual	22000	Bangalore	/images/car-sedan.png	f	2026-01-29 09:03:05.759214	\N	\N
10	Renault Kiger RXZ	Renault	Kiger	2021	780000	Petrol	Manual	38000	Jaipur	/images/car-suv.png	f	2026-01-29 09:03:05.781648	\N	\N
11	Nissan Magnite XV	Nissan	Magnite	2022	820000	Petrol	CVT	25000	Ahmedabad	/images/car-suv.png	f	2026-01-29 09:03:05.803789	\N	\N
12	MG Hector Plus Sharp	MG	Hector Plus	2021	1950000	Diesel	Automatic	48000	Kolkata	/images/car-suv.png	t	2026-01-29 09:03:05.825387	\N	\N
13	Jeep Compass Limited	Jeep	Compass	2020	2100000	Diesel	Automatic	55000	Chandigarh	/images/car-suv.png	f	2026-01-29 09:03:05.847407	\N	\N
14	BMW 3 Series 320d	BMW	3 Series	2019	3200000	Diesel	Automatic	42000	Delhi	/images/car-sedan.png	t	2026-01-29 09:03:05.869018	\N	\N
15	Mercedes C-Class C200	Mercedes	C-Class	2020	4100000	Petrol	Automatic	35000	Mumbai	/images/car-sedan.png	t	2026-01-29 09:03:05.890421	\N	\N
16	Maruti Swift ZXi+	Maruti	Swift ZXi+	2020	650000	Petrol	Manual	35000	Delhi	/images/car-hatchback.png	t	2026-01-29 13:45:10.179359	\N	\N
17	Hyundai Creta SX	Hyundai	Creta SX	2021	1280000	Diesel	Automatic	25000	Mumbai	/images/car-suv.png	t	2026-01-29 13:45:10.21215	\N	\N
18	Honda City ZX	Honda	City ZX	2019	925000	Petrol	Manual	42000	Bangalore	/images/car-sedan.png	f	2026-01-29 13:45:10.232945	\N	\N
19	Tata Nexon XZ+	Tata	Nexon XZ+	2022	1150000	Petrol	Manual	28000	Delhi	/images/car-suv.png	t	2026-01-29 13:45:10.258014	\N	\N
20	Toyota Fortuner 4x4	Toyota	Fortuner	2021	3850000	Diesel	Automatic	45000	Mumbai	/images/car-suv.png	t	2026-01-29 13:45:10.278579	\N	\N
21	Mahindra XUV700 AX7	Mahindra	XUV700	2023	2250000	Diesel	Automatic	15000	Pune	/images/car-suv.png	t	2026-01-29 13:45:10.299191	\N	\N
22	Kia Seltos HTX	Kia	Seltos	2022	1450000	Petrol	Automatic	32000	Chennai	/images/car-suv.png	f	2026-01-29 13:45:10.322197	\N	\N
23	Volkswagen Virtus GT	Volkswagen	Virtus	2023	1680000	Petrol	Automatic	12000	Hyderabad	/images/car-sedan.png	f	2026-01-29 13:45:10.343019	\N	\N
24	Skoda Slavia Style	Skoda	Slavia	2022	1520000	Petrol	Manual	22000	Bangalore	/images/car-sedan.png	f	2026-01-29 13:45:10.364153	\N	\N
25	Renault Kiger RXZ	Renault	Kiger	2021	780000	Petrol	Manual	38000	Jaipur	/images/car-suv.png	f	2026-01-29 13:45:10.385556	\N	\N
26	Nissan Magnite XV	Nissan	Magnite	2022	820000	Petrol	CVT	25000	Ahmedabad	/images/car-suv.png	f	2026-01-29 13:45:10.405989	\N	\N
27	MG Hector Plus Sharp	MG	Hector Plus	2021	1950000	Diesel	Automatic	48000	Kolkata	/images/car-suv.png	t	2026-01-29 13:45:10.427151	\N	\N
28	Jeep Compass Limited	Jeep	Compass	2020	2100000	Diesel	Automatic	55000	Chandigarh	/images/car-suv.png	f	2026-01-29 13:45:10.447084	\N	\N
29	BMW 3 Series 320d	BMW	3 Series	2019	3200000	Diesel	Automatic	42000	Delhi	/images/car-sedan.png	t	2026-01-29 13:45:10.467194	\N	\N
30	Mercedes C-Class C200	Mercedes	C-Class	2020	4100000	Petrol	Automatic	35000	Mumbai	/images/car-sedan.png	t	2026-01-29 13:45:10.487574	\N	\N
48169	Tata Tiago	Tata	Tiago	2023	650000	EV	Automatic	66000	Jaipur	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771512529_9315.jpg	f	2026-02-20 05:59:19.641156	\N	\N
48785	Hyundai Verna	Hyundai	Verna	2012	395000	Diesel	Manual	86000	Bangalore	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771834549_2531.jpg	f	2026-02-24 06:09:26.202481	\N	\N
48608	Hyundai Verna	Hyundai	Verna	2022	975000	Diesel	Manual	58000	Bangalore	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771741926_2432.jpg	f	2026-02-24 06:09:27.778577	\N	\N
48716	Honda Amaze	Honda	Amaze	2019	425000	Petrol	Manual	72179	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771791800_3432.jpg	f	2026-02-24 06:23:07.461593	\N	\N
48697	Ford EcoSport	Ford	EcoSport	2020	840000	Diesel	Manual	41854	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771822294_7695.jpg	f	2026-02-24 06:25:56.288232	\N	\N
48813	Mahindra XUV700	Mahindra	XUV700	2022	1900000	Diesel	Manual	110909	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771836861_4484.jpg	f	2026-02-24 06:43:33.806301	\N	\N
48332	Honda City	Honda	City	2018	615000	Petrol	Manual	39800	Gurgaon	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771586262_5897.jpg	f	2026-02-24 07:12:20.525079	\N	\N
46553	Maruti Suzuki Invicto	Maruti Suzuki	Invicto	2024	2550000	Petrol	Automatic	19000	Ghaziabad	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1770613894_4207.jpg	f	2026-02-24 09:49:51.46444	\N	\N
46570	Maruti Suzuki Dzire	Maruti Suzuki	Dzire	2022	825000	Petrol	Manual	40000	Ghaziabad	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1770617567_3404.jpg	f	2026-02-24 09:49:52.88405	\N	\N
49022	Renault Duster	Renault	Duster	2016	680000	Diesel	Automatic	90000	Bangalore	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771933686_1311.jpg	f	2026-02-25 06:52:58.823374	\N	\N
48577	Hyundai Grand i10	Hyundai	Grand i10	2016	375000	Petrol	Manual	152000	Bangalore	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771736634_1954.jpg	f	2026-02-25 06:56:27.969432	\N	\N
49052	Maruti Suzuki Dzire	Maruti Suzuki	Dzire	2012	200000	Diesel	Manual	96656	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771999060_2469.jpg	f	2026-02-25 07:04:44.878754	\N	\N
48588	Maruti Suzuki Vitara Brezza	Maruti Suzuki	Vitara Brezza	2019	750000	Diesel	Manual	98000	Bangalore	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771737719_5388.jpg	f	2026-02-25 07:09:09.272525	\N	\N
48476	Maruti Suzuki Wagon R	Maruti Suzuki	Wagon R	2016	290000	Petrol + Cng	Manual	51000	Ghaziabad	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1771668041_4046.jpg	f	2026-02-25 07:09:25.527667	\N	\N
49817	Hyundai Xcent	Hyundai	Xcent	2016	350000	Petrol	Manual	63000	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772452770_1062.jpg	f	2026-03-05 07:18:19.396914	\N	\N
49809	Mahindra Scorpio	Mahindra	Scorpio	2016	593000	Diesel	Manual	127000	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772450715_2807.jpg	f	2026-03-05 07:18:21.440256	\N	\N
50040	MG Hector	MG	Hector	2021	1300000	Diesel	Manual	83000	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772692178_9238.jpg	f	2026-03-05 07:18:45.209957	\N	\N
49871	Maruti Suzuki Swift	Maruti Suzuki	Swift	2018	425000	Petrol	Manual	37000	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772518653_8553.jpg	f	2026-03-05 07:31:44.30336	\N	\N
49862	Maruti Suzuki S-Presso	Maruti Suzuki	S-Presso	2021	370000	Petrol	Automatic	42868	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772516720_3124.jpg	f	2026-03-05 07:31:45.092213	\N	\N
50053	Audi Q3	Audi	Q3	2018	1575000	Diesel	Automatic	59000	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772695882_9174.jpg	f	2026-03-05 07:32:37.114535	\N	\N
50050	Chevrolet Sail	Chevrolet	Sail	2013	135000	Petrol	Manual	40000	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772695188_6885.jpg	f	2026-03-05 07:32:49.459293	\N	\N
50043	Maruti Suzuki Celerio	Maruti Suzuki	Celerio	1970	677676	Petrol + Cng	Manual	103001	India	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772693282_2437.webp	f	2026-03-05 07:32:50.316998	\N	\N
49760	Maruti Suzuki Celerio	Maruti Suzuki	Celerio	2021	410000	Petrol + Cng	Manual	49700	India	/images/car-sedan.png	f	2026-03-05 09:20:21.14331	\N	\N
50075	Tata Nexon	Tata	Nexon	2022	665000	Petrol	Manual	67000	Delhi	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1772702431_3460.jpg	f	2026-03-05 09:21:20.996782	\N	\N
47073	Maruti Suzuki Alto 800	Maruti Suzuki	Alto 800	2019	295000	Petrol	Manual	16700	Ghaziabad	https://prod-nxcar-listing.s3.ap-south-1.amazonaws.com/1770811935_1414.jpeg	f	2026-03-09 05:37:01.696868	\N	\N
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.conversations (id, title, created_at) FROM stdin;
1	Nxcar Assistant Chat	2026-01-28 09:43:05.478361
\.


--
-- Data for Name: dealer_cities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dealer_cities (id, name, region, dealer_count, created_at, image_url) FROM stdin;
1	Delhi	North	124	2026-01-29 09:03:06.24352	\N
2	Mumbai	West	98	2026-01-29 09:03:06.268354	\N
3	Bangalore	South	86	2026-01-29 09:03:06.290409	\N
4	Chennai	South	65	2026-01-29 09:03:06.312314	\N
5	Hyderabad	South	72	2026-01-29 09:03:06.33415	\N
6	Pune	West	54	2026-01-29 09:03:06.356401	\N
7	Kolkata	East	45	2026-01-29 09:03:06.3785	\N
8	Ahmedabad	West	58	2026-01-29 09:03:06.399936	\N
9	Jaipur	North	32	2026-01-29 09:03:06.421618	\N
10	Lucknow	North	28	2026-01-29 09:03:06.444421	\N
11	Chandigarh	North	36	2026-01-29 09:03:06.466491	\N
12	Indore	Central	24	2026-01-29 09:03:06.48811	\N
\.


--
-- Data for Name: marketing_banners; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.marketing_banners (id, title, subtitle, description, cta_text, cta_link, image_url, "position", is_active, priority, created_at) FROM stdin;
1	Buying a Car: A Pre Delivery Inspection Assures Peace of Mind 	280 Point Inspection with OBD Scan and Digital Paint Thickness Meter 	What We Check\n\n280+ point mechanical inspection\nOBD-II diagnostic scan\nAccident & structural damage detection\nPaint thickness measurement\nFlood damage assessment\nDocument & ownership verification\n\nCommon Concerns We Detect\n\nConcealed accident repairs\nOdometer rollback fraud\nHidden mechanical issues\nOutstanding loans & disputes	Book Now 	\N	https://pdi.nxcar.in/assets/mechanic_inspecting_car_engine-gEn3PvG_.png	pdi.nxcar.in	t	0	2026-01-29 09:07:33.507565
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.messages (id, conversation_id, role, content, created_at) FROM stdin;
1	1	user	hi	2026-01-28 09:43:05.937991
2	1	assistant	Hi! 👋  \n\nI’m Nxcar Assistant. How can I help you today?\n\nSome things I can help with:  \n- Find the right used car (budget, city, fuel type, etc.)  \n- Explain Nxcar’s inspection, PDI, RC transfer, and warranty  \n- Guide you on selling your car on Nxcar  \n- Loan/EMI calculations and required documents  \n- Understand fair price / valuation for your car  \n\nTell me what you’re looking for — buying or selling? And which city are you in?	2026-01-28 09:43:08.70002
3	1	user	how are you	2026-01-28 09:43:31.968174
4	1	assistant	I’m functioning perfectly, thanks for asking! 😊  \n\nHow can I help you today—are you planning to buy a used car, sell one, or check loan/EMI options?	2026-01-28 09:43:33.404585
5	1	user	i have bike	2026-01-28 09:43:46.975328
6	1	assistant	Nice! 😊  \n\nI can help you mainly with **cars** on Nxcar (buying, selling, loans, valuation, etc.).  \n\nBut tell me what you want to do with your bike:  \n- Are you planning to **sell** it?  \n- Or thinking to **upgrade to a car** and want guidance (budget, EMI, etc.)?  \n\nIf you’re planning to move from bike to car, share:  \n- Your city  \n- Budget range (e.g., ₹3–5 lakh, ₹5–8 lakh)  \n- Fuel preference (petrol/diesel/CNG)  \n- Main use (daily office, family, long trips, city only)  \n\nI’ll suggest suitable used car options and what to check before buying.	2026-01-28 09:43:49.428546
7	1	user	10k	2026-01-28 09:43:56.163319
8	1	assistant	Got it, your budget is around **₹10,000**.\n\nTo clarify:  \n- Are you looking to **buy a car** with ₹10k as **down payment** (and rest on loan)?  \n- Or you want a **vehicle (bike/scooter)** within ₹10k total?  \n- Or you want to know **how much you can get** if you sell your current bike (worth around ₹10k)?\n\nSince Nxcar deals in **used cars**, here’s how ₹10k can work for you:\n\n### 1. If ₹10k is your **down payment**\nYou can consider a used car on EMI. I can roughly estimate:\n- Possible **loan amount**\n- Approximate **EMI per month**\n\nPlease share:\n- Your **city** (Bangalore/Chennai/Delhi/Hyderabad/Mumbai or other)  \n- Your **monthly income** (approx)  \n- How much EMI you’re comfortable with (₹3k, ₹5k, etc.)\n\n### 2. If you want a vehicle **within ₹10k**\nRealistically, you won’t get a decent **used car** at ₹10k total. You’ll need:\n- Higher budget, or  \n- Finance/loan with small down payment.\n\nReply with:\n- Are you okay with **EMI**?  \n- City you live in  \n- Whether you already have a bike to sell (we can plan upgrade to a car)\n\nI’ll then guide you on a practical budget and next steps.	2026-01-28 09:43:59.587807
\.


--
-- Data for Name: notification_subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_subscriptions (id, email, phone, session_id, notify_price_drops, notify_new_listings, preferred_brands, budget_min, budget_max, preferred_locations, created_at) FROM stdin;
1	parshant.yadav@nxcar.in	\N	0d8eea32-5aad-477f-9892-4c822add0e16	t	f	{Maruti}	\N	\N	{Mumbai}	2026-03-05 07:20:54.295386
\.


--
-- Data for Name: nxcar_locations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.nxcar_locations (id, city, location, image_url, created_at, phone, email) FROM stdin;
1	Delhi	South Extension	/images/store-delhi.png	2026-01-29 09:03:06.510365	\N	\N
2	Mumbai	Andheri West	/images/store-mumbai.png	2026-01-29 09:03:06.534429	\N	\N
3	Bangalore	Indiranagar	/images/store-bangalore.png	2026-01-29 09:03:06.55607	\N	\N
4	Chennai	Anna Nagar	/images/store-chennai.png	2026-01-29 09:03:06.577535	\N	\N
5	Hyderabad	Jubilee Hills	/images/store-hyderabad.png	2026-01-29 09:03:06.599342	\N	\N
6	Gurgaon	Cyber City	/images/store-delhi.png	2026-01-29 09:03:06.621648	\N	\N
7	Pune	Koregaon Park	/images/store-mumbai.png	2026-01-29 09:03:06.644576	\N	\N
8	Noida	Sector 18	/images/store-delhi.png	2026-01-29 09:03:06.666422	\N	\N
9	Kolkata	Salt Lake	/images/store-chennai.png	2026-01-29 09:03:06.687923	\N	\N
10	Ahmedabad	SG Highway	/images/store-mumbai.png	2026-01-29 09:03:06.709522	\N	\N
11	Jaipur	Vaishali Nagar	/images/store-delhi.png	2026-01-29 09:03:06.732323	\N	\N
13	Delhi	South Extension	/images/store-delhi.png	2026-01-29 13:45:11.067307	\N	\N
14	Mumbai	Andheri West	/images/store-mumbai.png	2026-01-29 13:45:11.090729	\N	\N
15	Bangalore	Indiranagar	/images/store-bangalore.png	2026-01-29 13:45:11.116417	\N	\N
16	Chennai	Anna Nagar	/images/store-chennai.png	2026-01-29 13:45:11.136496	\N	\N
17	Hyderabad	Jubilee Hills	/images/store-hyderabad.png	2026-01-29 13:45:11.171079	\N	\N
18	Gurgaon	Cyber City	/images/store-delhi.png	2026-01-29 13:45:11.191917	\N	\N
19	Pune	Koregaon Park	/images/store-mumbai.png	2026-01-29 13:45:11.211938	\N	\N
20	Noida	Sector 18	/images/store-delhi.png	2026-01-29 13:45:11.233654	\N	\N
21	Kolkata	Salt Lake	/images/store-chennai.png	2026-01-29 13:45:11.254612	\N	\N
22	Ahmedabad	SG Highway	/images/store-mumbai.png	2026-01-29 13:45:11.279187	\N	\N
23	Jaipur	Vaishali Nagar	/images/store-delhi.png	2026-01-29 13:45:11.300163	\N	\N
24	Chandigarh	Sector 17	/images/store-bangalore.png	2026-01-29 13:45:11.320283	\N	\N
\.


--
-- Data for Name: platform_feedback; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.platform_feedback (id, session_id, feedback_type, feedback_text, rating, email, name, page, user_agent, is_resolved, created_at) FROM stdin;
1	OTNwNDszaRtvcTDSDzlBXRI8qwmQRZvU	bug	test	3	albertsebastin@gmail.in	TEST	/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	f	2026-01-30 10:28:32.537083
2	8b198bdf-0415-49df-8f4c-9a047b1a7cbc	general	dgf	5	df@gmail.com	df	/terms	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	f	2026-02-24 11:20:50.413352
3	0d8eea32-5aad-477f-9892-4c822add0e16	feature	test	4	\N	\N	/	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	f	2026-03-05 07:51:47.649822
\.


--
-- Data for Name: sell_car_leads; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sell_car_leads (id, car_number, name, phone, email, status, created_at) FROM stdin;
1	RJ14CV0002	\N	\N	\N	new	2026-01-28 04:07:24.025389
2	HR76B6719	\N	\N	\N	new	2026-01-28 04:10:40.96626
3	DL8CAR6746	\N	\N	\N	new	2026-01-28 06:05:25.119818
4	DL8CAR6746	\N	\N	\N	new	2026-01-28 06:07:46.952666
5	UP14FJ6518	\N	\N	\N	new	2026-01-28 06:10:05.450188
6	UP14FJ6518	\N	\N	\N	new	2026-01-28 06:10:44.091285
7	UK06BE5214	\N	\N	\N	new	2026-01-28 08:00:52.967017
8	RJ14CV0002	\N	\N	\N	new	2026-01-28 09:38:18.428427
9	DL3CCW8745	\N	\N	\N	new	2026-01-28 11:20:27.330856
10	DL3CCW8745	\N	\N	\N	new	2026-01-28 11:20:51.708071
11	UP14DU4883	\N	\N	\N	new	2026-01-29 05:38:07.766299
12	,MNB	\N	\N	\N	new	2026-01-29 06:54:17.711519
13	25BRDF0001	\N	\N	\N	new	2026-01-29 09:47:42.25073
14	HR76B6719	\N	\N	\N	new	2026-01-30 09:34:48.386787
15	HR76B6719GG	\N	\N	\N	new	2026-01-30 09:58:41.623594
16	YSHEH	\N	\N	\N	new	2026-01-30 11:13:48.000838
17	HEHEHE	\N	\N	\N	new	2026-01-30 11:13:58.299002
18	GG	\N	\N	\N	new	2026-01-30 11:14:08.64634
19	UP85CL	\N	\N	\N	new	2026-01-30 11:37:39.446487
20	RJ14CV0002	\N	\N	\N	new	2026-01-30 14:26:33.801764
21	KJKJB	\N	\N	\N	new	2026-02-02 05:26:50.659645
22	UYTRY543546436256TH3254TR	\N	\N	\N	new	2026-02-02 05:44:27.583092
23	FDGFHGHJKBHGVGHB	\N	\N	\N	new	2026-02-11 10:08:47.682032
24	VBNM,L;.'LKJNBMKL	\N	\N	\N	new	2026-02-13 07:13:07.682649
25	UK06BE5214	\N	\N	\N	new	2026-02-18 07:32:24.175795
26	FGGHJIKOJLKHJGJHJKLHKKL/JHJKLKK	\N	\N	\N	new	2026-02-19 10:59:21.143723
27	HR76B6719	\N	\N	\N	new	2026-02-20 05:55:52.974953
28	XCFGVHBJNKM.,LM.NBV	\N	\N	\N	new	2026-02-20 11:14:42.968924
29	M	\N	\N	\N	new	2026-02-20 11:14:51.099519
30	V	\N	\N	\N	new	2026-02-20 11:25:13.111684
31	TMKC	\N	\N	\N	new	2026-02-20 11:25:30.8416
32	GHJ	\N	\N	\N	new	2026-02-20 11:25:56.876483
33	GVVFHBDJS	\N	\N	\N	new	2026-02-20 11:26:20.575705
34	FGHJK	\N	\N	\N	new	2026-02-23 06:28:08.774785
35	BBNM	\N	\N	\N	new	2026-02-23 06:31:40.970783
36	NJKI	\N	\N	\N	new	2026-02-23 09:48:24.85832
37	TGHJHGHJKL	\N	\N	\N	new	2026-02-23 10:50:56.053942
38	GHJTREWWWWWWWWW4567890000OIJHBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBNMM,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,MNBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVB	\N	\N	\N	new	2026-02-23 10:51:48.052015
39	8	\N	\N	\N	new	2026-02-23 10:52:01.370111
40	=	\N	\N	\N	new	2026-02-23 10:52:08.692935
41	/	\N	\N	\N	new	2026-02-23 10:52:13.064383
42	"	\N	\N	\N	new	2026-02-23 10:52:20.281666
43	'	\N	\N	\N	new	2026-02-23 10:52:23.777067
44	POIUHGFCDRTYUIO[]	\N	\N	\N	new	2026-02-23 10:52:38.183197
45	HR76B6719	\N	\N	\N	new	2026-02-24 06:19:10.053707
46	GGG	\N	\N	\N	new	2026-02-24 08:21:07.826823
47	LOAN-pre-owned-purchase	parshant	8826448907	\N	new	2026-02-24 09:45:03.84159
48	HR76B6719	\N	\N	\N	new	2026-02-24 10:42:40.2517
49	HR76B6719	\N	\N	\N	new	2026-02-25 06:36:12.616906
50	ASVD	\N	\N	\N	new	2026-02-25 06:38:13.790234
51	LOAN-pre-owned-purchase	Rohan khandelwal	7999491672	\N	new	2026-02-25 06:39:04.976682
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
_QFHsiWckFf9eVb8FKWdBV9R5Kyj6OFW	{"cookie": {"path": "/", "secure": true, "expires": "2026-02-20T07:13:17.514Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "XvzNrDMwnmfWM_aW79AES3n7g5TvHNw8ndt0TrD8FV0"}}	2026-02-26 11:00:44
6JgXM1LwZlQbHUKhs0lgfHulQgKnlb4Y	{"cookie": {"path": "/", "secure": false, "expires": "2026-02-27T08:48:34.587Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "pendingPhone": "7999491672"}	2026-02-28 08:27:06
l9e-LshK2XJZnwdaOz4-vnt5luFg8-kK	{"cookie": {"path": "/", "secure": true, "expires": "2026-02-24T09:02:24.657Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "b9c08bd6-db86-46b8-bdb7-6dab62641333", "exp": 1771322544, "iat": 1771318944, "iss": "https://replit.com/oidc", "sub": "47507075", "email": "parshant.yadav@nxfin.in", "at_hash": "dajOKkI7ejLlkaxqH5nGkw", "username": "parshantyadav4", "auth_time": 1771318943, "last_name": "YADAV", "first_name": "PARSHANT", "email_verified": true}, "expires_at": 1771322544, "access_token": "sMGjwPUr79XNBEiHriqWUxsg1aVpXLLcugv6PZZqHRb", "refresh_token": "P7z9i2VT23wC40rPn9O0jYMRwpXLo4JEOCbvs6hwE23"}}}	2026-03-03 06:04:00
94wAkvCm4WGSuWHoHjjLTj1MnqFgBq5l	{"cookie": {"path": "/", "secure": false, "expires": "2026-02-27T12:28:51.671Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "pendingPhone": "7999491672"}	2026-03-02 11:40:53
\.


--
-- Data for Name: site_content; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.site_content (id, section_key, title, subtitle, description, cta_text, cta_link, image_url, updated_at) FROM stdin;
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.testimonials (id, name, location, image_url, testimonial_text, car_sold_or_bought, rating, created_at, google_review_link) FROM stdin;
1	Rahul S.	Delhi	/images/delivery-moment.png	Sold my Swift in 2 hrs! Unbeatable price.	Sold Swift	5	2026-01-29 09:03:05.911967	\N
2	Amit V.	Bangalore	/images/loan-happy.png	Loan approved in 24hrs. Hassle-free.	Bought Creta	5	2026-01-29 09:03:05.936592	\N
3	Sneha G.	Mumbai	/images/sell-car-couple.png	Nxcar handled RC transfer perfectly.	Sold City	5	2026-01-29 09:03:05.958034	\N
4	Priya M.	Pune	/images/delivery-moment.png	Amazing experience! Got the best price for my old car.	Sold Creta	5	2026-01-29 09:03:05.979676	\N
5	Vikram R.	Chennai	/images/loan-happy.png	Super fast loan approval. Drove home my dream car!	Bought Fortuner	5	2026-01-29 09:03:06.001235	\N
6	Neha K.	Hyderabad	/images/sell-car-couple.png	Seamless RC transfer. No stress at all!	Sold Swift	5	2026-01-29 09:03:06.023108	\N
7	Arjun S.	Jaipur	/images/delivery-moment.png	Best used car platform in India. Highly recommend!	Bought XUV700	5	2026-01-29 09:03:06.045169	\N
8	Meera P.	Ahmedabad	/images/loan-happy.png	Got my loan in just 4 hours. Incredible service!	Bought Seltos	5	2026-01-29 09:03:06.068009	\N
9	Raj T.	Kolkata	/images/sell-car-couple.png	Sold my car at doorstep. Very convenient!	Sold City	5	2026-01-29 09:03:06.08976	\N
10	Ananya G.	Chandigarh	/images/delivery-moment.png	Inspection report was so detailed. Felt confident buying.	Bought Nexon	5	2026-01-29 09:03:06.11205	\N
11	Karthik V.	Lucknow	/images/loan-happy.png	Professional team, transparent pricing. Love Nxcar!	Sold Brezza	5	2026-01-29 09:03:06.134251	\N
12	Divya L.	Indore	/images/sell-car-couple.png	From inspection to delivery, everything was perfect!	Bought Compass	4	2026-01-29 09:03:06.156358	\N
13	Sanjay M.	Gurgaon	/images/delivery-moment.png	Got 50K more than other dealers offered!	Sold Polo	5	2026-01-29 09:03:06.178346	\N
14	Pooja R.	Noida	/images/loan-happy.png	Easy EMI options. Finally own my dream SUV!	Bought Hector	5	2026-01-29 09:03:06.200248	\N
15	Aditya K.	Coimbatore	/images/sell-car-couple.png	Nxcar made buying used car stress-free!	Bought Virtus	5	2026-01-29 09:03:06.221703	\N
16	Rahul S.	Delhi	/images/delivery-moment.png	Sold my Swift in 2 hrs! Unbeatable price.	Sold Swift	5	2026-01-29 13:45:10.508003	\N
17	Amit V.	Bangalore	/images/loan-happy.png	Loan approved in 24hrs. Hassle-free.	Bought Creta	5	2026-01-29 13:45:10.531553	\N
18	Sneha G.	Mumbai	/images/sell-car-couple.png	Nxcar handled RC transfer perfectly.	Sold City	5	2026-01-29 13:45:10.551887	\N
19	Priya M.	Pune	/images/delivery-moment.png	Amazing experience! Got the best price for my old car.	Sold Creta	5	2026-01-29 13:45:10.572406	\N
20	Vikram R.	Chennai	/images/loan-happy.png	Super fast loan approval. Drove home my dream car!	Bought Fortuner	5	2026-01-29 13:45:10.592372	\N
21	Neha K.	Hyderabad	/images/sell-car-couple.png	Seamless RC transfer. No stress at all!	Sold Swift	5	2026-01-29 13:45:10.612826	\N
22	Arjun S.	Jaipur	/images/delivery-moment.png	Best used car platform in India. Highly recommend!	Bought XUV700	5	2026-01-29 13:45:10.633544	\N
23	Meera P.	Ahmedabad	/images/loan-happy.png	Got my loan in just 4 hours. Incredible service!	Bought Seltos	5	2026-01-29 13:45:10.654219	\N
24	Raj T.	Kolkata	/images/sell-car-couple.png	Sold my car at doorstep. Very convenient!	Sold City	5	2026-01-29 13:45:10.674707	\N
25	Ananya G.	Chandigarh	/images/delivery-moment.png	Inspection report was so detailed. Felt confident buying.	Bought Nexon	5	2026-01-29 13:45:10.695427	\N
26	Karthik V.	Lucknow	/images/loan-happy.png	Professional team, transparent pricing. Love Nxcar!	Sold Brezza	5	2026-01-29 13:45:10.71639	\N
27	Divya L.	Indore	/images/sell-car-couple.png	From inspection to delivery, everything was perfect!	Bought Compass	4	2026-01-29 13:45:10.736409	\N
28	Sanjay M.	Gurgaon	/images/delivery-moment.png	Got 50K more than other dealers offered!	Sold Polo	5	2026-01-29 13:45:10.756676	\N
29	Pooja R.	Noida	/images/loan-happy.png	Easy EMI options. Finally own my dream SUV!	Bought Hector	5	2026-01-29 13:45:10.777084	\N
30	Aditya K.	Coimbatore	/images/sell-car-couple.png	Nxcar made buying used car stress-free!	Bought Virtus	5	2026-01-29 13:45:10.79734	\N
\.


--
-- Data for Name: user_car_preferences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_car_preferences (id, session_id, budget_min, budget_max, preferred_brands, preferred_fuel_types, preferred_transmissions, preferred_locations, max_kilometers, min_year, usage_type, updated_at) FROM stdin;
1	YOQ6cuI3GH32RVTVCoO4cVR5eYkCxW27	1500000	3650000	{}	{}	{}	\N	100000	2018	\N	2026-01-28 17:33:25.117249
2	HIkGOXD59GVgzkWxn4khzelu3HDuP13Q	300000	1500000	{Hyundai}	{CNG}	{Automatic}	\N	100000	2018	family	2026-01-29 06:54:47.893652
3	Gh1wtyiOPWBvIV77_R0lDl9FdM5KNxRC	1500000	3900000	{}	{Petrol}	{Automatic}	\N	100000	2018	daily_commute	2026-01-29 08:21:31.076641
4	OTNwNDszaRtvcTDSDzlBXRI8qwmQRZvU	1000000	1500000	{Hyundai}	{Petrol}	{}	\N	60000	2018	family	2026-01-30 09:50:55.9
5	v1A8HO8xPjY0n0DUplhHQ6pTyWOjn-3W	100000	5000000	{}	{}	{}	\N	100000	2018	\N	2026-01-30 11:20:53.563265
\.


--
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_favorites (id, session_id, car_id, created_at) FROM stdin;
5	OTNwNDszaRtvcTDSDzlBXRI8qwmQRZvU	7	2026-01-30 09:52:58.479093
6	OTNwNDszaRtvcTDSDzlBXRI8qwmQRZvU	22	2026-01-30 10:12:33.965374
7	vm9Ssqqw0btBuXdK8UJ4Whljcv9bm64g	22	2026-01-30 14:27:54.901117
8	8ouWt64Y3VdPWr2zWYpT8osIbIGuvoJ_	17	2026-01-30 14:27:55.942323
9	pHmT7YIYn3MyRfOtp8WA449S8lZmHdD7	19	2026-01-30 14:27:56.988789
10	5WNlFj5V5DJit7r7JKl6mth4dd7QUYnh	18	2026-01-30 14:27:59.511976
11	e9fQeF6niNjpfbMP26SDrhL8jzRi5Fvs	26	2026-01-30 14:28:00.621079
12	qbpljld5-WvRztXyefoXQQDx4yoFMceN	16	2026-01-30 14:28:01.996217
13	aq89AfDT-bjFq5Tk82339yZYni9Lblpe	48169	2026-02-20 05:59:19.708276
14	34sg-AwJxZXTX1btnAd9Jpgxrsw0a8Hi	48169	2026-02-20 05:59:20.215424
20	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	48813	2026-02-24 06:43:33.878979
22	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	46553	2026-02-24 09:49:51.536935
23	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	46570	2026-02-24 09:49:52.95039
27	75cf3546-172a-4662-9b60-7ec5aedba753	48588	2026-02-25 07:09:09.34511
28	75cf3546-172a-4662-9b60-7ec5aedba753	48476	2026-02-25 07:09:25.595107
29	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	49817	2026-03-05 07:18:19.472631
30	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	49809	2026-03-05 07:18:21.50384
31	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	50040	2026-03-05 07:18:45.280806
32	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	49871	2026-03-05 07:31:44.369612
33	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	49862	2026-03-05 07:31:45.152898
35	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	50053	2026-03-05 07:32:40.750315
36	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	50050	2026-03-05 07:32:49.526729
37	e8bb3a23-2d10-46f1-8741-c651e1c94a4e	50043	2026-03-05 07:32:50.382437
38	71e3142c-2080-4ca4-b911-e6c46801a566	50040	2026-03-05 09:19:51.706434
41	71e3142c-2080-4ca4-b911-e6c46801a566	50075	2026-03-05 09:22:12.950993
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at, phone, city) FROM stdin;
53856997	parshant786yadav@gmail.com	\N	\N	\N	2026-01-28 09:45:11.535469	2026-01-28 09:45:11.535469	\N	\N
47507075	parshant.yadav@nxfin.in	PARSHANT	YADAV	\N	2026-02-17 09:02:24.564302	2026-02-17 09:02:24.564302	\N	\N
75cf3546-172a-4662-9b60-7ec5aedba753	\N	\N	\N	\N	2026-02-24 06:09:08.390123	2026-03-05 06:05:13.462	8447578408	\N
e8bb3a23-2d10-46f1-8741-c651e1c94a4e	parshant.yadav@nxcar.in	Parshant Yadav	\N	\N	2026-02-24 06:10:36.286888	2026-03-05 07:03:44.629	8826448907	\N
6b4f4f6e-b621-4643-94a7-089e3b160451	\N	tarun	\N	\N	2026-02-25 09:26:39.606944	2026-03-05 07:05:21.554	9368394188	\N
ab5bd99b-d4a6-4c23-af5c-8e546f83a798	\N	Rohan Khandelwal	\N	\N	2026-03-05 09:51:12.927879	2026-03-05 09:51:12.927879	7999491672	\N
71e3142c-2080-4ca4-b911-e6c46801a566	parshant@nxcar.com	Test	\N	\N	2026-02-24 10:29:22.578267	2026-03-05 10:19:45.552	9355924134	\N
\.


--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE SET; Schema: _system; Owner: neondb_owner
--

SELECT pg_catalog.setval('_system.replit_database_migrations_v1_id_seq', 7, true);


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- Name: blog_articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.blog_articles_id_seq', 40, true);


--
-- Name: car_listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.car_listings_id_seq', 14, true);


--
-- Name: car_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.car_reviews_id_seq', 1, false);


--
-- Name: cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cars_id_seq', 30, true);


--
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.conversations_id_seq', 4, true);


--
-- Name: dealer_cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dealer_cities_id_seq', 24, true);


--
-- Name: marketing_banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.marketing_banners_id_seq', 1, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.messages_id_seq', 40, true);


--
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notification_subscriptions_id_seq', 1, true);


--
-- Name: nxcar_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.nxcar_locations_id_seq', 24, true);


--
-- Name: platform_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.platform_feedback_id_seq', 3, true);


--
-- Name: sell_car_leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sell_car_leads_id_seq', 51, true);


--
-- Name: site_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.site_content_id_seq', 1, false);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 30, true);


--
-- Name: user_car_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_car_preferences_id_seq', 5, true);


--
-- Name: user_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_favorites_id_seq', 42, true);


--
-- Name: replit_database_migrations_v1 replit_database_migrations_v1_pkey; Type: CONSTRAINT; Schema: _system; Owner: neondb_owner
--

ALTER TABLE ONLY _system.replit_database_migrations_v1
    ADD CONSTRAINT replit_database_migrations_v1_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_unique UNIQUE (username);


--
-- Name: blog_articles blog_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_pkey PRIMARY KEY (id);


--
-- Name: car_listings car_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.car_listings
    ADD CONSTRAINT car_listings_pkey PRIMARY KEY (id);


--
-- Name: car_reviews car_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.car_reviews
    ADD CONSTRAINT car_reviews_pkey PRIMARY KEY (id);


--
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: dealer_cities dealer_cities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dealer_cities
    ADD CONSTRAINT dealer_cities_pkey PRIMARY KEY (id);


--
-- Name: marketing_banners marketing_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.marketing_banners
    ADD CONSTRAINT marketing_banners_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notification_subscriptions notification_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_subscriptions
    ADD CONSTRAINT notification_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: nxcar_locations nxcar_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nxcar_locations
    ADD CONSTRAINT nxcar_locations_pkey PRIMARY KEY (id);


--
-- Name: platform_feedback platform_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_feedback
    ADD CONSTRAINT platform_feedback_pkey PRIMARY KEY (id);


--
-- Name: sell_car_leads sell_car_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sell_car_leads
    ADD CONSTRAINT sell_car_leads_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: site_content site_content_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_pkey PRIMARY KEY (id);


--
-- Name: site_content site_content_section_key_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_section_key_unique UNIQUE (section_key);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: user_car_preferences user_car_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_car_preferences
    ADD CONSTRAINT user_car_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_car_preferences user_car_preferences_session_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_car_preferences
    ADD CONSTRAINT user_car_preferences_session_id_unique UNIQUE (session_id);


--
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_unique UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_replit_database_migrations_v1_build_id; Type: INDEX; Schema: _system; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_replit_database_migrations_v1_build_id ON _system.replit_database_migrations_v1 USING btree (build_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: car_reviews car_reviews_car_id_cars_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.car_reviews
    ADD CONSTRAINT car_reviews_car_id_cars_id_fk FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;


--
-- Name: messages messages_conversation_id_conversations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_conversations_id_fk FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: user_favorites user_favorites_car_id_cars_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_car_id_cars_id_fk FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict x89A35UWnMtulQw2wlAzRcoXJycMprxV3ylzjv4O1BjCzBEMbual9N57tXU0SWX

