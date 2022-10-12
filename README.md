# capstone-project-3900-t12a-jack-j
Hi! im Jath
# Frontend

## Pre-requisites: NPM, nodeJS(?)
Just install nodeJS, NPM comes with it:

### Windows command-line install
Whilst you can install NodeJS onto Windows natively, we recommend installing it via the Windows Subsystem for Linux. Simply open up a WSL terminal and run the following commands:
```
sudo apt update
sudo apt install nodejs
```
### MacOS command-line install
```
brew install node
```

### Linux command-line install
```
sudo apt update
sudo apt install nodejs
```



## Setting up & running the project

1. Navigate to the "frontend-react-app" directory
2. Run `$ npm install` after git cloning the repo to install all dependencies needed for the project
3. To run the project, run `$ npm start`

## Notes for collaborators

### Package manager
*We are using npm only!! No yarn.*
* dependencies are all stored in package.json, but no need to mess with it

### CSS modules
Importing normal .css files in react imports it globally to be used across the entire application. So we are using CSS modules to help import it for a single JS file only.

To use:
* Rename css file with .module.css
* Code for importing `import styles from 'filename.module.css'`
* In js file, use className like this
`<div className={styles.app}>`
instead of 
`<div className="app">`

### Components
"assets" and "components" folder inside src:
* Each component is in a separate file in "components" folder
* Import a component by adding `import componentName from './components/componentFile.js';`

### Template for component files
```
import React from 'react';

// component function here
const componentName = () => {
  ...
  return <...jsx code...>;
}

export default componentName;
```

### Material UI - a library of pre-made components
Pretty handy if you want to just copy something pre-made. Not recommended if you are going to make a lot of changes to it tho.

Install the library via its website.


### How to run from lightweight ubuntu
```
sudo su

apt-get update
apt install nodejs
apt install npm
apt install python3-pip

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql

cd backend-flask-app
pip install -r requirment.txt

exit
sudo -u postgres psql
create user root superuser
sudo su
cd backend-flask-app
./regen.sh
```
To run sentiment analysis

```
dropdb comp3900
createdb comp3900
psql -f db.sql comp3900
python3 run_sentiment.py
./regen.sh
```

Open 2 terminals

1st Terminal
```
sudo su
cd backend-flask-app
python3 api.py

```

2nd Terminal
```
cd frontend-react-app
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install @material-ui/core
npm install formik
npm start
```
if nodejs version is not version 16 run

```
sudo su
cd frontend-react-app
apt upgrade nodejsnpm st 
npm install
npm start
```

if pyjwt is not 
```
pip install 'pyjwt==2.3.0'
```



