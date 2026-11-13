# MongoDB Database Schema

FCIT 2.0 models 15 collections in MongoDB via Mongoose with automatic `createdAt` / `updatedAt` timestamps, normalized `slug` indexes, and role based governance.

## Collections Summary

1. **`users`** — Authentication accounts & roles (`super_admin`, `admin`, `faculty`, `team_member`, `student`, `visitor`), hashed password (`bcryptjs`), `isActive`, `lastLoginAt`.
2. **`faculty`** — `name`, `slug`, `designation`, `department`, `qualifications[]`, `expertise[]`, `photo`, `photoAlt`, `photoPosition` (`object-top | object-center | object-bottom`), `profileUrl`, `verificationStatus`, `displayOrder`, `isPublished`.
3. **`teamMembers`** — `name`, `slug`, `designation`, `academicYear`, `department`, `introduction`, `photo`, `photoAlt`, `photoPosition` (`object-top | object-center | object-bottom`), `linkedin`, `github`, `email` (stripped from public API unless `showEmailPublicly: true`), `showEmailPublicly`, `verificationStatus`, `displayOrder`, `isPublished`.
4. **`teams`** — Annual executive cohort records (`academicYear`, `title`, `description`, `isCurrent`, `members: [ObjectId -> TeamMember]`).
5. **`events`** — `title`, `slug`, `category`, `poster`, `posterAlt`, `date`, `endDate`, `venue`, `summary`, `description`, `registrationLink`, `registrationDeadline`, `capacity`, `status` (`upcoming | ongoing | completed | draft`), `isPublished`.
6. **`eventRegistrations`** — `eventId` (ref `Event`), `studentName`, `email`, `rollNumber`, `branch`, `year`, `notes`, `status`.
7. **`history`** — `year`, `title`, `shortTitle`, `slug`, `category`, `layoutVariant` (`auto | full-bleed | studio-split | collage | emblem-seal | archival-draft`), `description`, `primaryImage`, `primaryImageAlt`, `additionalImages[]`, `highlights[]`, `relatedEvents[]`, `relatedEventIds[]`, `contributors[]`, `historicalSource`, `verificationStatus`, `displayOrder`, `isPublished`.
8. **`galleryAlbums`** — `title`, `slug`, `category`, `year`, `description`, `coverImage`, `coverImageAlt`, `displayOrder`, `isPublished`.
9. **`galleryImages`** — `albumId` (ref `GalleryAlbum`), `title`, `caption`, `imageUrl`, `altText`, `category`, `year`, `photographer`, `displayOrder`, `isPublished`.
10. **`achievements`** — `title`, `slug`, `category`, `year`, `dateLabel`, `recipients[]`, `summary`, `details`, `proofUrl`, `image`, `imageAlt`, `verificationStatus`, `isPublished`.
11. **`projects`** — `title`, `slug`, `domain`, `techStack[]`, `authors[]`, `year`, `summary`, `repositoryUrl`, `demoUrl`, `thumbnail`, `thumbnailAlt`, `status`, `isPublished`.
12. **`alumni`** — `name`, `slug`, `graduationYear`, `degree`, `currentRole`, `organization`, `location`, `mentorshipAreas[]`, `story`, `photo`, `photoAlt`, `linkedin`, `verificationStatus`, `isPublished`.
13. **`resources`** — `title`, `slug`, `category` (`dsa | roadmap | workshop | notes | placement | reference`), `level`, `description`, `resourceUrl`, `fileUrl`, `contributor`, `tags[]`, `isPublished`.
14. **`announcements`** — `title`, `slug`, `summary`, `category`, `linkUrl`, `priority`, `expiresAt`, `isPublished`.
15. **`contactMessages`** — `name`, `email`, `subject`, `category`, `message`, `status` (`new | in_review | resolved`), `adminNotes`.
