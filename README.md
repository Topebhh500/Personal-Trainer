# Personal Trainer Application

A React-based web application for managing personal training customers and their training sessions. The application allows personal trainers to manage their customer database, schedule training sessions, and view their calendar.

## Features

- **Customer Management**
  - View list of customers with search and filtering
  - Add new customers
  - Edit existing customer information
  - Delete customers (with confirmation)
  - Export customer list to CSV

- **Training Management**
  - View all training sessions
  - Add new training sessions for customers
  - Delete training sessions
  - Filter and search training sessions

- **Calendar View**
  - View training sessions in a calendar format
  - Multiple view options (month/week/day)
  - Interactive event display
  - Quick view of training details

## Technologies Used

- React 18
- Material-UI (MUI) 5
- AG-Grid for data tables
- React Router for navigation
- React Big Calendar for calendar view
- Date-fns for date manipulation
- Vite for build tooling

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-trainer.git
cd personal-trainer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
personal-trainer/
├── src/
│   ├── components/
│   │   ├── CustomerList.jsx
│   │   ├── TrainingList.jsx
│   │   ├── TrainingCalendar.jsx
│   │   ├── CustomerDialog.jsx
│   │   ├── TrainingDialog.jsx
│   │   └── Navigation.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── exportUtils.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## API Integration

The application integrates with a REST API for data management. The base URL for the API is:
```
https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/
```

Key endpoints:
- `/customers` - Customer management
- `/trainings` - Training session management
- `/gettrainings` - Get trainings with customer information

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment

The application can be deployed to any static hosting service. For Netlify deployment:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy

## Features in Detail

### Customer Management
- Full CRUD operations
- Search functionality
- Export to CSV
- Confirmation dialogs for destructive actions

### Training Management
- Schedule new training sessions
- Date and time picker for session scheduling
- Duration tracking
- Client association

### Calendar View
- Interactive calendar interface
- Multiple view options
- Event details on hover
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- RESTful API provided by Haaga-Helia UAS
- Material-UI for the component library
- AG-Grid for the powerful data grid functionality

## Contact

Temitope Ajayi - bhh500@myy.haaga-helia.fi
Project Link: https://github.com/Topebhh500/Personal-Trainer
