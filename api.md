## /api/v1

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
    userId String @id @default(uuid())
    username String
    email String @unique
    hashedPassword String
    profilePictureUrl String?
    verified Boolean @default(false)
    role uROLE

    registeredParticipants EventParticipants[]
}

model Society {
    societyId String @id @default(uuid())
    username String @unique
    email String @unique
    hashedPassword String
    profilePictureUrl String?
    verified Boolean @default(false)

    createdEvents Event[]
}

model Event {
    eventId String @id @default(uuid())
    name String
    description String?
    venue String?
    registrationLink String?
    registrationDeadline DateTime?
    contactEmail String?
    bannerImage String?
    tags String[]
    eventStatus eSTATUS @default(DRAFT)

    eventAuthorId String

    schedule EventSchedule[]
    links EventLink[]
    registeredParticipants EventParticipants[]

    authorSociety Society @relation(fields: [eventAuthorId], references: [societyId], onDelete: Cascade)
}

model EventSchedule {
    id Int @id @default(autoincrement())
    eventId String
    date DateTime
    startTime DateTime
    endTime DateTime

    event Event @relation(fields: [eventId], references: [eventId], onDelete: Cascade)
}

model EventParticipants {
    id Int @id @default(autoincrement())
    userId String
    eventId String
    
    user User @relation(fields: [userId], references: [userId], onDelete: Cascade)
    event Event @relation(fields: [eventId], references: [eventId], onDelete: Cascade)

    @@unique([userId, eventId])
}

model EventLink {
    id        String    @id @default(uuid())
    eventId   String
    linkTypeId Int
    linkUrl   String

    event     Event     @relation(fields: [eventId], references: [eventId], onDelete: Cascade)
    linkType  LinkTypes @relation(fields: [linkTypeId], references: [id], onDelete: Restrict)
}

model LinkTypes {
    id Int @id @default(autoincrement())
    name String @unique
    image String?
    links EventLink[]
}

enum uROLE {
    USER
    ADMIN
}

enum eSTATUS {
    DRAFT
    PUBLISHED
}
