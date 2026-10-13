-- =========================================================================
-- DATABASE INITIALIZATION & SEED DATA SCRIPT: VIETAI LIFE
-- Hệ Quản Trị CSDL: Microsoft SQL Server 2022+ / Azure SQL
-- =========================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'VietAILifeDb')
BEGIN
    CREATE DATABASE VietAILifeDb;
END
GO

USE VietAILifeDb;
GO

-- 1. BẢNG ROLES & PERMISSIONS
IF OBJECT_ID(N'dbo.Roles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Roles (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(50) NOT NULL UNIQUE,
        NormalizedName NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(255) NULL,
        RoleType INT NOT NULL DEFAULT 1,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NULL
    );

    INSERT INTO dbo.Roles (Name, NormalizedName, Description, RoleType) VALUES
    ('SuperAdmin', 'SUPERADMIN', N'Toàn quyền quản trị hệ thống VietAI Life', 7),
    ('Admin', 'ADMIN', N'Quản trị viên nghiệp vụ và chi phí', 6),
    ('Researcher', 'RESEARCHER', N'Nhà nghiên cứu AI và đánh giá Benchmark', 3),
    ('ContentManager', 'CONTENTMANAGER', N'Quản lý kho tri thức kiến thức', 4),
    ('Support', 'SUPPORT', N'Chăm sóc và hỗ trợ người dùng', 2),
    ('User', 'USER', N'Người dùng thành viên tiêu chuẩn', 1);
END
GO

-- 2. BẢNG USERS & PROFILES
IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        Email NVARCHAR(256) NOT NULL UNIQUE,
        NormalizedEmail NVARCHAR(256) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(512) NOT NULL,
        SecurityStamp NVARCHAR(256) NOT NULL,
        IsEmailConfirmed BIT NOT NULL DEFAULT 1,
        Status INT NOT NULL DEFAULT 1,
        CreatedBy NVARCHAR(100) NULL,
        UpdatedBy NVARCHAR(100) NULL,
        IsDeleted BIT NOT NULL DEFAULT 0,
        DeletedAt DATETIMEOFFSET NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NULL,
        RowVersion ROWVERSION
    );

    CREATE TABLE dbo.UserProfiles (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        UserId UNIQUEIDENTIFIER NOT NULL UNIQUE FOREIGN KEY REFERENCES dbo.Users(Id) ON DELETE CASCADE,
        FullName NVARCHAR(100) NOT NULL,
        PhoneNumber VARCHAR(20) NULL,
        AvatarUrl NVARCHAR(1000) NULL,
        Bio NVARCHAR(500) NULL,
        Occupation NVARCHAR(100) NULL,
        Location NVARCHAR(100) NULL,
        CreatedBy NVARCHAR(100) NULL,
        UpdatedBy NVARCHAR(100) NULL,
        IsDeleted BIT NOT NULL DEFAULT 0,
        DeletedAt DATETIMEOFFSET NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NULL,
        RowVersion ROWVERSION
    );
END
GO

-- 3. BẢNG KNOWLEDGE CATEGORIES & SOURCES
IF OBJECT_ID(N'dbo.KnowledgeCategories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.KnowledgeCategories (
        Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(100) NOT NULL,
        Slug NVARCHAR(100) NOT NULL UNIQUE,
        Description NVARCHAR(500) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        UpdatedAt DATETIMEOFFSET NULL
    );

    INSERT INTO dbo.KnowledgeCategories (Name, Slug, Description) VALUES
    (N'Giáo dục & Ngoại ngữ', 'giao-duc', N'Tài liệu ôn thi VSTEP, B1, IELTS, bài tập phổ thông và đại học'),
    (N'Công nghệ & Lập trình', 'cong-nghe', N'Lộ trình Full-stack Developer, C# .NET, React, AI Engineering'),
    (N'Kinh doanh & SME', 'kinh-doanh', N'Kế hoạch kinh doanh, tài chính, marketing số và quản lý khách hàng'),
    (N'Nông nghiệp Thông minh', 'nong-nghiep', N'Kỹ thuật canh tác, sâu bệnh cây trồng, khuyến nông Việt Nam');
END
GO

PRINT 'VietAI Life Database Initialized and Seeded Successfully!';
