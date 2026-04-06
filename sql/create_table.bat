@echo off
cd /d "%~dp0"
mysql -u root -pMySecurePassword@123 < promotion_db_create_table.sql
