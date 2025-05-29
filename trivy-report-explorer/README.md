# Trivy Report Explorer

A React web application to view, filter, and analyze various Trivy scan reports including vulnerability scans and EKS CIS benchmark reports.

## Features

- Upload and parse multiple Trivy JSON report formats:
  - Vulnerability scan reports
  - EKS CIS benchmark reports
  - Support for additional report types can be added easily
- View findings in a sortable and filterable table
- Filter by severity, status, resource type, and more
- Sort by severity, resource, or count
- View detailed information for each finding
- GitHub-inspired look and feel
- Responsive design for all devices

## Generating Trivy Reports

### Vulnerability Scan Reports

Generate a vulnerability scan report using the following commands:

```bash
# For container images
trivy image --format json -o trivy-report.json [image-name]

# For filesystem
trivy fs --format json -o trivy-report.json [path/to/project]

# For Kubernetes clusters
trivy k8s --format json -o trivy-report.json cluster
```

### EKS CIS Benchmark Reports

Generate an EKS CIS benchmark report:

```bash
# For EKS clusters
trivy k8s --format json -o eks-cis-report.json cluster --compliance=eks-cis
```

### Other Supported Reports

Trivy Report Explorer can be extended to support other Trivy report types:

```bash
# For Terraform IaC scans
trivy config --format json -o terraform-report.json [path/to/terraform/files]

# For misconfiguration detection
trivy config --format json -o misconfig-report.json [path/to/files]
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/trivy-report-explorer.git
cd trivy-report-explorer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
