DROP DATABASE IF EXISTS parts;
CREATE DATABASE parts;
\c parts;

/* SET FOREIGN_KEY_CHECKS=0; */


-- ----------------------------
-- Table structure for parts
-- ----------------------------
DROP TABLE IF EXISTS parts CASCADE;
CREATE TABLE parts (
	PART_ID char(4) not null,
	PART_NAME varchar(255),
	PART_COLOR varchar(30),
	PART_WEIGHT varchar(255),
  	PRIMARY KEY (PART_ID)
);


-- ----------------------------
-- Table structure for ship_via
-- ----------------------------
DROP TABLE IF EXISTS ship_via CASCADE;
CREATE TABLE ship_via (
	SHIPPER_ID double precision NOT NULL,
	SHIPPER_NAME varchar(30),
	PRIMARY KEY (SHIPPER_ID)
);


-- ----------------------------
-- Table structure for status
-- ----------------------------
DROP TABLE IF EXISTS status CASCADE;
CREATE TABLE status (
	STATUS_ID double precision NOT NULL,
	STATUS_NAME varchar(30),
	PRIMARY KEY (STATUS_ID)
);

-- ----------------------------
-- Table structure for supplier
-- ----------------------------
DROP TABLE IF EXISTS supplier CASCADE;
CREATE TABLE supplier (
	SUPPLIER_ID varchar(10) not null,
	SUPPLIER_NAME varchar(30),
	SUPPLIER_STATUS double precision NOT NULL,
	SUPPLIER_CITY varchar(30),
	SUPPLIER_STATE varchar(2),
	PRIMARY KEY (SUPPLIER_ID),
	FOREIGN KEY (SUPPLIER_STATUS) REFERENCES status (STATUS_ID) ON DELETE CASCADE
);

-- ----------------------------
-- Table structure for supplier_parts
-- ----------------------------
DROP TABLE IF EXISTS supplier_parts CASCADE;
CREATE TABLE supplier_parts (
	SUPPLIER_ID varchar(10) not null,
	PART_ID char(4) not null,
	QUANTITY double precision NOT NULL,
	SHIPPER_ID double precision NOT NULL,
	PRIMARY KEY (SUPPLIER_ID, PART_ID),
	FOREIGN KEY (PART_ID) REFERENCES parts (PART_ID) ON DELETE CASCADE,
	FOREIGN KEY (SUPPLIER_ID) REFERENCES supplier (SUPPLIER_ID) ON DELETE CASCADE
);

--  Insert rows to Parts table

INSERT INTO parts VALUES ('P300', 'Nut', 'Red', '12');
INSERT INTO parts VALUES ('P301', 'Bolt', 'Green', '12');
INSERT INTO parts VALUES ('P302', 'Screw', 'Blue', '13');
INSERT INTO parts VALUES ('P303', 'Bolt', 'Green', '17');
INSERT INTO parts VALUES ('P304', 'Cam', 'Green', '18');
INSERT INTO parts VALUES ('P305', 'Cog', 'Red', '20');
INSERT INTO parts VALUES ('P306', 'Screw', 'Blue', '16');
INSERT INTO parts VALUES ('P307', 'Washer', 'Green', '19');
INSERT INTO parts VALUES ('P308', 'Cam', 'Yellow', '15');
INSERT INTO parts VALUES ('P309', 'Rod', 'Yellow', '14');
INSERT INTO parts VALUES ('P310', 'Cap', 'Red', '13');
INSERT INTO parts VALUES ('P311', 'Wheel', 'Green', '18');
INSERT INTO parts VALUES ('P312', 'Bolt', 'Blue', '21');
INSERT INTO parts VALUES ('P313', 'Nut', 'Blue', '11');
INSERT INTO parts VALUES ('P314', 'Screw', 'Yellow', '15');
INSERT INTO parts VALUES ('P315', 'Fastener', 'Red', '14');


-- Insert rows into the Ship_Via table

INSERT INTO ship_via VALUES (30, 'DHL');
INSERT INTO ship_via VALUES (20, 'Federal Express');
INSERT INTO ship_via VALUES (10, 'UPS');

-- Insert rows into the Status table

INSERT INTO status VALUES (10, 'Primary Supplier');
INSERT INTO STATUS VALUES (20, 'Secondary Supplier');
INSERT INTO STATUS VALUES (30, 'Third Level Supplier');

-- Insert rows into the Supplier table

