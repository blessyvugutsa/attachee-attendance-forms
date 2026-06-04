-- 1. Table to store already registered individuals using Email as the main identifier
CREATE TABLE attachees (
    email VARCHAR(100) PRIMARY KEY,        -- No extra ID column needed!
    full_name VARCHAR(100) NOT NULL,
    institution VARCHAR(100) NOT NULL,     
    department VARCHAR(100) NOT NULL,      
    [span_0](start_span)category VARCHAR(50) NOT NULL,          -- 'attachee', 'employer', or 'volunteer'[span_0](end_span)
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table to handle daily clock-in and clock-out details linked via Email
CREATE TABLE attendance_logs (
    attachee_email VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    [span_1](start_span)time_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Captures clock-in automatically[span_1](end_span)
    time_out TIMESTAMP NULL DEFAULT NULL,        -- Captured at clock-out
    [span_2](start_span)verified_ip VARCHAR(45) NOT NULL,            -- Confirms Hub Wi-Fi connection[span_2](end_span)
    FOREIGN KEY (attachee_email) REFERENCES attachees(email),
    -- The primary key is now a combination of the email and the date.
    -[span_3](start_span)- This perfectly ensures one person can only log attendance once per day[span_3](end_span)!
    PRIMARY KEY (attachee_email, log_date)
);