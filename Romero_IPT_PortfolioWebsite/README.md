# Kyle Romero  
**BSIT 2A**

---

## Project Overview

This is a portfolio designed with a **dark and minimalist ambience**. It was built using **HTML, CSS, JavaScript, and a little bit of Bootstrap**.

### Homepage Includes:
- Navigation bar (Home, Skills, Projects, Testimonials, Contact)
- Website owner's name
- Course and block
- Specialization

When you scroll down:
- GitHub repositories section (currently no repositories to fetch)
- Projects section:
  - Project image
  - Title
  - Short description
  - Technologies used
- About Me section:
  - Name
  - Area of interest
  - LinkedIn account link
- Location map showing current location (Daet, Camarines Norte)
- Testimonial section (connected to a real database using PHP)
- “Message Me” button to submit messages to the portfolio owner

---

##  APIs Used

- **Google Fonts API** – Loads fonts like *DM Sans* and *Bebas Neue*
- **Leaflet.js** – Displays a map pinpointing Daet, Camarines Norte
- **EmailJS** – Handles email delivery from the message page
- **MySQL** – Stores and retrieves testimonial submissions


---

## testimonial features

The testimonial feature allows visitors to leave a review directly on the portfolio.

### how it works

1. The user fills out a form with:
   - Name  
   - Optional role/company  
   - Message  
   - Star rating  

2. The form is validated before submission.

3. Valid submissions are sent to a PHP script which inserts the data into a MySQL database via XAMPP.

4. All stored testimonials are:
   - Fetched from the database through a PHP endpoint
   - Displayed on page load in the **"What People Say"** section
   - Showing:
     - Author's name
     - Role
     - Message
     - Star rating

5. Users receive:
   - Inline error messages
   - Success/error toast notifications

---

## how to run

### local (no database)

1. Download the project folder  
2. Extract it (if zipped)  
3. Locate `index.html`  
4. Open `index.html`  

---

### local (with database)

1. Download and extract the project folder  
2. Download and install **XAMPP**  
3. Run **MySQL** and **Apache** in the XAMPP Control Panel  
4. Place the project folder inside:  
