# IFC Studio - Modern BIM Web Application

## Introduction

IFC Studio is a web-based Building Information Modeling (BIM) application that revolutionizes the traditional construction design workflow. While architects and engineers traditionally use software like 3ds Max for prototyping and construction modeling, IFC Studio brings this capability to the web with real-time collaboration features.

This application accelerates the design and construction process by allowing clients to view and interact with 3D models directly in the browser. Any updates requested by the client are automatically applied, synchronized, and sent to the server, which manages the project and ensures the application stays up-to-date.

## Industry Context

### Traditional BIM Software
- **Autodesk Revit**
- **Graphisoft ArchiCAD**
- **Bentley Systems MicroStation**
- **Tekla Structures**
- **Nemetschek Allplan**

### What is BIM?
Building Information Modeling (BIM) is a process for creating and managing digital representations of the physical and functional characteristics of buildings. BIM enables architects, engineers, project manager  and construction professionals to collaborate on a shared model, improving efficiency and reducing errors throughout the building lifecycle

BIM enables:
- Centralized data management for construction projects
- Collaboration between stakeholders
- Improved project visualization and analysis
- Reduced errors and rework

## Technical Foundation

### IFC (Industry Foundation Classes)
Industry Foundation Classes (IFC) is an open, vendor-neutral file format developed by buildingSMART to facilitate interoperability between different BIM software applications. IFC serves as a standard for exchanging building and construction data, ensuring that models can be shared and edited across various platforms without losing critical information.

### Project Overview
This project consists of two main components:
1. Customer-Facing Web Application:
- Allows customers to view and interact with a 3D model of the building.
- Provides tools to make immediate edits to the model (e.g., changing colors, moving elements, or view properties).
- Sends the updated IFC file to the server for further processing.
2. Server-Side Revit Integration:
- Hosts the Revit API to process updates received from the web application.
- Updates the original Revit model with the changes made by the customer.
- Generates a new IFC file with the updated information and sends it back to the web application for further use.

### Technology Stack
- **Frontend**: Three.js via ThatOpen Components framework
- **IFC Processing**: engine_web-ifc(C++ compiled to WebAssembly)
- ** Thatopen* - engine_components*: This library is a collection of BIM tools based on Three.js and other libraries.
- **Backend**: .NET Core with Revit API integration
- **Data Management**: Fragment-based model control

## Features
- Real-time 3D model viewing and editing
- Automatic updates and synchronization
- Property inspection and modification
- Fragment-based model control
- Server-side integration with Revit

---
## Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **.NET Core** (v6.0 or higher) for server components
- **Revit API .NEt
  

### Steps
1. Clone the repository:

```bash
   git clone https://github.com/Ibrahimgabrieel/IFCStudio.git
  ```
 ```bash
    npm install
  ```
```bash
   npm run dev
  ```

   
## Current Progress

### Achievements
1. **IFC File Support**: The application can load and process IFC files using the `web-ifc` library, which is built on C++ and compiled to WebAssembly for efficient 3D model handling.
2. **3D Modeling Framework**: The frontend is built using the ThatOpen Components framework, which is based on the popular Three.js library for 3D rendering.
3. **Fragment-Based Control**: Models are divided into fragments, allowing users to inspect and modify individual components and their properties.
4. **Automatic Updates**: Changes made to the model are saved and synchronized with the server in real-time.
5. **Server Integration**: The backend, built on .NET Core, integrates with the Revit API to handle advanced BIM operations and manage project data.

---
## Next Steps
1. Sending the Updated IFC File to the Server
The next step is to implement functionality to send the updated IFC file to the server. This will involve:
•	File Transfer: The web application will send the updated IFC file to the server via an API endpoint.
•	File Storage: The server will store the updated IFC file for further processing.
2. Server-Side Processing with Revit API
Once the updated IFC file is received by the server, the Revit API will be used to:
•	Apply Updates to the Revit Model: The server will process the changes made in the IFC file and apply them to the original Revit model.
•	Add Additional Information: The Revit API can be extended to include additional data, such as: 
o	Cost of Materials: Calculate and update the cost of materials based on the changes made.
o	Structural Analysis: Perform structural analysis and update the model with relevant data.
o	Custom Annotations: Add custom annotations or metadata to the model.
3. Returning the Updated IFC File to the Web Application
After processing the updates, the server will:
•	Generate a new IFC file with the updated information.
•	Send the updated IFC file back to the web application for further review by the customer.




