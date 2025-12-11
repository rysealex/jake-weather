# 🌤️ J.A.K.E. Weather Web Application

## 📄 Overview
**J.A.K.E. Weather** is a full-stack weather platform built to be the reliable, accurate, and customizable weather source for users across the United States of America. Developed with the Software Development Life Cycle (SDLC) and documented using Microsoft Visio and Project, this app showcases robust architecture and professional development practices.

### 🛠️ Tech Stack
<p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" />
    <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
    <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white" />
</p>

* **APIs:** Google Maps API (Geocoding, Places, and Maps JavaScript), OpenWeather, and Open-Meteo
* **Documentation:** Microsoft Visio, Microsoft Project

---

## 🚀 Key Features

### 🌞 Real-time 7 Day Forecast
- Accurate, up-to-the-hour weather data.
- Detailed 7-day outlook for any specified location.

### 🗺️ Dynamic Weather Map
- Interactive map interface powered by the Google Maps API.
- Automatically pinpoints the user's current location.
- Supports standard map controls (zooming, panning).

### 🎛️ Customizable Map Overlay
- Toggle between Geographical, Wind Speed, Precipitation, and Temperature map types.
- Updates the weather map in real-time, functioning like an interactive radar for deep weather analysis.

### 🔒 Secure User Authentication
- Password encryption and secure credential handling.
- Password reset feature for account recovery.

### ⭐ Personalized Experience
- Add, edit, and delete a personalized list of favorite locations.
- Real-time favorite locations management updates for a swift, tailored experience.

### 🔎 Searching Locations
- Advanced location search using the Google Maps Geocoding and Places APIs.
- Ensures maximum flexibility for searches: city, state, address, or generic place name.

### 🐳 Docker Containerization
- Entire application runs in isolated containers for consistent deployment and local development.

---

## 🗂️ Project Documentation

### 📊 Project Plan
Defines the overall scope, schedule, milestones, phases, and tasks of the project located in the **/documentation/project-plan** folder.
#### Gantt Chart
<img src="./documentation/project-plan/gantt.png" alt="Gantt Chart" width="800"/>

### 📋 Software Requirements Specification
Includes uses cases, core functionalities, design requirements & constraints, user interfaces, sequence diagrams, and API calls of the project located in the **/documentation/software-requirements-specification** folder.
#### Use Case Diagram
<img src="./documentation/software-requirements-specification/Use Case Diagram.png" alt="Use Case Diagram" width="600"/>

#### Sequence Diagram (Display Weather Map)
<img src="./documentation/software-requirements-specification/Display Weather Map SeqDiagram.png" alt="Display Weather Map Sequence Diagram" width="600"/>

### 🛠️ Design
Covers the overall design structure including a component diagram, activity diagrams, input/output data, user interfaces, data design, data dictionary, API data, user interface navigation flow, and requirements traceability matrix for the project located in the **/documentation/design-document** folder.
#### Component Diagram
<img src="./documentation/design-document/System Component Diagram.png" alt="Component Diagram" width="800"/>

#### Activity Diagram (Controller Output)
<img src="./documentation/design-document/Controller Output Activity Diagram.png" alt="Component Diagram" width="600"/>

### 📝 Test Plan
Details all test cases for verifying system functionality and a defect management plan for the project located in the **/documentation/test-plan** folder.

### 👨🏼‍💻 Implementation
Explains the system requirements, hardware requirements, key metrics, installation steps, and execution steps for the project located in the **/documentation/implementation** folder.

### ✅ Test Report
Concludes the overall results of all test cases and final requirements traceability matrix located in the **/documentation/test-report** folder.

### 🧑‍🏫 Group Presentation
Final PowerPoint presentation available in the **/documentation/presentation** folder.

### 📂 Full Documentation
You can explore all diagrams, documents, and files in the **/documentation** folder of this repository.

---

## 🛠️ Local Setup Instructions

### ✅ Prerequisites
To run J.A.K.E. Weather locally, please ensure the following tools are installed and operational:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (installed and running)
- [Git](https://git-scm.com/)
- [Make](https://www.gnu.org/software/make/)

### 1. Clone the Repository
Open your terminal and clone the project repository, then navigate into the root directory.
```bash
git clone https://github.com/your-username/jake-weather.git
cd jake-weather
```
### 2. Configure Environment Variables
You need to create two separate environment files (.env) for the front (React) and the back (Flask). Note: Do not commit these files to GitHub!

#### A. Front (front/.env)
Obtain your free API keys for Google Maps and Open Weather Map. You will need to enable the Geocoding, Places, and Maps JavaScript APIs in the Google Cloud Console.
```bash
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here

# Google Maps Map ID (Optional: use provided ID or your own)
REACT_APP_GOOGLE_MAPS_MAP_ID=98f0afe81f205b4a5a9c1d45

# Open Weather Map API Key
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

#### B. Back (jake-weather/.env)
Configure the credentials for your MySQL database. If using Docker Compose (recommended), the default settings below should work if you only change the passwords.
```bash
# MySQL Database Configuration (Change only passwords)
MYSQL_ROOT_PASSWORD=your_mysql_root_password
MYSQL_DATABASE=jake_weather
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password

# Backend Application Database Connection
# If running with 'make run', DATABASE_HOST should be the database service name (e.g., 'db')
DATABASE_HOST=db 
DATABASE_PORT=3306
DATABASE_USER=${MYSQL_USER}
DATABASE_PASSWORD=${MYSQL_PASSWORD}
DATABASE_NAME=${MYSQL_DATABASE}

# Backend Application Configuration (Leave as is for local dev)
FLASK_APP=app.py
FLASK_ENV=development

# Open-Meteo URL (Leave as is for local dev)
OPEN_METEO_URL=https://api.open-meteo.com/v1/forecast
```

### 3. Run the Application
Ensure Docker Desktop is actively running before executing the run command. This will build the images, start the containers, and set up the database.
```bash
make run
```
Once the containers are successfully running, open your browser and navigate to the application:
http://localhost:3000

### 4. Stop and Clean Up
To cleanly shut down the application and remove the containers:
- To Stop: Press Ctrl + C in the terminal where the application is running.
- To Clean Up: Run the following command from the root project directory:
```bash
make clean
```

---

## 📱 Usage Guide
### 1. Register: Create a secure user account.

### 2. Login: Log in with your credentials.

### 3. Explore:

- View the real-time 7-day forecast for your specified location.

- Use the search bar to find weather for any city, address, or location.

- Toggle different map overlays (Wind, Precipitation, Temp) on the dynamic weather map.

- Save and manage your favorite locations for quick access.

---

## 👨‍💻 Developers

- [Alex Ryse](https://github.com/rysealex)

- [Jaewon Heo](https://github.com/jae1Heo)

- [Katelyn Wildermuth](https://github.com/Wildermuthk)

- [Eva Santana](https://github.com/AyvaWright)

Students at Central Washington University