INSERT INTO supplier VALUES ('S100', 'JonesX', 10, 'New York', 'NY');
INSERT INTO supplier VALUES ('S101', 'Smith', 20, 'Boston', 'MA');
INSERT INTO supplier VALUES ('S102', 'Blake', 20, 'San Francisco', 'CA');
INSERT INTO supplier VALUES ('S103', 'Clark', 30, 'Chicago', 'IL');
INSERT INTO supplier VALUES ('S104', 'Adams', 10, 'Atlanta', 'GA');
INSERT INTO supplier VALUES ('S105', 'Wilson', 30, 'Boston', 'MA');
INSERT INTO supplier VALUES ('S106', 'Franklin', 10, 'Miami', 'FL');
INSERT INTO supplier VALUES ('S107', 'Nelson', 10, 'Houston', 'TN');
INSERT INTO supplier VALUES ('S108', 'Olsen', 20, 'Atlanta', 'GA');
INSERT INTO supplier VALUES ('S109', 'Johnson', 20, 'Denver', 'CO');
INSERT INTO supplier VALUES ('S110', 'Williams', 30, 'Portland', 'OR');
INSERT INTO supplier VALUES ('S111', 'Park', 10, 'Chicago', 'IL');
INSERT INTO supplier VALUES ('S112', 'Schmidt', 20, 'Chicago', 'IL');
INSERT INTO supplier VALUES ('S113', 'Brown', 30, 'Seattle', 'WA');
INSERT INTO supplier VALUES ('S114', 'Bronson', 30, 'Orlando', 'FL');
INSERT INTO supplier VALUES ('S115', 'Spencer', 30, 'Los Angeles', 'CA');

-- Insert rows into the Supplier_Parts table

INSERT INTO supplier_parts VALUES ('S100', 'P301', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P302', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P303', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P304', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P305', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P306', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P307', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P308', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P309', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P310', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P311', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P312', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P313', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P314', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S100', 'P315', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S101', 'P300', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P302', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P303', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P304', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P305', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P306', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P307', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P308', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P309', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P310', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P311', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P312', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P313', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P314', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S101', 'P315', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S102', 'P300', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P301', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P303', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P304', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P305', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P306', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P307', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P308', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P309', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P310', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P311', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P312', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P313', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P314', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S102', 'P315', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S103', 'P300', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P301', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P302', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P304', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P305', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P306', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P307', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P308', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P309', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P310', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P311', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P312', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P313', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P314', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S103', 'P315', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P300', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P301', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P302', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P303', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P305', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P306', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P307', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P308', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P309', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P310', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P311', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P312', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P313', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P314', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S104', 'P315', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S105', 'P300', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P301', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P302', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P303', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P304', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P306', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P307', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P308', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P309', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P310', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P311', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P312', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P313', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P314', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S105', 'P315', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P300', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P301', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P302', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P303', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P304', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P305', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P307', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P308', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P309', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P310', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P311', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P312', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P313', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P314', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S106', 'P315', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S107', 'P300', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P301', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P302', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P303', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P304', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P305', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P306', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P308', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P309', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P310', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P311', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P312', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P313', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P314', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S107', 'P315', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S108', 'P300', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P301', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P302', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P303', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P304', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P305', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P306', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P307', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P309', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P310', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P311', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P312', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P313', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P314', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S108', 'P315', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P300', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P301', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P302', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P303', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P304', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P305', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P306', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P307', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P308', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P310', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P311', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P312', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P313', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P314', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S109', 'P315', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S110', 'P300', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P301', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P302', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P303', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P304', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P305', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P306', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P307', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P308', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P309', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P311', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P312', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P313', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P314', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S110', 'P315', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S111', 'P300', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P301', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P302', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P303', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P304', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P305', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P306', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P307', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P308', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P309', 400.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P310', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P312', 300.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P313', 500.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P314', 100.0, 20);
INSERT INTO supplier_parts VALUES ('S111', 'P315', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S112', 'P300', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P301', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P302', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P303', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P304', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P305', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P306', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P307', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P308', 300.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P309', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P310', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P311', 400.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P313', 500.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P314', 100.0, 30);
INSERT INTO supplier_parts VALUES ('S112', 'P315', 200.0, 30);
INSERT INTO supplier_parts VALUES ('S113', 'P300', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P301', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P302', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P303', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P304', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P305', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P306', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P307', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P308', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P309', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P310', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P311', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P312', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P314', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S113', 'P315', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S114', 'P315', 200.0, 20);
INSERT INTO supplier_parts VALUES ('S115', 'P300', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P301', 200.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P302', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P303', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P304', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P305', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P306', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P307', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P308', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P309', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P310', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P311', 400.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P312', 300.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P313', 500.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P314', 100.0, 10);
INSERT INTO supplier_parts VALUES ('S115', 'P315', 200.0, 10);

