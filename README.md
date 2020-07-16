## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

NB: I've tried several configurations for setting up react testing files with the react testing library but cannot get the test files to work, even with the basic samples provided. I've had to omit unit test files as a result.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## App Structure

The app is built with a mobile first approach with flexbox. There are no CSS frameworks loaded, as the styling is minimal. A fixed footer containing pagination for post results appears on smaller screen sizes. On larger screen sizes, the previous and next buttons appear to the left and right of the results. Buttons will hide if no results are found. The previous button will hide if no previous pages remain, and the next button will hide if no addtional pages remain.

The results on larger screen have their own inner scrollbar - this is to allow the buttons to the left and right to always be on the screen, fixed at half it's current height.

Content for the posts can be optionally shown or hidden with a toggle button, and the titles of the posts link to their content on reddit.

## Hotkeys

On larger screens, hotkeys can be used to trigger the next and previous buttons or return focus to the search input. 

1) Alt & N - this triggers the next results
2) Alt & P - this triggers the previous results
3) Alt & / - this focuses on the search field

## Sanitisation

Sanitise HTML (https://www.npmjs.com/package/sanitize-html) is used to clean any text received from, or sent to, reddit.

## HTTP client

Axios (https://www.npmjs.com/package/axios) is used as the HTTP Client.

## Material UI

Material UI (https://material-ui.com/) is used for stock components such as spinners, buttons and inputs.

## Font Awesome

The official Font Awesome library for react (https://www.npmjs.com/package/@fortawesome/react-fontawesome) is used for all graphical imagery.






