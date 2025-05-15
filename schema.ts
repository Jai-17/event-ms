// USER
interface userSchema {
  id: string,
  name: string,
  email: string,
  password: string,
  profilePic: string,
  registeredEvents: [{eventId: string}],
  role: "USER" | "ADMIN",
};

// SOCIETY USER
interface societyUser {
  id: string,
  name: string,
  email: string,
  password: string,
  profilePic: string,
  createdEvents: string[],
  socialLinks: [
    {
      type: string,
      url: string
    }
  ]
}

// EVENTS
interface eventSchema {
  id: string,
  name: string,
  description: string,
  venue: string,
  schedule: {data: string; timeRange: [Date, Date]}[],
  registrationLink: string,
  registrationDeadline: Date,
  tags: typeCategories[],
  links: [{type: string, name: string, url: string}],
  contactEmail: string,
  bannerImage: string,
  status: "DRAFT" | "PUBLISHED",
  createdBy: string,
  collaborators: societyUser[]
}

// CATEGORIES
interface typeCategories {
  id: string,
  name: string,
}

// REGISTRATION TABLE
interface registrationSchema {
  id: string
  eventId: string
  userId: string
  registrationTime: Date
}