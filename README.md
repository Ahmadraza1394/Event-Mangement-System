# Event Management System

The Event Management System is a web application designed to manage various types of events, including school events, weddings, and conferences.

## Features

- Create and manage different types of events.
- Organize event details such as date, location, and attendees.
- Customize event settings and permissions.

## Technologies Used

- Frontend: HTML, CSS, JavaScript, EJS view engine
- Backend: NodeJs, ExpressJs,SQL
- Database: Oracle (credentials required)

## Getting Started
1. Clone the repository: `git clone https://github.com/Ahmadraza1394/Event-Mangement-System`
2. Navigate to the project directory: `cd event-management-system`
3. Install dependencies: `npm install`
4. Set up Oracle database credentials:
   - Add your Oracle database credentials in dbConfig.js using the following format:
     ```javascript
     module.exports = {
       user: 'your_username',
       password: 'your_password',
       connectString: 'your_connection_string'
     };
     ```
5. Run the application: `npm start`


